<template>
  <v-col cols="12" md="9" lg="9" xl="10" class="pt-0 px-8 pl-md-12">
    <v-row class="my-0">
    <v-col>
      <!-- Application List Table -->
      <v-data-table
          :items="applicationList"
          :items-per-page="20"
          class="elevation-1 mt-6">
        <template v-slot:header="">
          <thead class="v-data-table-header">
          <tr>
            <th class="text-start">Identifier</th>
            <th class="text-start">Status</th>
            <th class="text-start">Gemeinde</th>
            <th class="text-start">EBF</th>
            <th class="text-start">EGID</th>
            <th class="text-end">Abgabe</th>
            <th class="text-start">Adresse</th>
            <th class="text-start">Aktionen</th>
          </tr>

          </thead>
        </template>
        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.identifier }}</td>
            <td nowrap="true">{{ props.item.status }}</td>
            <td nowrap="true">{{ props.item['Municipality.name'] }}</td>
            <td nowrap="true">{{ props.item.generator_area }}</td>
            <td nowrap="true">{{ props.item.egid }}</td>
            <td nowrap="true" class="text-end">CHF {{ parseFloat(props.item.fee).toFixed(2) }}</td>
            <td nowrap="true">{{ props.item.object_street }} {{ props.item.object_streetnumber }},
              {{ props.item.object_zip }} {{ props.item.object_city }}
            </td>
            <td nowrap="true">
              <v-icon small @click="editApplication(props.item)" class="mr-2">mdi-pencil</v-icon>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-col>
    </v-row>
    <v-dialog v-model="applicationDialog" max-width="960">
      <gas-application-form :application-id="selectedId" ></gas-application-form>
    </v-dialog>
  </v-col>
</template>
<script>
import axios from 'axios'
import GasApplicationForm from '../components/GasApplicationForm'

export default {
  components: {
    'gas-application-form': GasApplicationForm
  },
  data: () => ({
    applicationList: [],
    selectedId: null,
    applicationDialog: false
  }),
  computed: {},
  created () {
    this.getApplicationList()
  },
  methods: {
    getApplicationList () {
      axios.get('/applications/gas')
        .then((res) => {
          this.applicationList = res.data
        })
        .catch((ex) => {
          console.log('fetch application failed: ' + ex.message)
        })
    },
    editApplication (application) {
      this.selectedId = application.id
      this.applicationDialog = true
    }
  }
}

</script>
<style>

</style>
