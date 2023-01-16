<template>
  <div>
    <global-filter title="Gesuchliste"></global-filter>

    <v-row>
      <v-col class="py-0 px-0" cols="12" md="3" lg="3" xl="2">
        <v-sheet class="lighten-5 grey rounded" >
        <v-row no-gutters>
          <v-col class="rounded-t d-none d-md-block px-6 py-6">
            <v-row>
              <v-col class="pb-0">
                <p class="caption mb-1">Textsuche</p>
                <v-text-field class="mb-5" label="Suchen..." v-model="searchText" outlined clearable hide-details full-width></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <p class="caption mb-1">Filterung Status</p>
                <v-checkbox v-for="status in filters.statusFilter"
                            :key="status.value"
                            :label="status.textVerbose"
                            v-model="status.active"
                            hide-details
                            @change="updateAppliedFilters()"
                            class="my-1">
                </v-checkbox>
              </v-col>
            </v-row>
            <v-row v-if="showPvApplicationList">
              <v-col>
                <p class="caption mb-1">Filterung Stand Abrechnung</p>
                <v-select v-model="appliedClearedFilter" :items="filters.clearedFilter" item-value="value" item-text="text" outlined full-width></v-select>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col class="px-6 py-6">
            <v-btn color="primary" @click="resetFilter()" text block>Filter zurücksetzen</v-btn>
          </v-col>
        </v-row>
        </v-sheet>
        <v-row>
          <v-col>
            <v-btn class="mt-4" @click="exportDataToCsv()" block>Daten exportieren</v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="9" lg="9" xl="10" class="pt-0 pl-8 pl-md-12">
      <gas-application-list v-if="showGasApplicationList" :searchText="searchText" ref="gasApplicationList" :statusFilter="appliedStatusFilters"></gas-application-list>
      <pv-application-list v-if="showPvApplicationList" :searchText="searchText" ref="pvApplicationList" :clearedFilter="appliedClearedFilter"  :statusFilter="appliedStatusFilters"></pv-application-list>
      </v-col>
    </v-row>
  </div>
</template>
<script>

import GlobalFilter from '../components/GlobalFilter'
import GasApplicationList from '../components/GasApplicationList'
import PvApplicationList from '../components/PvApplicationList'
import Status from '../utils/statusGas'

export default {
  components: {
    'global-filter': GlobalFilter,
    'gas-application-list': GasApplicationList,
    'pv-application-list': PvApplicationList
  },
  data: () => ({
    searchText: '',
    filters: {
      statusFilter: Status,
      clearedFilter: [{value: 0, text: 'alle Gesuche anzeigen'}, {value: 1, text: 'nur abgerechnete Gesuche anzeigen'}, {value: 2, text: 'nur nicht abgerechnete Gesuche anzeigen'}]
    },
    appliedStatusFilters: [],
    appliedClearedFilter: 0
  }),
  computed: {
    showGasApplicationList: {
      get () { return this.$store.state.data.persisted.applicationType === 'gas' }
    },
    showPvApplicationList: {
      get () { return this.$store.state.data.persisted.applicationType === 'pv'}
    }
  },
  created () {
    this.$store.dispatch('updateData')
    this.updateAppliedFilters()
  },
  methods: {
    resetFilter () {
      this.searchText = ''
      this.filters.statusFilter.forEach((el) => { el.active = false })
      this.appliedClearedFilter = 0
      this.updateAppliedFilters()
    },
    updateAppliedFilters () {
      this.appliedStatusFilters = []
      this.filters.statusFilter.forEach((el) => {
        if (el.active) {
          this.appliedStatusFilters.push(el.value)
        }
      })
    },
    exportDataToCsv() {
      let filterString = []
      this.appliedStatusFilters.forEach((f) => {
        filterString.push(this.filters.statusFilter[this.filters.statusFilter.map(object => object.value).indexOf(f)].textVerbose)
      })

      if (this.appliedClearedFilter === 1) {
        filterString.push('nur abgerechnete Gesuche')
      } else if (this.appliedClearedFilter === 2) {
        filterString.push('nur nicht abgerechnete Gesuche')
      }

      if (filterString.length > 0) {
        filterString = filterString.join(', ')
      } else {
        filterString = ' - '
      }

      if (this.showGasApplicationList) {
        this.$refs.gasApplicationList.exportDataset(filterString)
      } else if (this.showPvApplicationList) {
        this.$refs.pvApplicationList.exportDataset(filterString)
      }
    }
  }
}

</script>
<style>
</style>
