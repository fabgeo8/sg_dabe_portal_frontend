<template>
  <v-row>
    <v-col>
      <v-row>
        <v-col>
          <v-text-field v-model="searchApplication" label="Gesuch suche"></v-text-field>
        </v-col>
        <v-col>
          <v-btn @click="loadApplication()">Gesuch laden</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <gas-application-form ref="gasForm" ></gas-application-form>
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
    searchApplication: ''
  }),
  methods: {
    loadApplication () {
      axios
        .get('/applications/gas/by_identifier/' + this.searchApplication)
        .then((response) => {
          if (response.data) {
            this.$refs.gasForm.setApplication(response.data.id)
          } else {
            showSnack({ message: 'Fehler beim Abrufen des gewünschten Gesuch.', color: 'red' })
          }
        })
    }
  },
  computed: {
  }
}

</script>
<style>

</style>
