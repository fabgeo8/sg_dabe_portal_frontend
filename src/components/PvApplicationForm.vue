<template>
    <v-card :class="{ collapse: collapse }"  max-width="960">
      <v-card-title class="pr-4">
        <span class="headline">Gesuchdetails</span>

        <v-spacer></v-spacer>
        <v-card-actions class="pr-3 pt-3">
          <v-btn
              color=""
              :class="{ collapse: isSingleForm, 'mr-3': true }"
              @click="closeDialog()"
              depressed
          >
            Abbrechen
          </v-btn>
          <v-btn
              color="primary lighten-1"
              @click="confirmSave()"
              :loading="isSaving"
              :disabled="isSaving"
              depressed
              :class="{ collapse: isSingleForm || !editedApplication }"
          >
            Speichern
          </v-btn>
        </v-card-actions>
      </v-card-title>
      <v-container v-if="!editedApplication" style="height: 400px;">
        <v-row
            class="fill-height"
            align-content="center"
            justify="center"
        >
          <v-col
              class="text-subtitle-1 text-center"
              cols="12"
          >
            Gesuch wird geladen
          </v-col>
          <v-col cols="6">
            <v-progress-linear
                color="primary accent-4"
                indeterminate
                rounded
                height="6"
            ></v-progress-linear>
          </v-col>
        </v-row>
      </v-container>
      <v-card-text v-else>
        <validation-observer
            ref="applicationFormObserver"
            v-slot="{ }"
        >
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <validation-provider
                    v-slot="{ errors }"
                    name="status"
                    rules=""
                >
                  <v-select
                      :items="applicationStatusItems"
                      item-value="value"
                      item-text="text"
                      v-model="form.application.status"
                      @change="updateStatusDate()"
                      label="Status" :error-messages="errors"
                      :disabled="formDisabled"
                  >
                  </v-select>
                </validation-provider>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-menu
                    v-model="datePicker.state1"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    :disabled="formDisabled"
                    min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <validation-provider
                        v-slot="{ errors }"
                        name="status1_date"
                        :rules="{ required: true }"
                    >
                      <v-text-field
                          v-model="formattedStatusDate"
                          label="Statusänderung"
                          :error-messages="errors"
                          readonly
                          :disabled="formDisabled"
                          v-bind="attrs"
                          v-on="on"
                      ></v-text-field>
                    </validation-provider>
                  </template>
                  <v-date-picker
                      no-title
                      locale="de-CH"
                      v-model="form.application.status_date"
                      @input="datePicker.state1 = false; formatStatusDate()"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <validation-provider
                    v-slot="{ errors }"
                    name="cleared"
                    rules=""
                >
                  <v-checkbox
                      v-model="form.application.cleared"
                      label="Gesuch ist abgerechnet"
                      :disabled="!canEditClearedStatus || formDisabled || !isClearable"
                      @change="updateClearedStatus()"
                  ></v-checkbox>
                </validation-provider>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-menu
                    v-model="datePicker.clearedDate"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    :disabled="formDisabled"
                    min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <validation-provider
                        v-slot="{ errors }"
                        name="cleared_date"
                        rules="required_if:cleared"
                    >
                      <v-text-field
                          v-model="formattedClearedDate"
                          label="Abrechnungsdatum"
                          :error-messages="errors"
                          readonly
                          :disabled="!form.application.cleared || !canEditClearedStatus || formDisabled"
                          v-bind="attrs"
                          v-on="on"
                      ></v-text-field>
                    </validation-provider>
                  </template>
                  <v-date-picker
                      no-title
                      locale="de-CH"
                      v-model="form.application.cleared_date"
                      @input="datePicker.clearedDate = false; formatClearedDate()"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field  :disabled="formDisabled"  v-model="form.application.identifier" disabled label="Gesuch-ID"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" sm="12" md="6">
                <validation-provider
                    v-slot="{ errors }"
                    name="egid"
                    rules=""
                >
                  <v-text-field :loading="loadingMaddData" append-icon="mdi-sync" @click:append="getMaddDataByEgid" :disabled="formDisabled"   v-model="form.application.object_egid" label="EGID" :error-messages="errors"></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="6" sm="12" md="6">
                <validation-provider
                    v-slot="{ errors }"
                    name="plot"
                    rules=""
                >
                  <v-text-field :disabled="formDisabled"  v-model="form.application.object_plot" disabled label="Parzelle" :error-messages="errors"></v-text-field>
                </validation-provider>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" sm="12" md="6">
                <validation-provider
                    v-slot="{ errors }"
                    name="street"
                    rules=""
                >
                  <v-text-field :disabled="formDisabled"  v-model="form.application.object_street" label="Strasse" :error-messages="errors"></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="6" sm="12" md="6">
                <validation-provider
                    v-slot="{ errors }"
                    name="streetnumber"
                    rules=""
                >
                  <v-text-field :disabled="formDisabled"  v-model="form.application.object_streetnumber" label="Hausnummer" :error-messages="errors"></v-text-field>
                </validation-provider>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" sm="12" md="6">
                <validation-provider
                    v-slot="{ errors }"
                    name="zip"
                    :rules="{regex: /[0-9]{4}$/}"
                >
                  <v-text-field :disabled="formDisabled"  v-model="form.application.object_zip" label="PLZ" :error-messages="errors"></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="6" sm="12" md="6">
                <validation-provider
                    v-slot="{ errors }"
                    name="city"
                    rules=""
                >
                  <v-text-field :disabled="formDisabled"  v-model="form.application.object_city" label="Ort" :error-messages="errors"></v-text-field>
                </validation-provider>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <validation-provider
                    v-slot="{ errors }"
                    name="municipality"
                    :rules="{required: true}"
                >
                  <v-select :items="municipalityItems" :disabled="$store.getters.getIsMunicipalityUser" item-value="id" item-text="name" v-model="form.application.municipality" label="Gemeinde" :error-messages="errors"></v-select>
                </validation-provider>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" sm="12" md="6">
                <validation-provider
                    v-slot="{ errors }"
                    name="generator_area"
                    :rules="{required: true, integer: true}"
                >
                  <v-text-field @change="updateGeneratorAreaFee()" @focus="generatorAreaActive = true;" @blur="generatorAreaActive = false;updateGeneratorAreaFee();" :disabled="formDisabled" v-model="form.application.generator_area"  :error-messages="errors" label="EBF">
                    <template slot="append">m&sup2;</template>
                  </v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="6" sm="12" md="6">
                  <v-text-field
                                disabled
                                prefix="CHF"
                                v-model="form.application.fee"
                                label="Abgabe">
                  </v-text-field>
              </v-col>
              <v-col cols="12" class="pt-0">
                <v-alert class="mt-0 white--text" v-if="generatorAreaChanged || generatorAreaActive" border="left"  dense color="warning">
                  <b>Achtung!</b> Beim Ändern der Energiebezugsfläche wird automatisch auch die Ersatzabgabe neuberechnet.
                  Die ursprünglichen Werte werden überschrieben.
                  Es wird empfohlen, die ursprünglichen Werte bei «Interne Bemerkungen» festzuhalten.</v-alert>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <validation-provider
                    v-slot="{ errors }"
                    name="remarks"
                    rules=""
                >
                  <v-textarea v-model="form.application.remark" label="Interne Bemerkung" :error-messages="errors" counter="2048" ></v-textarea>
                </validation-provider>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <p class="subtitle-1 mb-0">Aktivitäten für dieses Gesuch:</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <activity-list :activityList="activityList"></activity-list>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <h6 class="text--secondary">System-ID: {{ form.application.id }}</h6>
              </v-col>
            </v-row>
          </v-container>
        </validation-observer>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color=""
            :class="{ collapse: !isSingleForm || !editedApplication, 'mr-3': true }"
            @click="editedApplication = null; $emit('reset');"
            depressed
        >
          Schliessen
        </v-btn>
        <v-btn
            color=""
            :class="{ collapse: isSingleForm }"
            @click="closeDialog()"
            depressed
        >
          Abbrechen
        </v-btn>
        <v-btn
            color="primary lighten-1"
            @click="confirmSave()"
            :loading="isSaving"
            :disabled="isSaving"
            depressed
            :class="{ collapse: !editedApplication }"
        >
          Speichern
        </v-btn>
      </v-card-actions>

      <v-dialog
          v-model="dialog.confirmSave"
          width="500"
      >
        <v-card>
          <v-card-title class="text-h5">
            PV-Ersatzabgabe wurde geändert
          </v-card-title>
          <v-card-text class="mt-2">
            <span v-if="form.application && editedApplication">
              Sie haben die Energiebezugsfläche geändert und damit auch die Höhe der Ersatzabgabe. Wenn Sie fortfahren wird die PV-Ersatzabgabe für dieses Gesuch von
              <b>CHF {{ numberWithDelimiter(parseFloat(editedApplication.fee)) }}</b> auf <b>CHF {{ numberWithDelimiter(parseFloat(form.application.fee)) }}</b> angepasst.
              Möchten Sie die Änderungen speichern?</span>
            </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="default"
                text
                @click="dialog.confirmSave = false"
            >
              Abbrechen
            </v-btn>
            <v-btn
                color="success"
                text
                :loading="isSaving"
                :disabled="isSaving"
                @click="save()">
              Speichern
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
          v-model="dialog.confirmAddressOverwrite"
          width="500"
      >
        <v-card>
          <v-card-title class="text-h5">
            GWR Adresse für diese EGID
          </v-card-title>
          <v-card-text class="mt-2">
            <span v-if="form.application && editedApplication">
              Für die angegebende EGID wurden folgende Adressdaten aus dem GWR gefunden.<br/>
              <br/>
              <b>GWR-Adresse:</b><br/>
              Strasse: {{overwriteAddress.object_street }} <br/>
              Hausnummer: {{overwriteAddress.object_streetnumber }} <br/>
              Ort: {{overwriteAddress.object_city }} <br/>
              PLZ: {{overwriteAddress.object_zip }} <br/>
              Parzelle: {{overwriteAddress.object_plot}} <br/>
              <br/>

              <b>Bestehende-Adresse:</b><br/>
              Strasse: {{form.application.object_street }} <br/>
              Hausnummer: {{form.application.object_streetnumber }} <br/>
              Ort: {{form.application.object_city }} <br/>
              PLZ: {{form.application.object_zip }} <br/>
              Parzelle: {{form.application.object_plot}} <br/>
              <br/>
              Wollen Sie die bestehenden Adressdaten mit den GWR-Adressdaten überschreiben?
              <br>
            </span>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="default"
                text
                @click="dialog.confirmAddressOverwrite = false"
            >
              Abbrechen
            </v-btn>
            <v-btn
                color="success"
                text
                @click="overwriteFormAddress()">
              Überschreiben
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
<!--  </v-dialog>-->
</template>

<script>
import axios from 'axios'
import { showSnack } from '../globalActions'
// eslint-disable-next-line camelcase
import { required, regex, integer, required_if } from 'vee-validate/dist/rules'
import { extend, ValidationProvider, ValidationObserver, setInteractionMode } from 'vee-validate'
import ApplicationStatus from '../utils/statusPv'
import ActivityList from "./ActivityList";
import PvFeeCalculation from '../utils/pvFeeCalculation'

setInteractionMode('eager')

extend('required', {
  ...required,
  message: 'Dies ist ein Pflichtfeld'
})
extend('integer', {
  ...integer,
  message: 'Es werden nur Ganzzahlen akzeptiert.'
})

extend('required_if', {
  ...required_if,
  message: 'Dies ist ein Pflichtfeld'
})

extend('regex', {
  ...regex,
  message: 'Die Eingabe entspricht nicht dem erwarteten Format'
})

export default {
  name: 'PvApplicationDialog',
  props: {
    collapse: {
      default: false,
      type: Boolean
    },
    isSingleForm: {
      default: false,
      type: Boolean
    }
  },
  components: {
    ValidationProvider,
    ValidationObserver,
    ActivityList
  },
  data: function () {
    return {
      form: {
        application: {
        }
      },
      overwriteAddress: {
        object_street: '',
        object_streetnumber: '',
        object_city : '',
        object_zip: '',
        object_plot: ''
      },
      status: {
        1: 'Offen',
        2: 'Bewilligt',
        3: 'Realisiert',
        4: 'Sistiert'
      },
      datePicker: {
        state1: false,
      },
      formattedStatusDate: null,
      formattedClearedDate: null,
      statusDates: [],
      isSaving: false,
      loader: null,
      municipalityItems: [],
      activityList: [],
      showDialog: false,
      editedApplication: null,
      editedApplicationId: null,
      disableDateChange: true,
      applicationStatusItems: ApplicationStatus,
      generatorAreaActive: false,
      generatorAreaChanged: false,
      loadingMaddData: false,
      dialog: {
        confirmSave: false,
        confirmAddressOverwrite: false
      }
    }
  },
  created () {
    this.getMunicipalities()
  },
  mounted () {
    // this.getApplication()
  },
  methods: {
    setApplication (id) {
      this.editedApplicationId = id
      this.getApplication()
    },
    getApplication () {
      if (!this.editedApplicationId) {
        return
      }
      axios
        .get('/applications/pv/' + this.editedApplicationId)
        .then((response) => {
          if (response.data) {
            this.editedApplication = response.data
            this.form.application = {}
            this.form.application.id = this.editedApplication.id
            this.form.application.object_egid = this.editedApplication.object_egid
            this.form.application.object_plot = this.editedApplication.object_plot
            this.form.application.identifier = this.editedApplication.identifier
            this.form.application.status = this.editedApplication.status
            this.form.application.object_street = this.editedApplication.object_street
            this.form.application.object_streetnumber = this.editedApplication.object_streetnumber
            this.form.application.object_city = this.editedApplication.object_city
            this.form.application.object_zip = this.editedApplication.object_zip
            this.form.application.fee = this.editedApplication.fee
            this.form.application.generator_area = this.editedApplication.generator_area
            this.form.application.remark = this.editedApplication.remark
            this.activityList = this.editedApplication.activities
            this.form.application.municipality = this.editedApplication.MunicipalityId
            this.form.application.status_date = this.editedApplication.last_status_date
            this.form.application.cleared_date = this.editedApplication.cleared_date
            this.form.application.cleared = this.editedApplication.cleared
            this.statusDates = JSON.parse(this.editedApplication.status_changed_dates)

            this.formatStatusDate()
            this.formatClearedDate()
          } else {
            showSnack({ message: 'Fehler beim Abrufen der Gesuchsdaten.', color: 'red' })
          }
        })
    },
    confirmSave () {
      if (this.generatorAreaChanged) {
        // show modal to confirm save, otherwise save directly
        this.dialog.confirmSave = true
      } else {
        this.save()
      }
    },
    save () {
      this.$refs.applicationFormObserver.validate()
        .then((valid) => {
          if (valid) {
            this.isSaving = true
            this.loader = 'loading'
            axios.patch('/applications/pv/' + this.editedApplicationId, this.form.application)
              .then((response) => {
                if (response.status === 200) {
                  showSnack({ message: 'Gesucht wurde erfolgreich aktualisert', color: 'success' })
                  if (!this.isSingleForm) {
                    this.resetApplicationDialog()
                    this.$emit('getApplications')
                    this.$emit('closeDialog')
                  }
                } else {
                  showSnack({ message: 'Gesuch konnte nicht aktualisiert werden', color: 'red' })
                }
              })
              .catch((ex) => {
                showSnack({ message: 'Gesuch konnte nicht aktualisiert werden', color: 'red' })
              })
              .finally(() => {
                this.isSaving = false
                this.loader = null
              })
          } else {
            showSnack({ message: 'Das Formular ist nicht korrekt ausgefüllt' })
          }
        })
    },
    updateApplication () {

    },
    updateGeneratorAreaFee () {
      this.generatorAreaChanged = parseFloat(this.editedApplication.generator_area) !== parseFloat(this.form.application.generator_area)
      this.form.application.fee = PvFeeCalculation.getPVFeeAsFloat(this.form.application.generator_area)
    },
    resetApplicationDialog () {
      this.form.application = null
      this.editedApplication = null
      this.editedApplicationId = null
      this.generatorAreaChanged = false
      this.generatorAreaActive = false
      this.loadingMaddData = false
    },
    closeDialog() {
      this.resetApplicationDialog()
      this.$emit('getApplications')
      this.$emit('closeDialog')
    },
    getMunicipalities () {
      axios.get('/municipalities')
        .then((res) => {
          this.municipalityItems = res.data
        })
        .catch((ex) => {
          // todo error handling
          console.log('fetch error: ' + ex.message)
        })
    },
    overwriteFormAddress () {
      this.form.application.object_plot = this.overwriteAddress.object_plot
      this.form.application.object_street = this.overwriteAddress.object_street
      this.form.application.object_streetnumber = this.overwriteAddress.object_streetnumber
      this.form.application.object_city = this.overwriteAddress.object_city
      this.form.application.object_zip = this.overwriteAddress.object_zip

      this.dialog.confirmAddressOverwrite = false
    },
    numberWithDelimiter(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
    },
    updateStatusDate () {
      // check if date is already in used status dates
      if (this.statusDates[this.form.application.status]) {
        this.form.application.status_date = new Date(this.statusDates[this.form.application.status]).toISOString().substring(0, 10)
        this.disableDateChange = true
      } else if (this.form.application.status === this.editedApplication.status) {
        // status is the same as in loaded application, use last_status_date
        this.form.application.status_date = this.editedApplication.last_status_date
        this.disableDateChange = true
      } else {
        // status is a new state, add today as default value
        this.form.application.status_date = new Date().toISOString().substring(0, 10)
        this.disableDateChange = false
      }

      this.formatStatusDate()
    },
    formatStatusDate () {
      this.formattedStatusDate = new Date(this.form.application.status_date).toLocaleDateString()
    },
    formatClearedDate () {
      if (this.form.application.cleared_date) {
        this.formattedClearedDate = new Date(this.form.application.cleared_date).toLocaleDateString()
      } else {
        this.formattedClearedDate = ''
      }
    },
    updateClearedStatus () {
      if (this.form.application.cleared === true) {
        if (this.editedApplication.cleared_date) {
          this.form.application.cleared_date = new Date(this.editedApplication.cleared_date).toISOString().substring(0, 10)
        } else {
          this.form.application.cleared_date = new Date().toISOString().substring(0, 10)
        }

        this.formatClearedDate()
      } else {
        this.form.application.cleared_date = null
        this.formattedClearedDate = ''
      }
    },
    getMaddDataByEgid () {
      this.loadingMaddData = true
        axios
          .get('https://api3.geo.admin.ch/rest/services/api/MapServer/find?layer=ch.bfs.gebaeude_wohnungs_register&searchText=' + this.form.application.object_egid + '&searchField=egid&returnGeometry=false')
          .then((response) => {
            console.log(response.data)
            let featureAttributes = null
            if (response.data && response.data.results?.length > 0) {
              response.data.results.forEach(feature => {
                if (feature.attributes.egid === this.form.application.object_egid) {
                  // found feature with searched egid
                  featureAttributes = feature.attributes

                  this.overwriteAddress.object_street = featureAttributes.strname[0]
                  this.overwriteAddress.object_streetnumber = featureAttributes.deinr
                  this.overwriteAddress.object_city = featureAttributes.dplzname
                  this.overwriteAddress.object_zip = featureAttributes.dplz4
                  this.overwriteAddress.object_plot = featureAttributes.lparz

                  this.dialog.confirmAddressOverwrite = true
                }
              })
              if (!featureAttributes) {
                showSnack({message: 'Kein GWR Eintrag für diese EGID gefunden.'})
              }
            }
          }).catch(error => {
            console.log(error)
          }).finally(() => {
            this.loadingMaddData = false
        })
    }
  },
  watch: {
    visible: function () {
      this.showDialog = this.visible
    },
  },
  computed: {
    canEditClearedStatus: {
      get () {
        return !this.$store.getters.getIsMunicipalityUser
      }
    },
    isClearable: {
      get () {
          let dates = JSON.parse(this.editedApplication.status_changed_dates)
          return !!dates[3];
      }
    },
    formDisabled: {
      get () {
        return (this.editedApplication.cleared === true && this.$store.getters.getIsMunicipalityUser)
      }
    }
  }
}



</script>

<style scoped>
.collapse {
  display: none;
}
</style>
