<template>
  <div class="pr-4">
    <v-row>
      <v-col>
        <h3>Formularspezifische Einstellungen</h3>
      </v-col>
      </v-row>
    <v-row>
      <v-col md="6">
        <v-text-field :loading="loading" v-model="settings.fee_amount_municipality" label="PV-Ersatzabgabe Anteil Gemeinde" >
          <template slot="append">CHF</template>
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
            color="primary"
            @click="save()"
            :loading="isSaving"
            :disabled="isSaving || loading"
            depressed
            :class="{ collapse: !editedDataset }"
        >
          Speichern
        </v-btn>
        <v-btn
            color=""
            @click="getSettings"
            class="ml-2"
            depressed
            :class="{ collapse: !editedDataset }"
        >
          Abbrechen
        </v-btn>
      </v-col>
    </v-row>
    <v-divider class="mt-8"></v-divider>
    <v-row class="mb-1 mt-4">
      <v-col>
        <h3>Einstellungen an Formularsystem übertragen</h3>
      </v-col>
      <v-col cols="12"
             sm="12" md="12">
        <v-btn color="primary" :loading="dataPushing" @click="pushDataToFormAssistant()" >Daten an Formularsystem übertragen</v-btn>
        <p class="mt-3">Aktuelle Gemeindeliste und Gasversorgerdaten werden auf das Formularsystem synchronisiert.</p>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from 'axios'
import { showSnack } from '@/globalActions'

export default {
  name: 'AdminSystemSettings',
  data: () => ({
    dataPushing: false,
    settings: {
      fee_amount_municipality: ''
    },
    isSaving: false,
    loading: false,
    editedDataset: null

  }),
  created () {
    this.getSettings()
  },
  methods: {
    save () {
      this.isSaving = true
      axios.patch('settings/global/' + 'fee_amount_municipality', {value: this.settings.fee_amount_municipality})
          .then((res) => {
            if (res.status === 200) {
              showSnack({message: 'Einstellungen wurden erfolgreich gespeichert', color: 'success'})
              this.getSettings()
            }
            else {
              showSnack({message: 'Einstellungen konten nicht gespeichert werden. Keine Berechtigung.', color: 'red'})
            }
          })
          .catch((err) => {
            console.log(err)
            showSnack({message: 'Einstellungen konten nicht synchronisiert werden. Serverfehler.', color: 'red'})
          })
          .finally(() => {
            this.isSaving = false
          })
    },
    pushDataToFormAssistant () {
      this.dataPushing = true
      axios.post('settings/push_settings')
      .then((res) => {
        if (res.status === 200) {
          showSnack({message: 'Daten wurden erfolgreich synchronisiert', color: 'success'})
        }
        else {
          showSnack({message: 'Daten konten nicht synchronisiert werden. Keine Berechtigung.', color: 'red'})
        }
      })
      .catch((err) => {
        console.log(err)
        showSnack({message: 'Daten konten nicht synchronisiert werden. Serverfehler.', color: 'red'})
      })
      .finally(() => {
        this.dataPushing = false
      })
    },
    getSettings() {
      this.loading = true
      this.editedDataset = null
      axios.get('settings/global')
          .then((res) => {
            if (res.status === 200 && res.data) {
              res.data.forEach((s) => {
                if (Object.keys(this.settings).includes(s.setting)) {
                  this.settings[s.setting] = s.value
                }
              })
              this.editedDataset = res.data

              showSnack({message: 'Daten wurden erfolgreich synchronisiert', color: 'success'})
            }
            else {
              showSnack({message: 'Daten konten nicht synchronisiert werden. Keine Berechtigung.', color: 'red'})
            }
          })
          .catch((err) => {
            console.log(err)
            showSnack({message: 'Daten konten nicht synchronisiert werden. Serverfehler.', color: 'red'})
          })
          .finally(() => {
            this.loading = false
          })

    }
  },
  computed: {

  }
}
</script>

<style scoped>

</style>
