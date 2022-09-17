<template>
<!--  <v-dialog v-model="showDialog" max-width="960" persistent>-->
    <v-card>
      <v-card-title>
        <span class="headline">Gesuchsdetail</span>
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
              <v-col>
                <h4>Gesuchs-ID: {{ form.gasApplication.id }}</h4>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <validation-provider
                    v-slot="{ errors }"
                    name="municipality"
                    rules=""
                >
                  <v-select :items="municipalityItems" item-value="id" item-text="name" v-model="form.gasApplication.municipality" label="Gemeinde" :error-messages="errors"></v-select>
                </validation-provider>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field   v-model="form.gasApplication.identifier" disabled label="Identifier*"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" sm="12" md="6">
                <validation-provider
                    v-slot="{ errors }"
                    name="egid"
                    rules=""
                >
                  <v-text-field   v-model="form.gasApplication.object_egid" label="EGID" :error-messages="errors"></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="6" sm="12" md="6">
                <validation-provider
                    v-slot="{ errors }"
                    name="plot"
                    rules=""
                >
                  <v-text-field   v-model="form.gasApplication.object_plot" disabled label="Parzelle" :error-messages="errors"></v-text-field>
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
                  <v-text-field   v-model="form.gasApplication.object_street" label="Strasse" :error-messages="errors"></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="6" sm="12" md="6">
                <validation-provider
                    v-slot="{ errors }"
                    name="streetnumber"
                    rules=""
                >
                  <v-text-field   v-model="form.gasApplication.object_streetnumber" label="Hausnummer" :error-messages="errors"></v-text-field>
                </validation-provider>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" sm="12" md="6">
                <validation-provider
                    v-slot="{ errors }"
                    name="zip"
                    rules=""
                >
                  <v-text-field   v-model="form.gasApplication.object_zip" label="PLZ" :error-messages="errors"></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="6" sm="12" md="6">
                <validation-provider
                    v-slot="{ errors }"
                    name="city"
                    rules=""
                >
                  <v-text-field   v-model="form.gasApplication.object_city" label="Ort" :error-messages="errors"></v-text-field>
                </validation-provider>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" sm="12" md="6">
                  <v-text-field disabled   v-model="form.gasApplication.generator_area" label="EBF">
                    <template slot="append">m&sup2;</template>
                  </v-text-field>
              </v-col>
              <v-col cols="6" sm="12" md="6">
                  <v-text-field
                                disabled
                                prefix="CHF"
                                v-model="form.gasApplication.fee"
                                label="Abgabe">
                  </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <validation-provider
                    v-slot="{ errors }"
                    name="status"
                    rules=""
                >
                  <v-select   :items="applicationStatusItems" item-value="value" item-text="text" v-model="form.gasApplication.status" label="Status" :error-messages="errors"></v-select>
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
                  <v-textarea v-model="form.gasApplication.remark" label="Bemerkung" :error-messages="errors" counter="2048" ></v-textarea>
                </validation-provider>
              </v-col>
            </v-row>
          </v-container>
        </validation-observer>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color=""
            @click="resetApplicationDialog(); $emit('closeDialog')"
        >
          Abbrechen
        </v-btn>
        <v-btn
            color="primary lighten-1"
            @click="save()"
            :loading="isSaving"
            :disabled="isSaving"
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
import { required, regex } from 'vee-validate/dist/rules'
import { extend, ValidationProvider, ValidationObserver, setInteractionMode } from 'vee-validate'
import ApplicationStatus from '../utils/status'

setInteractionMode('eager')

extend('required', {
  ...required,
  message: 'Dies ist ein Pflichtfeld'
})

extend('regex', {
  ...regex,
  message: 'Die Eingabe entspricht nicht dem erwarteten Format'
})

export default {
  name: 'GasApplicationDialog',
  props: [],
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data: function () {
    return {
      form: {
        gasApplication: {
        }
      },
      isSaving: false,
      loader: null,
      municipalityItems: [],
      showDialog: false,
      editedApplication: null,
      editedApplicationId: null,
      applicationStatusItems: ApplicationStatus
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
        .get('/applications/gas/' + this.editedApplicationId)
        .then((response) => {
          if (response.data) {
            this.editedApplication = response.data
            this.form.gasApplication = {}
            this.form.gasApplication.id = this.editedApplication.id
            this.form.gasApplication.object_egid = this.editedApplication.object_egid
            this.form.gasApplication.object_plot = this.editedApplication.object_plot
            this.form.gasApplication.identifier = this.editedApplication.identifier
            this.form.gasApplication.status = this.editedApplication.status
            this.form.gasApplication.object_street = this.editedApplication.object_street
            this.form.gasApplication.object_streetnumber = this.editedApplication.object_streetnumber
            this.form.gasApplication.object_city = this.editedApplication.object_city
            this.form.gasApplication.object_zip = this.editedApplication.object_zip
            this.form.gasApplication.fee = this.editedApplication.fee
            this.form.gasApplication.generator_area = this.editedApplication.generator_area
            this.form.gasApplication.remark = this.editedApplication.remark
            this.form.gasApplication.municipality = this.editedApplication.MunicipalityId
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
            axios.patch('/applications/gas/' + this.editedApplicationId, this.form.gasApplication)
              .then((response) => {
                if (response.status === 200) {
                  showSnack({ message: 'Gesucht wurde erfolgreich aktualisert', color: 'success' })
                  this.resetApplicationDialog()
                  this.$emit('getApplications')
                  this.$emit('closeDialog')
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
      this.form.gasApplication = null
      this.editedApplication = null
      this.editedApplicationId = null
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
    }
  },
  watch: {
    visible: function () {
      this.showDialog = this.visible
    }
  }
}
</script>

<style scoped>
</style>
