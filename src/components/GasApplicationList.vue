<template>
  <div>
    <v-row class="my-0">
      <v-col class="pt-0">
        <!-- Application List Table -->
        <v-data-table
            :items="applicationList"
            :items-per-page="10"
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
              <td nowrap="true"><v-chip v-if="props.item.status" small pill :dark="statusChips[props.item.status].dark" :text-color="statusChips[props.item.status].textColor"  :outlined="statusChips[props.item.status].outlined" :color="statusChips[props.item.status].color">{{ statusChips[props.item.status].text }}</v-chip></td>
              <td nowrap="true">{{ new Date(props.item.last_status_date).toLocaleDateString(undefined, {day: '2-digit', month: '2-digit', year: 'numeric'}) }}</td>
              <td nowrap="true">{{ props.item.version }}</td>
              <td nowrap="true">{{ props.item.object_egid }}</td>
              <td nowrap="true">{{ props.item.address }}</td>
              <td nowrap="true">{{ props.item.generator_area }} m&sup2;</td>
              <td nowrap="true">{{ gasOperatorShortNames[props.item.gas_operator] ? gasOperatorShortNames[props.item.gas_operator] : props.item.gas_operator  }}</td>
              <td nowrap="true">{{ props.item.Municipality.name }}</td>
              <td>{{ props.item.identifier }}</td>
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
  </div>
</template>
<script>
// import axios from 'axios'
import GasApplicationForm from '../components/GasApplicationForm'
// import { showSnack } from '@/globalActions'
import StatusChips from '../utils/statusChipsGas'
import { json2excel } from 'js2excel'
import ExportToExcel from "../utils/exportToExcel";
import store from "../store";

export default {
  props: ['searchText', 'statusFilter'],
  components: {
    'gas-application-form': GasApplicationForm
  },
  data: () => ({
    selectedId: '',
    applicationDialog: false,
    statusChips: StatusChips,
    filteredList: [],
    gasOperatorShortNames: {}
  }),
  mounted () {
    this.getApplicationList()
    this.buildGasOperatorShortNames()
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
    buildGasOperatorShortNames() {
      let gasOperatorList = this.$store.getters.getGasOperatorList

      gasOperatorList.forEach((o) => {
        this.gasOperatorShortNames[o.name] = o.short_name
      })
    },
    closeApplicationDialog () {
      this.applicationDialog = false
    },
    setFilteredList (e) {
      this.filteredList = e
    },
    formatCurrency (value) {
      if (!isNaN(parseFloat(value))) {
        return parseFloat(value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'")
      } else {
        return ''
      }
    },
    exportDataset (activeFilters) {
      // select filtered ids to select filtered set from whole application dataset
      const filteredIds = this.filteredList.map(a => a.id);

      let dataToExport = []

      // push all matching applications to list
      let applicationList = store.getters.getGasApplications

      applicationList.forEach((a) => {
        if (filteredIds.includes(a.id)) {
          dataToExport.push(a)
        }
      })

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
          value: activeFilters
        },
        {
          info: 'Ausgewählter Zeitraum',
          value: new Date(this.$store.state.data.persisted.dateFrom).toLocaleDateString() + ' - ' + new Date(this.$store.state.data.persisted.dateTo).toLocaleDateString()
        }
      ]

      ExportToExcel.exportGasApplications(dataToExport, 'export-biobrennstoffe', metaData)
    }
  },
  computed: {
    applicationList: {
      get () { return this.$store.state.data.gasApplications }
    },
    loadingData: {
      get () { return this.$store.state.data.loadingData }
    },
    municipalityItems: {
      get () { return this.$store.state.data.municipalityItems }
    },
    headers: {
      get () {
        return [
          {
            text: 'Erstellt',
            align: 'start',
            filterable: false,
            value: 'createdAt'
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
            text: 'Statusänderung',
            align: 'start',
            filterable: true,
            value: 'last_status_date'
          },
          {
            text: 'Variante',
            align: 'start',
            filterable: false,
            value: 'version'
          },
          {
            text: 'EGID',
            align: 'start',
            filterable: true,
            value: 'object_egid'
          },
          {
            text: 'Adresse',
            align: 'start',
            filterable: true,
            value: 'address'
          },
          {
            text: 'EBF',
            align: 'start',
            filterable: true,
            value: 'generator_area'
          },
          {
            text: 'Gasversorger',
            align: 'start',
            filterable: true,
            value: 'gas_operator'
          },
          {
            text: 'Gemeinde',
            align: 'start',
            filterable: false,
            value: 'Municipality.name'
          },
          {
            text: 'Gesuch-ID',
            align: 'start',
            filterable: true,
            value: 'identifier'
          },
          {
            text: '',
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
