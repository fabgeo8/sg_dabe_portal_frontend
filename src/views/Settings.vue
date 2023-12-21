<template>
  <div v-if="isSettingAuthorized">
    <v-row class="mt-3">
      <v-col cols="12"
             sm="12" md="9">
        <h1>Einstellungen</h1>
        <h3>Aktiver Mandant: {{ $store.getters.getActiveClient }}</h3>
      </v-col>
      <v-col cols="12" sm="12" md="3">
        <v-select :items="municipalityItems" v-if="showMunicipalitySelection" outlined item-text="name" item-value="id"
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
                <v-list-item v-if="!$store.getters.getSettingIsMunicipality">
                  <v-list-item-content @click="hideAllSettings(); showGeneral = true;">
                    <v-list-item-title>Systemeinstellungen</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="!$store.getters.getSettingIsMunicipality">
                  <v-list-item-content @click="hideAllSettings(); showDataExport = true;">
                    <v-list-item-title>Datenexport</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="$store.getters.getSettingIsMunicipality">
                  <v-list-item-content @click="hideAllSettings(); showMunicipalities = true;">
                    <v-list-item-title v-if="$store.getters.getSettingIsMunicipality">Gemeinde verwalten</v-list-item-title>
                    <v-list-item-title v-else>Gemeinden verwalten</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="!$store.getters.getSettingIsMunicipality">
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
              v-if="!$store.getters.getSettingIsMunicipality && showGeneral"
              class="mx-auto"
              rounded
              min-height="700"
          >
            <v-card-title>
              Systemeinstellungen
            </v-card-title>
            <v-card-text>
              <admin-system-settings v-if="!$store.getters.getActiveSettingMunicipality"></admin-system-settings>
            </v-card-text>
          </v-card>

          <v-card
              v-if="!$store.getters.getSettingIsMunicipality && showDataExport"
              class="mx-auto"
              rounded
              min-height="700"
          >
            <v-card-title>
              Daten exportieren
            </v-card-title>
            <v-card-text>
              <admin-data-export v-if="!$store.getters.getActiveSettingMunicipality"></admin-data-export>
            </v-card-text>
          </v-card>

          <v-card
              class="mx-auto"
              rounded
              v-if="showMunicipalities"
              min-height="700"
          >
            <v-card-title>
              <span v-if="$store.getters.getSettingIsMunicipality">Gemeinde verwalten</span>
              <span v-else>Gemeinden verwalten</span>
            </v-card-title>
            <v-card-text>
              <municipality-addresses ref="municipalityAddresses" v-if="$store.getters.getSettingIsMunicipality"></municipality-addresses>
            </v-card-text>
          </v-card>
          <v-card
              class="mx-auto"
              min-height="700"
              rounded
              v-if="showGasProviders && !$store.getters.getSettingIsMunicipality"
          >
            <v-card-title>
              Gasversorger verwalten
            </v-card-title>
            <v-card-text>
              <gas-operator-list class="mb-4"></gas-operator-list>
            </v-card-text>
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
              <h3>Nicht zugewiesene Benutzer (bitte fügen Sie nur die Benutzer ihrer eigenen Gemeinde hinzu): </h3>
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
import AdminSystemSettings from "../components/AdminSystemSettings";
import GasOperatorList from "../components/GasOperatorList";
import MunicipalityAddresses from "../components/MunicipalityAddresses";
import AdminDataExport from "@/components/AdminDataExport.vue";

export default {
  name: 'Settings',
  props: [],
  components: {
    'municipality-addresses': MunicipalityAddresses,
    'inactive-user-list': InactiveUserList,
    'active-user-list': ActiveUserList,
    'admin-system-settings': AdminSystemSettings,
    'gas-operator-list': GasOperatorList,
    'admin-data-export': AdminDataExport
  },
  data: () => ({
    showGeneral: true,
    showMunicipalities: false,
    showGasProviders: false,
    showUserManagement: false,
    showDataExport: false
  }),
  computed: {
    activeUserMunicipality: {
      get() {
        return this.$store.state.auth.activeSettingMunicipality
      },
      set(value) {
        if (value === 'canton') {
          this.$store.commit("updateSettingMunicipality", 'canton')
          this.$store.commit("updateSettingIsMunicipality", false)
        } else if (value !== null && value !== '') {
          this.$store.commit("updateSettingIsMunicipality", true)
          this.$store.commit("updateSettingMunicipality", value)
        }
      }
    },
    isSettingAuthorized: {
      get () {
        return !this.$store.state.auth.isMunicipalityUser || (this.$store.state.auth.isMunicipalityUser && this.$store.state.auth.isAdmin)
      }
    },
    showMunicipalitySelection: {
      get () {
        return !this.$store.getters.getIsMunicipalityUser
      }
    },
    municipalityItems: {
      get() {
        return this.$store.getters.getMunicipalityList
      }
    }
  },
  mounted () {
    this.$store.dispatch('getMunicipalityList')
  },
  methods: {
    hideAllSettings () {
      this.showUserManagement = false
      this.showGasProviders = false
      this.showGeneral = false
      this.showMunicipalities = false
      this.showDataExport = false
    },
    updateUserData () {
      console.log("updating data")
      if (this.$refs.activeUserList) this.$refs.activeUserList.getUserList()
      if (this.$refs.inactiveUserList) this.$refs.inactiveUserList.getUserList()
      if (this.$refs.municipalityAddresses) this.$refs.municipalityAddresses.getAddress()
    },
  },
}
</script>
<style>
</style>
