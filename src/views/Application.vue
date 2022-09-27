<template>
  <v-row>
    <v-col>
      <v-row>
        <v-col class="mt-4">
          <p>Bitte geben Sie die vollständige Gesuchs-ID ein. Wenn Sie die Gesuchs-ID nicht kennen, benutzen Sie die Filter- und Suchmöglichkeiten unter <router-link to="/gesuchliste">Gesuchsliste</router-link></p>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field outlined persistent-placeholder placeholder="bspw. 220922_1054695_1" v-model="searchApplication" label="Gesuch suchen"></v-text-field>
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
import { showSnack } from '@/globalActions'
import GasApplicationForm from '@/components/GasApplicationForm'

export default {
  components: {
    'gas-application-form': GasApplicationForm
  },
  data: () => ({
    searchApplication: '',
    showApplication: false
  }),
  methods: {
    loadApplication () {
      this.showApplication = true
      axios
        .get('/applications/gas/by_identifier/' + this.searchApplication)
        .then((response) => {
          if (response.data) {
            this.$refs.gasForm.setApplication(response.data.id)
          } else {
            showSnack({ message: 'Fehler beim Abrufen des gewünschten Gesuch.', color: 'red' })
            this.showApplication = false
          }
        })
      .catch((err) => {
        showSnack({ message: 'Fehler beim Abrufen des gewünschten Gesuch.', color: 'red' })
        this.showApplication = false
      })
    }
  },
  computed: {
  }
}

</script>
<style>

</style>
