<template>
  <v-row class="mt-3 mb-2 ">
    <v-col cols="12"
    sm="0" md="8">
      <h1>{{ title }}</h1>
    </v-col>
    <v-col cols="12" sm="6" md="2">
      <v-combobox
          :items="municipalityItems"
          v-model="selectedMunicipality"
          item-value="id"
          item-text="name"
          outlined
      ></v-combobox>
    </v-col>
    <v-col
        cols="12"
        sm="6"
        md="2"
    >
      <v-menu
          v-model="menu2"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
              v-model="date"
              label="Datumsbereich"
              readonly
              outlined
              v-bind="attrs"
              v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
            v-model="date"
            @input="menu2 = false"
        ></v-date-picker>
      </v-menu>
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios'

export default {
  name: 'GlobalFilter.vue',
  props: ['title'],
  data: () => ({
    selectedMunicipality: null,
    municipalityItems: [],
    date: null,
    menu2: false
  }),
  created () {
    this.getMunicipalities()
  },
  methods: {
    getMunicipalities () {
      axios.get('/municipalities')
        .then((res) => {
          this.municipalityItems = res.data
          this.municipalityItems.unshift({
            id: 0,
            name: 'alle Gemeinden'
          })
        })
        .catch((ex) => {
          // todo error handling
          console.log('fetch error: ' + ex.message)
        })
    }
  }
}
</script>

<style scoped>

</style>
