<template>
  <div>
    <global-filter @reloadData="getActivities()"  title="Aktivitäten"></global-filter>
    <v-row>
      <v-col class="py-0 px-0" cols="12" md="3" lg="3" xl="2">
        <v-sheet class="lighten-5 grey rounded" >
          <v-row no-gutters>
            <v-col class="rounded-t d-none d-md-block px-6 py-6">
              <v-row>
                <v-col>
                  <v-text-field class="mb-5" label="Suchen..." v-model="searchText" outlined clearable hide-details full-width></v-text-field>
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
        <v-row class="my-0">
          <v-col class="pt-0">
            <!-- Application List Table -->
            <v-data-table
                :items="activityList"
                :items-per-page="30"
                :loading="loadingData"
                :headers="headers"
                :search="searchText"
                locale="de-CH"
                @current-items="setFilteredList"
                loading-text="Gesuchsdaten werden geladen."
                class="elevation-1">
              <template v-slot:item="props">
                <tr>
                  <td nowrap="true">{{ new Date(props.item.createdAt).toLocaleDateString(undefined, {day: '2-digit', month: '2-digit', year: 'numeric'}) }}</td>
                  <td nowrap="true">{{ props.item.activity_text }}</td>
                  <td nowrap="true">{{ props.item.changed_by }}</td>
                  <td nowrap="true"><a :href="'/gesuch/' + props.item.identifier">{{ props.item.identifier }}</a></td>
                </tr>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>
<script>

import GlobalFilter from '../components/GlobalFilter'
import GasApplicationList from '../components/GasApplicationList'
import PvApplicationList from '../components/PvApplicationList'
import Status from '../utils/statusGas'
import axios from "axios";
import {showSnack} from "../globalActions";

export default {
  components: {
    'global-filter': GlobalFilter
  },
  data: () => ({
    searchText: '',
    activityList: [],
    loadingData: false,
  }),
  computed: {
    applicationType: {
      get () { return this.$store.state.data.persisted.applicationType }
    },
    headers: {
      get () {
        return [
          {
            text: 'Datum',
            align: 'start',
            filterable: false,
            value: 'createdAt'
          },
          {
            text: 'Aktivität',
            align: 'start',
            filterable: true,
            value: 'activity_text',
          },
          {
            text: 'Name',
            align: 'start',
            filterable: true,
            value: 'changed_by',
          },
          {
            text: 'Gesuch',
            align: 'start',
            filterable: false,
            value: 'identifier',
          }
        ]
      }
    }
  },
  created () {
    this.getActivities()
  },
  methods: {
    getActivities () {
      this.loadingData = true

      const params = new URLSearchParams([
        ['municipality', this.$store.state.data.persisted.municipality],
        ['dateFrom', this.$store.state.data.persisted.dateFrom],
        ['dateTo', this.$store.state.data.persisted.dateTo]])

      axios.get('applications/' + this.applicationType + '/activities', {params})
          .then((response) => {
            if (response.status === 200) {
              this.activityList = response.data
              console.log(this.activityList)
            } else {
              showSnack({message: 'Aktivitäts-Daten konnten nicht geladen werden.', color: 'red'})
            }
          })
          .catch((ex) => {
            showSnack({message: 'Aktivitäts-Daten konnten nicht geladen werden.', color: 'red'})
          })
          .finally(() => {
            this.loadingData = false
          })
    },
    resetFilter () {
      this.searchText = ''
      this.updateAppliedFilters()
    },
    updateAppliedFilters () {

    },
    setFilteredList (e) {
      this.filteredList = e
    },
  }
}

</script>
<style>

</style>
