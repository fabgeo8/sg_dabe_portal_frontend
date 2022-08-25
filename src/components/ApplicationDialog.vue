<template>
  <v-dialog v-model="showDialog">
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
              <v-col cols="12" sm="12" md="12">
                <validation-provider
                    v-slot="{ errors }"
                    name="Title"
                    rules="required"
                >
                  <v-text-field v-model="form.application.identifier" disabled label="Identifier*" :error-messages="errors" ></v-text-field>
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
                  <v-textarea v-model="form.createEvent.egid" label="EGID"></v-textarea>
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
  </v-dialog>
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
  props: ['applicationId', 'showDialog'],
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data: function () {
    return {
      form: {
        createEvent: {
          identifier: '',
          egid: ''
        }
      },
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
    this.getSingleEvent()
  },
  methods: {
    getSingleEvent () {
      if (this.eventItemId > 0) {
        axios
          .get('/operators/' + this.operatorId + '/events/' + this.eventItemId)
          .then((response) => {
            this.existingEvent = response.data
            this.form.createEvent.title = this.existingEvent.title
            this.form.createEvent.description = this.existingEvent.description
          })
      }
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
    updateEvent () {

    },
    resetApplicationDialog () {
      this.form.createEvent = null
    }
  }
}
</script>

<style scoped>

</style>
