<template>
  <div>
    <span class="">Kontaktadresse bearbeiten</span>

    <div v-if="!editedDataset" style="height: 400px;">
      <v-row
          class="fill-height"
          align-content="center"
          justify="center"
      >
        <v-col
            class="text-subtitle-1 text-center"
            cols="12"
        >
          Daten werden geladen
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
    </div>
    <div v-else>
      <validation-observer
          ref="addressFormObserver"
          v-slot="{ }"
      >
          <v-row>
            <v-col cols="12" sm="12" md="12" class="mt-4">
              <validation-provider
                  v-slot="{ errors }"
                  name="line_1"
                  rules="required"
              >
                <v-text-field   v-model="form.address.line_1" label="Adresszeile 1" :error-messages="errors"></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <validation-provider
                  v-slot="{ errors }"
                  name="line_2"
                  rules=""
              >
                <v-text-field   v-model="form.address.line_2" label="Adresszeile 2" :error-messages="errors"></v-text-field>
              </validation-provider>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="12" md="12">
              <validation-provider
                  v-slot="{ errors }"
                  name="line_3"
                  rules=""
              >
                <v-text-field   v-model="form.address.line_3" label="Adresszeile 3" :error-messages="errors"></v-text-field>
              </validation-provider>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6" sm="12" md="6">
              <validation-provider
                  v-slot="{ errors }"
                  name="zip"
                  rules="required"
              >
                <v-text-field   v-model="form.address.zip" label="PLZ" :error-messages="errors"></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="6" sm="12" md="6">
              <validation-provider
                  v-slot="{ errors }"
                  name="city"
                  rules="required"
              >
                <v-text-field   v-model="form.address.city" label="Ort" :error-messages="errors"></v-text-field>
              </validation-provider>
            </v-col>
          </v-row>
      </validation-observer>
      <v-row>
        <v-col>

          <v-btn
              color="primary lighten-1"
              @click="save()"
              :loading="isSaving"
              :disabled="isSaving"
              depressed
              :class="{ collapse: !editedDataset }"
          >
            Speichern
          </v-btn>
          <v-btn
              color=""
              @click="loading = true; getAddress();"
              class="ml-2"
              depressed
              :loading="loading"
              :class="{ collapse: !editedDataset }"
          >
            Zurücksetzen
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { showSnack } from '../globalActions'
// eslint-disable-next-line camelcase
import { required, regex } from 'vee-validate/dist/rules'
import { extend, ValidationProvider, ValidationObserver, setInteractionMode } from 'vee-validate'

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
  name: 'MunicipalityAddresses',
  props: {
  },
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data: function () {
    return {
      form: {
        address: {
          id: null,
          line_1: '',
          line_2: '',
          line_3: '',
          zip: '',
          city: ''
        }
      },
      isSaving: false,
      editedDataset: null,
      loading: false
    }
  },
  created () {
    this.getAddress()
  },
  mounted () {
    // this.getApplication()
  },
  methods: {
    getAddress () {
      if (!this.$store.state.auth.activeSettingMunicipality) {
        return
      }
      axios
          .get('/municipalities/' + this.$store.state.auth.activeSettingMunicipality)
          .then((response) => {
            if (response.data && response.data.Addresses) {
              this.editedDataset = response.data.Addresses[0]
              this.form.address = {}
              this.form.address.id = this.editedDataset.id
              this.form.address.line_1 = this.editedDataset.line_1
              this.form.address.line_2 = this.editedDataset.line_2
              this.form.address.line_3 = this.editedDataset.line_3
              this.form.address.zip = this.editedDataset.zip
              this.form.address.city = this.editedDataset.city
            } else {
              showSnack({ message: 'Fehler beim Abrufen der Gesuchsdaten.', color: 'red' })
            }
          })
      .finally(() => {
        this.loading = false
      })
    },
    save () {
      this.$refs.addressFormObserver.validate()
          .then((valid) => {
            if (valid) {
              this.isSaving = true
              this.loader = 'loading'
              axios.patch('/municipalities/' + this.$store.state.auth.activeSettingMunicipality + '/addresses/' + this.editedDataset.id, this.form.address)
                  .then((response) => {
                    if (response.status === 200) {
                      showSnack({ message: 'Adresse wurde erfolgreich aktualisert', color: 'success' })
                      this.getAddress()
                    } else {
                      showSnack({ message: 'Adresse konnte nicht aktualisiert werden', color: 'red' })
                    }
                  })
                  .catch((ex) => {
                    showSnack({ message: 'Adresse konnte nicht aktualisiert werden', color: 'red' })
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
  },
  watch: {

  }
}
</script>

<style scoped>
.collapse {
  display: none;
}
</style>
