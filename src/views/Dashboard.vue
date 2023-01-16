<template>
  <div>
    <global-filter @reloadData="getDashboardStats()" title="Dashboard"></global-filter>
    <v-row>
      <v-col cols="12" md="6" class="">
        <!-- CARD OPEN APPLICATIONS -->
        <v-card
            :loading="dataLoading"
            class="mx-auto"
            dark
            color="#888"
        >
          <template slot="progress">
            <v-progress-linear
                color="primary lighten-3"
                height="10"
                indeterminate
            ></v-progress-linear>
          </template>
          <v-card-title color="" class="">
            <span class="text-h5">Offene Gesuche</span>
          </v-card-title>

          <v-card-subtitle class="text--lighten-2">
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
                <v-btn text @click="exportDatasetAsXlsx('open')">
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
        ><!-- lighten-4 -->
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
            <span v-if="statsObject.granted.feeTotal">Ersatzabgaben: CHF {{
                formatCurrency(statsObject.granted.feeTotal)
              }}<br/></span>
            Energiebezugsfläche: {{ formatCurrency(statsObject.granted.generatorAreaTotal) }} m&sup2;
          </v-card-text>

          <v-card-actions>
            <v-list-item class="grow">
              <v-row
                  align="center"
                  justify="end"
              >
                <v-btn @click="exportDatasetAsXlsx('granted')" text>
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
            outlined
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
            Stichtag Gesuch realisiert gemäss gewähltem Datumsbereich <span v-if="applicationType === 'pv'">(abrechnungsrelevant)</span>
          </v-card-subtitle>

          <v-card-text class="text-h5" v-if="statsObject.completed">
            Realisierte Gesuche: {{ statsObject.completed.count }}<br/>
            <span v-if="statsObject.completed.feeTotal">Ersatzabgaben: CHF {{
                formatCurrency(statsObject.completed.feeTotal)
              }}<br/></span>
            Energiebezugsfläche: {{ formatCurrency(statsObject.completed.generatorAreaTotal) }} m&sup2;
          </v-card-text>

          <v-card-actions>
            <v-list-item class="grow">
              <v-row
                  align="center"
                  justify="end"
              >
                <v-dialog
                    v-model="dialog.confirmClearApplications"
                    width="500"
                    v-if="applicationType === 'pv' && !$store.getters.getIsMunicipalityUser"
                >
                  <template v-slot:activator="{ on: dialog, attrs }">
                    <v-btn v-bind="attrs"
                           v-on="{ ...dialog }" text>
                      <v-icon class="mr-1">
                        mdi-receipt-text-check-outline
                      </v-icon>
                      <span class="subheading">Gesuche abrechnen</span>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title class="text-h5">
                      Gesuche als abgerechnet markieren
                    </v-card-title>
                    <v-card-text class="mt-2">
                      <span>Wenn Sie fortfahren, werden alle realisierten Gesuche innerhalb des gewählten Datums- und Gemeindebereich als abgerechnet markiert.
                        Diese Aktion kann nicht gesamthaft rückgängig gemacht werden.
                        Sie können einzelne Gesuche jedoch wieder als nicht-abgerechnet markieren. Wollen Sie fortfahren?</span>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                          color="default"
                          text
                          @click="dialog.confirmClearApplications = false"
                      >
                        Abbrechen
                      </v-btn>
                      <v-btn
                          color="success"
                          text
                          @click="clearCompletedApplications()">
                        Weiter
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>

                <v-btn text @click="exportDatasetAsXlsx('completed')">
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
            outlined
            dark
            color="primary"
            :loading="dataLoading"
            v-if="applicationType === 'pv'"
        >
          <template slot="progress">
            <v-progress-linear
                color="primary lighten-3"
                height="10"
                indeterminate
            ></v-progress-linear>
          </template>
          <v-card-title>
            <span class="text-h5">Abgerechnete Gesuche</span>
          </v-card-title>
          <v-card-subtitle>
            Stichtag Gesuch realisiert gemäss gewähltem Datumsbereich
          </v-card-subtitle>

          <v-card-text class="text-h5" v-if="statsObject.cleared">
            Abgerechnete Gesuche: {{ statsObject.cleared.count }}<br/>
            <span v-if="statsObject.cleared.feeTotal">Ersatzabgaben: CHF {{
                formatCurrency(statsObject.cleared.feeTotal)
              }}<br/></span>
            <span v-if="statsObject.cleared.feeMunicipalities">Anteil Gemeinde: CHF {{
                formatCurrency(statsObject.cleared.feeMunicipalities)
              }}<br/></span>
            <span v-if="statsObject.cleared.feeCanton">Vom Kanton in Rechnung gestellt: CHF {{
                formatCurrency(statsObject.cleared.feeCanton)
              }}<br/></span>
            Energiebezugsfläche: {{ formatCurrency(statsObject.cleared.generatorAreaTotal) }} m&sup2;
          </v-card-text>

          <v-card-actions>
            <v-list-item class="grow">
              <v-row
                  align="center"
                  justify="end"
              >
                <v-btn text @click="exportDatasetAsXlsx('cleared')">
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
        <v-card>
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
import {showSnack} from "../globalActions"
import axios from 'axios'
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
    dialog: {
      confirmClearApplications: false
    },
    applicationKeys: {
      open: 'Offene Gesuche',
      completed: 'Realisierte Gesuche',
      granted: 'Bewilligte Gesuche',
      cleared: 'Abgerechnete Gesuche'
    }
  }),
  mounted() {
    this.getDashboardStats()
  },
  created() {
  },
  methods: {
    getDashboardStats() {
      this.dataLoading = true
      const params = new URLSearchParams([
        ['municipality', this.$store.state.data.persisted.municipality],
        ['dateFrom', this.$store.state.data.persisted.dateFrom],
        ['dateTo', this.$store.state.data.persisted.dateTo],
        ['limit', 10]])

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
    formatCurrency(value) {
      if (!isNaN(parseFloat(value))) {
        return parseFloat(value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'")
      } else {
        return ''
      }
    },
    exportDatasetAsXlsx(key) {
      // select filtered ids to select filtered set from whole application dataset
      const filteredApplications = this.statsObject[key].applicationIds

      const metaData = [
        {
          info: 'Exportiert von',
          value: this.$store.getters.getCurrentUser
        },
        {
          info: 'Gemeinde',
          value: this.municipalityItems[this.municipalityItems.map(object => object.id).indexOf(this.$store.state.data.persisted.municipality)].name
        },
        {
          info: 'Aktive Filterung',
          value: this.applicationKeys[key]
        },
        {
          info: 'Ausgewählter Zeitraum',
          value: new Date(this.$store.state.data.persisted.dateFrom).toLocaleDateString() + ' - ' + new Date(this.$store.state.data.persisted.dateTo).toLocaleDateString()
        }
      ]

      if (this.$store.getters.getApplicationType === 'gas') {
        ExportToExcel.exportGasApplications(filteredApplications, 'export-gas', metaData)
      } else if (this.$store.getters.getApplicationType === 'pv') {
        ExportToExcel.exportPvApplication(filteredApplications, 'export-pv', metaData)
      }
    },
    clearCompletedApplications() {
      this.dataLoading = true
      axios.post('applications/pv/clear_applications', { applications: this.statsObject['completed'].applicationIds})
          .then((res) => {
            if (res.status === 200) {
              showSnack({message: 'Gesuche wurden erfolgreich als abgerechnet markiert', color: 'success'})
            }
            else {
              showSnack({message: 'Es gab ein Problem beim Anpassen der Gesuche, versuchen Sie es noch einmal oder melden Sie sich beim Support.', color: 'red'})
            }
          })
          .catch((ex) => {
            showSnack({message: 'Es gab ein Problem beim Anpassen der Gesuche, versuchen Sie es noch einmal oder melden Sie sich beim Support.', color: 'red'})
          })
          .finally(() => {
            this.dialog.confirmClearApplications = false
            this.getDashboardStats()
          })
    }
  },
  computed: {
    applicationType: {
      get() {
        return this.$store.state.data.persisted.applicationType
      }
    },
    municipalityItems: {
      get () { return this.$store.state.data.municipalityItems }
    }
  }
}

</script>
<style>

</style>
