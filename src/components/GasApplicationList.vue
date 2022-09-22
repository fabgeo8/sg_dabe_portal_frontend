<template>
    <v-row class="my-0">
    <v-col>
      <!-- Application List Table -->
      <v-data-table
          :items="applicationList"
          :items-per-page="30"
          :loading="loadingData"
          :headers="headers"
          :search="searchText"
          loading-text="Gesuchsdaten werden geladen."
          class="elevation-1 mt-6">
        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.identifier }}</td>
            <td nowrap="true"><v-chip v-if="props.item.status" small pill :color="statusChips[props.item.status].color">{{ statusChips[props.item.status].text }}</v-chip></td>
            <td nowrap="true">{{ new Date(props.item.createdAt).toLocaleDateString() }}</td>
            <td nowrap="true">{{ props.item.Municipality.name }}</td>
            <td nowrap="true">{{ props.item.generator_area }} m&sup2;</td>
            <td nowrap="true">{{ props.item.fuel_type }}</td>
            <td nowrap="true">{{ props.item.object_egid }}</td>
            <td nowrap="true" class="">CHF {{ parseFloat(props.item.fee).toFixed(2) }}</td>
            <td nowrap="true">{{ props.item.address }}</td>
            <td nowrap="true">
              <v-icon small @click="editApplication(props.item)" class="mr-2">mdi-pencil</v-icon>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-col>
      <v-dialog v-model="applicationDialog" eager persistent max-width="960">
        <gas-application-form ref="gasForm" @getApplications="getApplicationList()" @closeDialog="applicationDialog = false;" ></gas-application-form>
      </v-dialog>
  </v-row>
</template>
<script>
// import axios from 'axios'
import GasApplicationForm from '../components/GasApplicationForm'
// import { showSnack } from '@/globalActions'
import StatusChips from '../utils/statusChips'

export default {
  props: ['searchText', 'statusFilter'],
  components: {
    'gas-application-form': GasApplicationForm
  },
  data: () => ({
    selectedId: '',
    applicationDialog: false,
    statusChips: StatusChips
  }),
  mounted () {
    this.getApplicationList()
  },
  created () {
    this.$store.dispatch('getGasApplications')
  },
  methods: {
    getApplicationList () {
      this.$store.dispatch('getGasApplications')
    },
    editApplication (application) {
      this.selectedId = application.id
      this.applicationDialog = true
      this.$refs.gasForm.setApplication(application.id)
    },
    closeApplicationDialog () {
      this.applicationDialog = false
    }
  },
  computed: {
    applicationList: {
      get () { return this.$store.state.auth.gasApplications }
    },
    loadingData: {
      get () { return this.$store.state.auth.loadingData }
    },
    headers: {
      get () {
        return [
          {
            text: 'Identifier',
            align: 'start',
            filterable: true,
            value: 'identifier'
          },
          {
            text: 'Status',
            align: 'start',
            filterable: true,
            value: 'status',
            filter: value => {
              if (this.statusFilter.length === 0) return true
              return this.statusFilter.includes(value)
            }
          },
          {
            text: 'Erstellt',
            align: 'start',
            filterable: false,
            value: 'createdAt'
          },
          {
            text: 'Gemeinde',
            align: 'start',
            filterable: false,
            value: 'Municipality.name'
          },
          {
            text: 'EBF',
            align: 'start',
            filterable: true,
            value: 'generator_area'
          },
          {
            text: 'Brennstoff',
            align: 'start',
            filterable: true,
            value: 'fuel_type'
          },
          {
            text: 'EGID',
            align: 'start',
            filterable: true,
            value: 'object_egid'
          },
          {
            text: 'Abgabe',
            align: 'start',
            filterable: true,
            value: 'fee'
          },
          {
            text: 'Adresse',
            align: 'start',
            filterable: true,
            value: 'address'
          },
          {
            text: 'Aktionen',
            align: 'start',
            filterable: false
          }
        ]
      }
    }
  },
  watch: {

  }
}

</script>
<style>

</style>
