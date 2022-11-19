<template>
  <div>
    <v-row class="my-0">
    <v-col class="pt-0">
      <!-- Application List Table -->
      <v-data-table
          :items="applicationList"
          :items-per-page="30"
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
      this.applicationList.forEach((a) => {
        if (filteredIds.includes(a.id)) {
          dataToExport.push(a)
        }
      })

      //build formatted list for excel export, excel will be exported with these headers
      let formattedData = []
      dataToExport.forEach((a) => {
        let entry = {
          'Gesuch-ID': a.identifier,
          'Status': this.statusChips[a.status].text,
          'Statusänderung': new Date(a.last_status_date).toLocaleDateString(),
          'Variante': a.version,
          'EGID': a.object_egid,
          'Parzelle': a.object_plot,
          'Strasse': a.object_street,
          'Hausnummer': a.object_streetnumber,
          'PLZ': a.object_zip,
          'Ort': a.object_city,
          'EBF': a.generator_area,
          'Abgabe': a.fee,
          'Gemeinde': a.Municipality.name
        }

        // add status change dates
        for (const s in this.statusChips) {
          if (a.status_changed_dates[s]) {
            entry['Datum ' + this.statusChips[s].text] = new Date(a.status_changed_dates[s]).toLocaleDateString()
          } else {
            entry['Datum ' + this.statusChips[s].text] = ''
          }
        }

        entry['Bemerkung'] = a.remark
        entry['System-ID'] = a.id

        formattedData.push(entry)
      })

      const data = formattedData

      try {
        json2excel({
          data,
          name: 'export-pv',
          formateDate: 'yyyy.mm.dd'
        });
      } catch (e) {
        console.error('export error', e);
      }
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
