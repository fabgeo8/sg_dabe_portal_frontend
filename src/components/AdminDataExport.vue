<template>
  <div class="pr-4">
    <v-row>
      <v-col>
        <h3>Benutzer</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
            color="primary"
            @click="exportAllUsers()"
            :loading="isSaving"
            :disabled="isSaving || loading"
            depressed
        >
          Alle aktiven Benutzer exportieren
        </v-btn>
      </v-col>
    </v-row>
    <v-divider class="mt-8"></v-divider>
  </div>
</template>

<script>
import axios from 'axios'
import { showSnack } from '@/globalActions'
import ExportToExcel from "@/utils/exportToExcel";

export default {
  name: 'AdminDataExport',
  data: () => ({
    isSaving: false,
    loading: false,
    editedDataset: null
  }),
  created () {
  },
  methods: {
    exportAllUsers () {
      this.isSaving = true
      axios.get('/users/all')
          .then((res) => {
            if (res.data) {
              let userList = []
              res.data.forEach((r) => {
                let municipality = 'Kanton St. Gallen'
                if (r.MunicipalityId) {
                  this.municipalityItems.forEach((m) => {
                    if (r.MunicipalityId === m.id) municipality = m.name
                  })
                }

                userList.push({
                  'Name': r.fullname,
                  'Email': r.email,
                  'Gemeinde': municipality,
                  'Rolle': r.role_name,
                  'Erstellt am': new Date(r.createdAt).toLocaleDateString()
                })
              })

              ExportToExcel.exportGenericObject(userList, "user_export_formularsystem")
            }
          })
          .catch((ex) => {
            console.log('fetch application failed: ' + ex.message)
            showSnack({message: 'Benutzerdaten konnten nicht geladen werden.', color: 'red'})
          })
          .finally(() => {
            this.isSaving = false
          })
    }
  },
  computed: {
    municipalityItems: {
      get() {
        return this.$store.getters.getMunicipalityList
      }
    }
  }
}
</script>

<style scoped>

</style>
