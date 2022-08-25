<template>
  <div>
    <global-filter title="Gesuchsliste"></global-filter>

    <v-row>
      <v-col class="lighten-4 grey rounded py-0 px-0" cols="12" md="3" lg="3" xl="2">
        <v-row no-gutters>
          <v-col class="rounded-t d-none d-md-block px-6 py-6">
            <v-row>
              <v-col>
                <v-text-field label="Suchen..." outlined full-width></v-text-field>
                <v-checkbox label="Offene Gesuche" class="my-0"></v-checkbox>
                <v-checkbox label="Beweilligte Gesuche" class="my-0"></v-checkbox>
                <v-checkbox label="Abgelehnte Gesuche" class="my-0"></v-checkbox>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col class="px-6 py-6">
            <v-btn text block>Filter zurücksetzen</v-btn>
          </v-col>
        </v-row>
      </v-col>
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
                <th class="text-start">ID</th>
                <th class="text-start">Typ</th>
                <th class="text-start">Status</th>
                <th class="text-start">Gemeinde</th>
                <th class="text-start">EBF</th>
                <th class="text-start">EGID</th>
                <th class="text-start">Adresse</th>
                <th class="text-start">Kontakt</th>
                <th class="text-start">Aktionen</th>
              </tr>

              </thead>
            </template>
            <template v-slot:item="props">
              <tr>
                <td>{{ props.item.identifier }}</td>
                <td nowrap="true">{{ props.item.type }}</td>
                <td nowrap="true">{{ props.item.status }}</td>
                <td nowrap="true">{{ props.item.municipal }}</td>
                <td nowrap="true">{{ props.item.generator_area }}</td>
                <td nowrap="true">{{ props.item.egid }}</td>
                <td nowrap="true">{{ props.item.object_street }} {{ props.item.object_streetnumber }}, {{ props.item.object_zip }} {{props.item.object_city }}</td>
                <td nowrap="true">{{ props.item.contact_name  }}</td>
                <td nowrap="true">
                  <v-icon small @click="editApplication(props.item)" class="mr-2">mdi-pencil</v-icon>
                </td>
              </tr>
            </template>
          </v-data-table>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <application-dialog application-id="selectedId" show-dialog="applicationDialog"></application-dialog>
  </div>
</template>
<script>

import GlobalFilter from '../components/GlobalFilter'
import ApplicationDialog from '../components/ApplicationDialog'
import axios from 'axios'

export default {
  components: {
    'global-filter': GlobalFilter,
    'application-dialog': ApplicationDialog
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
      axios.get('/applications')
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
