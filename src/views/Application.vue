<template>
  <v-row>
    <v-col>
      <v-row>
        <v-col>
          <v-text-field outlined v-model="searchApplication" label="Gesuch suchen"></v-text-field>
        </v-col>
        <v-col>
          <v-btn @click="loadApplication()" color="primary">Gesuch laden</v-btn>
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
