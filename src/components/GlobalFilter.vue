<template>
  <v-row class="mt-3 mb-2 ">
    <v-col cols="12"
    sm="0" md="6">
      <h1>{{ title }}</h1>
    </v-col>
    <v-col cols="12" sm="6" md="3">
      <v-select
          :items="municipalityItems"
          v-model="selectedMunicipality"
          item-value="id"
          item-text="name"
          outlined
          v-if="canAccessMunicipalitySelection"
          @change="applyFilter()"
      ></v-select>
    </v-col>
    <v-col
        cols="12"
        sm="6"
        md="3"
    >
      <v-menu
          v-model="showDatePicker"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="860px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
              v-model="dateRangeFormatted"
              label="Datumsbereich"
              readonly
              outlined
              v-bind="attrs"
              v-on="on"
          ></v-text-field>
        </template>
        <v-card class="daterange-picker v-sheet">
          <v-card-text>
            <v-row>
              <v-col>
                <v-list>
                  <v-list-item-group>
                    <v-list-item @click="setDateCurrentMonth()">
                      <v-list-item-content>
                        aktueller Monat
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item @click="setDateLastMonth()">
                      <v-list-item-content>
                        letzter Monat
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item @click="setDateCurrentYear()">
                      <v-list-item-content>
                        akutelles Jahr
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item @click="setDateLastYear()">
                      <v-list-item-content>
                        letztes Jahr
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-col>
              <v-col>
                <v-date-picker
                    no-title
                    v-model="dateFrom"
                    @input="formatDate()"
                ></v-date-picker>
              </v-col>
              <v-col>
                <v-date-picker
                    no-title
                    v-model="dateTo"
                    @input="formatDate()"
                ></v-date-picker>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="primary"
                text
                @click="applyFilter()"
            >
              Anwenden
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios'
import { showSnack } from '@/globalActions'

export default {
  name: 'GlobalFilter.vue',
  props: ['title'],
  data: () => ({
    municipalityItems: [],
    showDatePicker: false,
    dateRangeFormatted: ''
  }),
  created () {
    this.getMunicipalities()
    this.formatDate()
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
    },
    formatDate () {
      if (new Date(this.dateFrom) > new Date(this.dateTo)) {
        // end date is before start date
        showSnack({ message: 'Enddatum kann nicht vor Startdatum liegen.', color: 'red' })
        this.dateTo = this.dateFrom
      }
      this.dateRangeFormatted = new Date(this.dateFrom).toLocaleDateString() + ' - ' + new Date(this.dateTo).toLocaleDateString()
    },
    setDateCurrentMonth () {
      this.dateFrom = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), 1)).toISOString().substr(0, 10)
      this.dateTo = new Date().toISOString().substr(0, 10)
      this.formatDate()
    },
    setDateLastMonth () {
      let year = new Date().getFullYear()
      let month = new Date().getMonth() - 1
      if (month < 0) {
        year -= 1
        month = 11
      }
      this.dateFrom = new Date(Date.UTC(year, month, 1)).toISOString().substr(0, 10)
      this.dateTo = new Date(Date.UTC(year, month + 1, 0)).toISOString().substr(0, 10)
      this.formatDate()
    },
    setDateCurrentYear () {
      this.dateFrom = new Date(Date.UTC(new Date().getFullYear(), 0, 1)).toISOString().substr(0, 10)
      this.dateTo = new Date().toISOString().substr(0, 10)
      this.formatDate()
    },
    setDateLastYear () {
      const year = new Date().getFullYear() - 1
      this.dateFrom = new Date(Date.UTC(year, 0, 1)).toISOString().substr(0, 10)
      this.dateTo = new Date(Date.UTC(year, 11, 31)).toISOString().substr(0, 10)
      this.formatDate()
    },
    applyFilter () {
      this.showDatePicker = false
      this.$store.dispatch('getGasApplications')
      this.$store.dispatch('getPvApplications')
      this.$emit('reloadData')
    }
  },
  computed: {
    canAccessMunicipalitySelection: {
      get () { return !this.$store.state.auth.isMunicipalityUser }
    },
    selectedMunicipality: {
      get () { return this.$store.state.data.persisted.municipality },
      set (value) { this.$store.commit('updateMunicipality', value)}
    },
    dateFrom: {
      get () { return this.$store.state.data.persisted.dateFrom },
      set (value) { this.$store.commit('updateDateFrom', value) }
    },
    dateTo: {
      get () { return this.$store.state.data.persisted.dateTo },
      set (value) { this.$store.commit('updateDateTo', value) }
    }
  }
}
</script>

<style scoped>

</style>
