<template>
  <v-row>
    <v-col>
      <v-row>
        <v-col class="mt-4">
          <p>Bitte geben Sie die vollständige Gesuchs-ID ein. Wenn Sie die Gesuchs-ID nicht kennen, benutzen Sie die
            Filter- und Suchmöglichkeiten unter
            <router-link to="/gesuchliste">Gesuchsliste</router-link>
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field outlined persistent-placeholder placeholder="bspw. 220922_1054695_1" v-model="searchApplication"
                        label="Gesuch anzeigen"></v-text-field>
        </v-col>
        <v-col>
          <v-btn @click="loadApplication()" color="primary">Gesuch anzeigen</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <gas-application-form ref="gasForm" :collapse="!showApplication" :isSingleForm="true"></gas-application-form>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>

import axios from 'axios'
import {showSnack} from '@/globalActions'
import GasApplicationForm from '@/components/GasApplicationForm'

export default {
  components: {
    'gas-application-form': GasApplicationForm
  },
  props: ['type','identifier'],
  data: () => ({
    searchApplication: '',
    showApplication: false
  }),
  mounted() {
    if (this.type && this.identifier) {
      this.searchGasApplication(this.identifier)
    }
  },
  methods: {
    loadApplication() {
      this.$router.push('/gesuch/gas/' + this.searchApplication)
      this.searchGasApplication(this.searchApplication)
    },
    searchGasApplication(identifier) {
      this.showApplication = true
      axios
          .get('/applications/gas/by_identifier/' + identifier)
          .then((response) => {
            if (response.data) {
              this.$refs.gasForm.setApplication(response.data.id)
            } else {
              showSnack({message: 'Der Datensatz konnte nicht gefunden werden.', color: 'red'})
              this.showApplication = false
            }
          })
          .catch((err) => {
            showSnack({
              message: 'Fehler beim Abrufen des gewünschten Gesuch. ' +
                  'Sie haben keine Berechtigung den Datensatz abzurufen oder es gab einen Serverfehler.',
              color: 'red'
            })
            this.showApplication = false
          })
    }
  },
  computed: {}
}

</script>
<style>

</style>
