<template>
  <div>
    <global-filter @reloadData="getDashboardStats()" title="Dashboard"></global-filter>
    <v-row>
      <v-col cols="12" md="6" class="">
        <!-- CARD OPEN APPLICATIONS -->
        <v-card
            :loading="dataLoading"
            class="mx-auto"
            color="#888"
            dark
        >
          <template slot="progress">
            <v-progress-linear
                color="primary lighten-3"
                height="10"
                indeterminate
            ></v-progress-linear>
          </template>
          <v-card-title>
            <span class="text-h5">Offene Gesuche</span>
          </v-card-title>

          <v-card-subtitle>
            aktueller Stand
          </v-card-subtitle>

          <v-card-text class="text-h5" v-if="statsObject.open">
            Offene Gesuche: {{ statsObject.open.count }}
          </v-card-text>

          <v-card-actions>
            <v-list-item class="grow">
              <v-row
                  align="center"
                  justify="end"
              >
                <v-btn text @click="exportDataset('open')">
                  <v-icon class="mr-1">
                    mdi-microsoft-excel
                  </v-icon>
                  <span class="subheading">Download</span>
                </v-btn>
              </v-row>
            </v-list-item>
          </v-card-actions>
        </v-card>
        <v-card
            class="mx-auto mt-4"
            color="primary"
            dark
            :loading="dataLoading"
        >
          <template slot="progress">
            <v-progress-linear
                color="primary lighten-3"
                height="10"
                indeterminate
            ></v-progress-linear>
          </template>
          <v-card-title>
            <span class="text-h5">Bewilligte Gesuche</span>

          </v-card-title>
          <v-card-subtitle>
            Stichtag Gesuch bewilligt gemäss gewähltem Datumsbereich
          </v-card-subtitle>

          <v-card-text class="text-h5" v-if="statsObject.granted">
            Bewilligte Gesuche: {{ statsObject.granted.count }}<br/>
            <span v-if="statsObject.granted.feeTotal">Ersatzabgaben: CHF {{ formatCurrency(statsObject.granted.feeTotal) }}<br/></span>
            Energiebezugsfläche: {{ formatCurrency(statsObject.granted.generatorAreaTotal) }} m&sup2;
          </v-card-text>

          <v-card-actions>
            <v-list-item class="grow">
              <v-row
                  align="center"
                  justify="end"
              >
                <v-btn @click="exportDataset('granted')" text>
                  <v-icon class="mr-1">
                    mdi-microsoft-excel
                  </v-icon>
                  <span class="subheading">Download</span>
                </v-btn>
              </v-row>
            </v-list-item>
          </v-card-actions>
        </v-card>
        <v-card
            class="mx-auto mt-4"
            color="primary"
            dark
            :loading="dataLoading"
        >
          <template slot="progress">
            <v-progress-linear
                color="primary lighten-3"
                height="10"
                indeterminate
            ></v-progress-linear>
          </template>
          <v-card-title>
            <span class="text-h5">Realisierte Gesuche</span>
          </v-card-title>
          <v-card-subtitle>
            Stichtag Gesuch realisiert gemäss gewähltem Datumsbereich (abrechnungsrelevant)
          </v-card-subtitle>

          <v-card-text class="text-h5" v-if="statsObject.completed">
            Realisierte Gesuche: {{ statsObject.completed.count }}<br/>
            <span v-if="statsObject.granted.feeTotal">Ersatzabgaben: CHF {{ formatCurrency(statsObject.completed.feeTotal) }}<br/></span>
            Energiebezugsfläche: {{ formatCurrency(statsObject.completed.generatorAreaTotal) }} m&sup2;
          </v-card-text>

          <v-card-actions>
            <v-list-item class="grow">
              <v-row
                  align="center"
                  justify="end"
              >
                <v-btn text @click="exportDataset('completed')">
                  <v-icon class="mr-1">
                    mdi-microsoft-excel
                  </v-icon>
                  <span class="subheading">Download</span>
                </v-btn>
              </v-row>
            </v-list-item>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" class="d-none" md="2"></v-col>
      <v-col cols="12" md="6" class="">
        <v-card

        >
          <v-card-title>
            <span class="text-h5">Letzte Aktivitäten</span>
          </v-card-title>
          <v-card-text>
            <div class="font-weight-bold ml-8 mb-2">

            </div>

            <activity-list :activityList="activities"></activity-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>

import GlobalFilter from '../components/GlobalFilter'
import { showSnack } from "../globalActions"
import axios from 'axios'
import {json2excel} from "js2excel"
import ExportToExcel from "../utils/exportToExcel"
import store from "../store";
import ActivityList from "../components/ActivityList"

export default {
  components: {
    ActivityList,
    GlobalFilter
  },
  data: () => ({
    dataLoading: false,
    statsObject: {},
    activities: [],
    messages: [
      {
        from: '243ADADG-B1',
        message: `Status angepasst`,
        time: new Date().toLocaleDateString(),
        color: 'primary',
      },
      {
        from: '243AD4DF-B1',
        message: 'Status angepasst',
        time: new Date().toLocaleDateString(),
        color: 'primary',
      },
      {
        from: '2433DADF-B1',
        message: 'Status angepasst',
        time: new Date().toLocaleDateString(),
        color: 'primary',
      },
    ],
  }),
  mounted () {
    this.getDashboardStats()
  },
  methods: {
    getDashboardStats() {
      this.dataLoading = true
      const params = new URLSearchParams([
        ['municipality', this.$store.state.data.persisted.municipality],
        ['dateFrom', this.$store.state.data.persisted.dateFrom],
        ['dateTo', this.$store.state.data.persisted.dateTo],
        ['limit', 5]])

      axios.get('applications/' + this.applicationType + '/stats', {params})
          .then((response) => {
            if (response.status === 200) {
              this.statsObject = response.data
            } else {
              showSnack({message: 'Daten konnten nicht geladen werden.', color: 'red'})
            }
          })
          .catch((ex) => {
            showSnack({message: 'Daten konnten nicht geladen werden.', color: 'red'})
          })
          .finally(() => {
            this.dataLoading = false
          })

      axios.get('applications/' + this.applicationType + '/activities', {params})
          .then((response) => {
            if (response.status === 200) {
              this.activities = response.data
              console.log(this.activities)
            } else {
              showSnack({message: 'Aktivitäts-Daten konnten nicht geladen werden.', color: 'red'})
            }
          })
          .catch((ex) => {
            showSnack({message: 'Aktivitäts-Daten konnten nicht geladen werden.', color: 'red'})
          })
          .finally(() => {
            this.dataLoading = false
          })
    },
    formatCurrency (value) {
      if (!isNaN(parseFloat(value))) {
        return parseFloat(value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'")
      } else {
        return ''
      }
    },
    exportDataset (key) {
      // select filtered ids to select filtered set from whole application dataset
      const filteredApplications = this.statsObject[key].applicationIds

      if (this.$store.getters.getApplicationType === 'gas') {
        ExportToExcel.exportGasApplications(filteredApplications, 'export-gas')
      } else if (this.$store.getters.getApplicationType === 'pv') {
        ExportToExcel.exportPvApplication(filteredApplications, 'export-pv')
      }
    }
  },
  computed: {
    applicationType: {
      get() {
        return this.$store.state.data.persisted.applicationType
      }
    }
  }
}

</script>
<style>

</style>
