<template>
  <div>
    <global-filter title="Gesuchsliste"></global-filter>

    <v-row>
      <v-col class="py-0 px-0" cols="12" md="3" lg="3" xl="2">
        <v-sheet class="lighten-5 grey rounded" >
        <v-row no-gutters>
          <v-col class="rounded-t d-none d-md-block px-6 py-6">
            <v-row>
              <v-col>
                <v-text-field class="mb-5" label="Suchen..." v-model="searchText" outlined clearable hide-details full-width></v-text-field>
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
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col class="px-6 py-6">
            <v-btn @click="resetFilter()" text block>Filter zurücksetzen</v-btn>
          </v-col>
        </v-row>
        </v-sheet>
      </v-col>
      <v-col cols="12" md="9" lg="9" xl="10" class="pt-0 pl-8 pl-md-12">
      <gas-application-list v-if="showGasApplicationList" :searchText="searchText" :statusFilter="appliedStatusFilters"></gas-application-list>
      <pv-application-list v-if="showPvApplicationList" :searchText="searchText" :statusFilter="appliedStatusFilters"></pv-application-list>
      </v-col>
    </v-row>
  </div>
</template>
<script>

import GlobalFilter from '../components/GlobalFilter'
import GasApplicationList from '../components/GasApplicationList'
import PvApplicationList from '../components/PvApplicationList'
import Status from '../utils/statusGas'
Status.shift()

export default {
  components: {
    'global-filter': GlobalFilter,
    'gas-application-list': GasApplicationList,
    'pv-application-list': PvApplicationList
  },
  data: () => ({
    searchText: '',
    filters: {
      statusFilter: Status
    },
    appliedStatusFilters: []
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
    this.updateAppliedFilters()
  },
  methods: {
    resetFilter () {
      this.searchText = ''
      this.filters.statusFilter.forEach((el) => { el.active = false })
      this.updateAppliedFilters()
    },
    updateAppliedFilters () {
      this.appliedStatusFilters = []
      this.filters.statusFilter.forEach((el) => {
        if (el.active) {
          this.appliedStatusFilters.push(el.value)
        }
      })
    }
  }
}

</script>
<style>

</style>
