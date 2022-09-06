<template>
    <v-card>
      <v-card-title>
        <span class="headline">Gesuchdetail</span>
      </v-card-title>
      <v-card-text>
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
                    name="Title"
                    rules="required"
                >
                  <v-text-field v-model="form.gasApplication.identifier" disabled label="Identifier*" :error-messages="errors" ></v-text-field>
                </validation-provider>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="12" md="12">
                <validation-provider
                    v-slot="{  }"
                    name="egid"
                    rules=""
                >
                  <v-text-field v-model="form.gasApplication.egid" label="EGID"></v-text-field>
                </validation-provider>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <validation-provider
                    v-slot="{  }"
                    name="status"
                    rules=""
                >
                  <v-combobox :items="applicationStatusItems" item-value="value" item-text="text" v-model="form.gasApplication.status" label="Status"></v-combobox>
                </validation-provider>
              </v-col>
            </v-row>
          </v-container>
        </validation-observer>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="blue darken-1"
            text
            @click="resetApplicationDialog; $emit('closeDialog')"
        >
          Abbrechen
        </v-btn>
        <v-btn
            color="blue darken-1"
            text
            @click="save()"
        >
          Speichern
        </v-btn>
      </v-card-actions>
    </v-card>
</template>

<script>
import axios from 'axios'
import { showSnack } from '../globalActions'
// eslint-disable-next-line camelcase
import { required, email, regex } from 'vee-validate/dist/rules'
import { extend, ValidationProvider, ValidationObserver, setInteractionMode } from 'vee-validate'

setInteractionMode('eager')

extend('required', {
  ...required,
  message: 'Dies ist ein Pflichtfeld'
})

extend('email', {
  ...email,
  message: 'Es muss eine Email Adresse eingegeben werden'
})

extend('regex', {
  ...regex,
  message: 'Die Eingabe entspricht nicht dem erwarteten Format'
})

extend('confirmed', {
  ...regex,
  message: 'Das eingegebene Passwort stimmt nicht überein'
})

extend('password', {
  params: ['target'],
  validate (value, { target }) {
    return value === target
  },
  message: 'Das eingegebene Passwort stimmt nicht überein'
})

export default {
  name: 'ApplicationDialog',
  props: ['applicationId'],
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data: function () {
    return {
      form: {
        gasApplication: {
          id: '',
          identifier: '',
          egid: '',
          status: null
        }
      },
      editedApplication: null,
      applicationStatusItems: [
        { value: null, text: '--' },
        { value: 1, text: 'offen' },
        { value: 2, text: 'bewilligt' },
        { value: 3, text: 'abgelehnt' },
        { value: 4, text: 'realisiert' },
        { value: 5, text: 'nicht realisiert' }
      ]
    }
  },
  mounted () {
    this.getApplication()
  },
  methods: {
    getApplication () {
      console.log('GET APPLICATION, ID ' + this.applicationId)
      axios
        .get('/applications/gas/' + this.applicationId)
        .then((response) => {
          this.editedApplication = response.data
          this.form.gasApplication.id = this.editedApplication.id
          this.form.gasApplication.egid = this.editedApplication.egid
          this.form.gasApplication.identifier = this.editedApplication.identifier
          this.form.gasApplication.status = this.editedApplication.status
        })
    },
    save () {
      this.$refs.applicationFormObserver.validate()
        .then((valid) => {
          if (valid) {
            this.setDates()

            axios.post('/operators/' + this.operatorId + '/events', { eventData: this.form.createEvent, eventWindows: this.eventWindows })
              .then((response) => {
                if (response.status === 200) {
                  showSnack({ message: 'Kurs wurde erstellt', color: 'success' })
                  this.$emit('getEvents')
                  this.$emit('closeDialog')
                } else {
                  showSnack({ message: 'Kurs konnte nicht erstellt werden' })
                }
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
    }
  }
}
</script>

<style scoped>

</style>
