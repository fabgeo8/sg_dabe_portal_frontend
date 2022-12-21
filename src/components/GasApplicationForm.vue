<template>
    <v-card :class="{ collapse: collapse }" max-width="960">
      <v-card-title class="pr-4">
        <span class="headline">Gesuchdetails</span>

        <v-spacer></v-spacer>
        <v-card-actions class="pr-3 pt-3">
          <v-btn
              color=""
              :class="{ collapse: isSingleForm, 'mr-3': true  }"
              @click="closeDialog()"
              depressed
          >
            Abbrechen
          </v-btn>
          <v-btn
              color="primary lighten-1"
              @click="save()"
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
                    min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <validation-provider
                        v-slot="{ errors }"
                        name="status_date"
                        rules="required"
                    >
                      <v-text-field
                          v-model="formattedStatusDate"
                          label="Statusänderung"
                          :error-messages="errors"
                          readonly
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
              <v-col cols="12" sm="12" md="12">
                <v-text-field v-model="form.application.identifier" disabled label="Gesuch-ID"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" sm="12" md="6">
                <validation-provider
                    v-slot="{ errors }"
                    name="egid"
                    rules=""
                >
                  <v-text-field   v-model="form.application.object_egid" label="EGID" :error-messages="errors"></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="6" sm="12" md="6">
                <validation-provider
                    v-slot="{ errors }"
                    name="plot"
                    rules=""
                >
                  <v-text-field   v-model="form.application.object_plot" disabled label="Parzelle" :error-messages="errors"></v-text-field>
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
                  <v-text-field   v-model="form.application.object_street" label="Strasse" :error-messages="errors"></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="6" sm="12" md="6">
                <validation-provider
                    v-slot="{ errors }"
                    name="streetnumber"
                    rules=""
                >
                  <v-text-field   v-model="form.application.object_streetnumber" label="Hausnummer" :error-messages="errors"></v-text-field>
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
                  <v-text-field   v-model="form.application.object_zip" label="PLZ" :error-messages="errors"></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="6" sm="12" md="6">
                <validation-provider
                    v-slot="{ errors }"
                    name="city"
                    rules=""
                >
                  <v-text-field   v-model="form.application.object_city" label="Ort" :error-messages="errors"></v-text-field>
                </validation-provider>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <validation-provider
                    v-slot="{ errors }"
                    name="municipality"
                    rules=""
                >
                  <v-select :items="municipalityItems" :disabled="$store.getters.getIsMunicipalityUser" item-value="id" item-text="name" v-model="form.application.municipality" label="Gemeinde" :error-messages="errors"></v-select>
                </validation-provider>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" sm="12" md="6">
                  <v-text-field v-model="form.application.generator_area" label="EBF">
                    <template slot="append">m&sup2;</template>
                  </v-text-field>
              </v-col>
              <v-col cols="6" sm="12" md="6">
                <v-select :items="['Biogas','Bioöl']" v-model="form.application.fuel_type" label="Art des Brennstoff">
                </v-select>
              </v-col>
              </v-row>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-select :items="$store.getters.getGasOperatorList" item-text="name" item-value="name"  v-model="form.application.gas_operator" label="Gasversorger">
                </v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" sm="12" md="6">
                <validation-provider
                    v-slot="{ errors }"
                    name="yearOfConstruction"
                    :rules="{regex: /^(19|20)\d{2}$/}"
                >
                  <v-text-field v-model="form.application.year_of_construction" :error-messages="errors" label="Baujahr">
                  </v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="6" sm="12" md="6">
                <validation-provider
                v-slot="{ errors }"
                name="boilerReplacementYear"
                :rules="{regex: /[0-9]{2}\/[0-9]{4}$/}">
                  <v-text-field v-model="form.application.boiler_replacement_year" :error-messages="errors" label="Ersatz Heizkessel (Monat/Jahr)">
                  </v-text-field>
                </validation-provider>
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
      <v-card-actions class="pb-6 pr-6">
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
            :class="{ collapse: isSingleForm || !editedApplication, 'mr-3': true }"
            @click="closeDialog()"
            depressed
        >
          Abbrechen
        </v-btn>
        <v-btn
            color="primary lighten-1"
            @click="save()"
            :loading="isSaving"
            :disabled="isSaving"
            depressed
            :class="{ collapse: !editedApplication || !editedApplication }"
        >
          Speichern
        </v-btn>
      </v-card-actions>
    </v-card>
<!--  </v-dialog>-->
</template>

<script>
import axios from 'axios'
import { showSnack } from '../globalActions'
// eslint-disable-next-line camelcase
import { required, regex , required_if } from 'vee-validate/dist/rules'
import { extend, ValidationProvider, ValidationObserver, setInteractionMode } from 'vee-validate'
import ApplicationStatus from '../utils/statusGas'
import ActivityList from "./ActivityList";

setInteractionMode('eager')

extend('required', {
  ...required,
  message: 'Dies ist ein Pflichtfeld'
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
  name: 'GasApplicationDialog',
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
    ActivityList,
    ValidationProvider,
    ValidationObserver
  },
  data: function () {
    return {
      form: {
        application: {
        }
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
      statusDates: [],
      isSaving: false,
      formattedStatusDate: null,
      loader: null,
      municipalityItems: [],
      activityList: [],
      showDialog: false,
      editedApplication: null,
      editedApplicationId: null,
      disableDateChange: true,
      applicationStatusItems: ApplicationStatus
    }
  },
  created () {
    this.getMunicipalities()
  },
  mounted () {
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
        .get('/applications/gas/' + this.editedApplicationId)
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
            this.form.application.generator_area = this.editedApplication.generator_area
            this.form.application.remark = this.editedApplication.remark
            this.form.application.status = this.editedApplication.status
            this.form.application.gas_operator = this.editedApplication.gas_operator
            this.form.application.status_date = this.editedApplication.last_status_date
            this.form.application.municipality = this.editedApplication.MunicipalityId
            this.form.application.fuel_type = this.editedApplication.fuel_type
            this.form.application.year_of_construction = this.editedApplication.year_of_construction
            this.form.application.boiler_replacement_year = this.editedApplication.boiler_replacement_year
            this.activityList = this.editedApplication.activities
            this.statusDates = JSON.parse(this.editedApplication.status_changed_dates)
            this.formatStatusDate()
          } else {
            showSnack({ message: 'Fehler beim Abrufen der Gesuchsdaten.', color: 'red' })
          }
        })
    },
    save () {
      this.$refs.applicationFormObserver.validate()
        .then((valid) => {
          if (valid) {
            this.isSaving = true
            this.loader = 'loading'
            axios.patch('/applications/gas/' + this.editedApplicationId, this.form.application)
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
    resetApplicationDialog () {
      this.form.application = null
      this.editedApplication = null
      this.editedApplicationId = null
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
    }
  },
  watch: {
    visible: function () {
      this.showDialog = this.visible
    }
  },
  computed: {

  }
}
</script>

<style scoped>
.collapse {
  display: none;
}
</style>
