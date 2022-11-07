<template>
  <div>
    <global-filter @reloadData="getDashboardStats()" title="Dashboard"></global-filter>
    <v-row>
      <v-col cols="12" md="6" class="">
        <!-- CARD OPEN APPLICATIONS -->
        <v-card
            :loading="dataLoading"
            class="mx-auto"
            color="primary"
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
                <v-btn text>
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
            Stichtag Gesuch Bewilligt
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
                <v-btn text>
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
            Stichtag Gesuch realisiert
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
                <v-btn text>
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

            <v-timeline
                align-top
                dense
            >
              <v-timeline-item
                  v-for="message in messages"
                  :key="message.from"
                  :color="message.color"
                  small
              >
                <div>
                  <div class="font-weight-normal">
                    <strong>{{ message.from }}</strong> @{{ message.time }}
                  </div>
                  <div>{{ message.message }}</div>
                </div>
              </v-timeline-item>
            </v-timeline>
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

export default {
  components: {
    GlobalFilter
  },
  data: () => ({
    dataLoading: false,
    statsObject: {},
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
        ['dateTo', this.$store.state.data.persisted.dateTo]])

      axios.get('applications/' + this.$store.state.data.persisted.applicationType + '/stats', {params})
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
    },
    formatCurrency (value) {
      if (!isNaN(parseFloat(value))) {
        return parseFloat(value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'")
      } else {
        return ''
      }
    },
  },
  computed: {}
}

</script>
<style>

</style>
