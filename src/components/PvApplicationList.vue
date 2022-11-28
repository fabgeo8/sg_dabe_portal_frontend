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
          locale="de-CH"
          :search="searchText"
          @current-items="setFilteredList"
          loading-text="Gesuchsdaten werden geladen."
          class="elevation-1">
        <template v-slot:item="props">
          <tr>
            <td nowrap="true">{{ new Date(props.item.createdAt).toLocaleDateString(undefined, {day: '2-digit', month: '2-digit', year: 'numeric'}) }}</td>
            <td nowrap="true"><v-chip v-if="props.item.status" small pill :color="statusChips[props.item.status].color">{{ statusChips[props.item.status].text }}</v-chip></td>
            <td nowrap="true">{{ new Date(props.item.last_status_date).toLocaleDateString(undefined, {day: '2-digit', month: '2-digit', year: 'numeric'}) }}</td>
            <td nowrap="true">{{ props.item.version }}</td>
            <td nowrap="true">{{ props.item.object_egid }}</td>
            <td nowrap="true">{{ props.item.address }}</td>
            <td nowrap="true" class="">{{ formatCurrency(props.item.fee) }}</td>
            <td nowrap="true">{{ props.item.generator_area }} m&sup2;</td>
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
        <pv-application-form ref="pvForm" @getApplications="getApplicationList()" @closeDialog="applicationDialog = false;" ></pv-application-form>
      </v-dialog>
  </v-row>
  </div>
</template>
<script>
// import axios from 'axios'
import PvApplicationForm from '../components/PvApplicationForm'
// import { showSnack } from '@/globalActions'
import StatusChips from '../utils/statusChipsPv'
import { json2excel } from 'js2excel'
import ExportToExcel from "../utils/exportToExcel";
import store from "../store";

export default {
  props: ['searchText', 'statusFilter'],
  components: {
    'pv-application-form': PvApplicationForm
  },
  data: () => ({
    selectedId: '',
    applicationDialog: false,
    statusChips: StatusChips,
    filteredList: []
  }),
  mounted () {
  },
  created () {
    this.$store.dispatch('getPvApplications')
  },
  methods: {
    getApplicationList () {
      this.$store.dispatch('getPvApplications')
    },
    editApplication (application) {
      this.selectedId = application.id
      this.applicationDialog = true
      this.$refs.pvForm.setApplication(application.id)
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
    exportDataset () {
      // select filtered ids to select filtered set from whole application dataset
      const filteredIds = this.filteredList.map(a => a.id);

      let dataToExport = []

      // push all matching applications to list
      let applicationList = store.getters.getPvApplications

      applicationList.forEach((a) => {
        if (filteredIds.includes(a.id)) {
          dataToExport.push(a)
        }
      })
      ExportToExcel.exportPvApplication(filteredIds, 'export-pv')
    }
  },
  computed: {
    applicationList: {
      get () { return this.$store.state.data.pvApplications }
    },
    loadingData: {
      get () { return this.$store.state.data.loadingData }
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
            text: 'Abgabe',
            align: 'start',
            filterable: true,
            value: 'fee'
          },
          {
            text: 'EBF',
            align: 'start',
            filterable: true,
            value: 'generator_area'
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
