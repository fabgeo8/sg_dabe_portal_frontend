<template>
  <div class="pr-4">
    <v-row>
      <v-col>
        <h3>Formularspezifische Einstellungen</h3>
      </v-col>
      </v-row>
    <v-row>
      <v-col md="6">
        <v-text-field label="PV-Ersatzabgabe Anteil Gemeinde" outlined></v-text-field>
      </v-col>
    </v-row>
    <v-row class="mb-1">
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

  }),
  created () {
  },
  methods: {
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
    }
  },
  computed: {

  }
}
</script>

<style scoped>

</style>
