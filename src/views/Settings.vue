<template>
  <div>
    <v-row class="mt-3">
      <v-col cols="12"
             sm="12" md="9">
        <h1>Einstellungen</h1>
        <h3>Aktiver Mandant: {{ $store.getters.getActiveClient }}</h3>
      </v-col>
      <v-col cols="12" sm="12" md="3">
        <v-select :items="municipalityItems" outlined item-text="name" item-value="id"
                  v-model="activeUserMunicipality" label="Gemeinde auswählen" @change="updateUserData()"></v-select>
      </v-col>
      </v-row>
      <v-row>
      <v-col class="py-2 px-0" cols="12" md="3" lg="3" xl="2">
        <v-sheet class="lighten-5 grey" rounded >
          <v-card
              class="mx-auto"
              rounded
          >
            <v-list>
              <v-subheader>Einstellungen</v-subheader>
              <v-list-item-group
                  color="primary"
              >
                <v-list-item>
                  <v-list-item-content @click="hideAllSettings(); showGeneral = true;">
                    <v-list-item-title>Allgemein</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content @click="hideAllSettings(); showMunicipalities = true;">
                    <v-list-item-title v-if="$store.getters.getIsMunicipalityUser">Gemeinde verwalten</v-list-item-title>
                    <v-list-item-title v-else>Gemeinden verwalten</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="!$store.getters.getIsMunicipalityUser">
                  <v-list-item-content @click="hideAllSettings(); showGasProviders = true;">
                    <v-list-item-title>Gasversorger verwalten</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="$store.getters.getIsAdmin">
                  <v-list-item-content @click="hideAllSettings(); showUserManagement = true;">
                    <v-list-item-title>Benutzerverwaltung</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-sheet>
      </v-col>
      <v-col cols="12" md="9" lg="9" xl="10" class="py-2 pl-10">
        <v-sheet class="lighten-5 grey" rounded >
          <v-card
              class="mx-auto"
              rounded
              v-if="showGeneral"
              min-height="700"
          >
            <v-card-title>
              Allgemeine Einstellungen
            </v-card-title>
          </v-card>

          <v-card
              class="mx-auto"
              rounded
              v-if="showMunicipalities"
              min-height="700"
          >
            <v-card-title>
              <span v-if="$store.getters.getIsMunicipalityUser">Gemeinde verwalten</span>
              <span v-else>Gemeinden verwalten</span>
            </v-card-title>
          </v-card>

          <v-card
              class="mx-auto"
              min-height="700"
              rounded
              v-if="showGasProviders && !$store.getters.getIsMunicipalityUser"
          >
            <v-card-title>
              Gasversorger verwalten
            </v-card-title>
          </v-card>

          <v-card
              class="mx-auto"
              rounded
              min-height="700"
              v-if="showUserManagement && $store.getters.getIsAdmin"
          >
            <v-card-title>
              Benutzerverwaltung
            </v-card-title>
            <v-card-text>
              <h3>Aktive Benutzer:</h3>
              <active-user-list ref="activeUserList" @updateUsers="updateUserData()" active-municipality="" class="mb-4"></active-user-list>

              <h3>Nicht zugewiesene Benutzer:</h3>
              <inactive-user-list ref="inactiveUserList" @updateUsers="updateUserData()"></inactive-user-list>
            </v-card-text>
          </v-card>
        </v-sheet>
      </v-col>
    </v-row>
  </div>
</template>
<script>

import ActiveUserList from "../components/ActiveUserList";
import InactiveUserList from "../components/InactiveUserList";
import axios from "axios";
import {showSnack} from "../globalActions";

export default {
  name: 'Settings',
  props: [],
  components: {
    'inactive-user-list': InactiveUserList,
    'active-user-list': ActiveUserList
  },
  data: () => ({
    showGeneral: true,
    showMunicipalities: false,
    showGasProviders: false,
    showUserManagement: false,
    municipalityItems: [],
  }),
  computed: {
    activeUserMunicipality: {
      get() {
        return this.$store.state.auth.activeSettingMunicipality
      },
      set(value) {
        if (value === 'canton') {
          this.$store.commit("updateUserMunicipality", null)
          this.$store.commit("updateIsMunicipalityUser", false)
        } else {
          this.$store.commit("updateIsMunicipalityUser", true)
          this.$store.commit("updateUserMunicipality", value)
        }
      }
    }
  },
  mounted () {
    if (true /*this.$store.getters.getIsMunicipalityUser === false  ONLY AFTER AUTHORIZATION*/) {
      this.loadMunicipalites()
    }
  },
  methods: {
    hideAllSettings () {
      this.showUserManagement = false
      this.showGasProviders = false
      this.showGeneral = false
      this.showMunicipalities = false
    },
    updateUserData () {
      console.log("updating data")
      this.$refs.activeUserList.getUserList()
      this.$refs.inactiveUserList.getUserList()
    },
    loadMunicipalites() {
      axios.get('/municipalities')
            .then((res) => {
              this.municipalityItems = res.data
              this.municipalityItems.unshift({
                id: 'canton',
                name: 'Kanton SG'
              })
            })
            .catch((ex) => {
              // todo error handling
              showSnack({message: "Serverfehler beim Aufrufen der Gemeindeliste", color: 'red'})
              console.log('fetch error: ' + ex.message)
            })
    }
  }
}
</script>
<style>
</style>
