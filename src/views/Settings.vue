<template>
  <div>
    <v-row >
      <v-col class="py-12 px-0" cols="12" md="3" lg="3" xl="2">
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
                    <v-list-item-title>Gemeinden verwalten</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content @click="hideAllSettings(); showGasProviders = true;">
                    <v-list-item-title>Gasversorger verwalten</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content @click="hideAllSettings(); showUserManagement = true;">
                    <v-list-item-title>Benutzerverwaltung</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-sheet>
      </v-col>
      <v-col cols="12" md="9" lg="9" xl="10" class="py-12 pl-10">
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
              Gemeinden verwalten
            </v-card-title>
          </v-card>

          <v-card
              class="mx-auto"
              min-height="700"
              rounded
              v-if="showGasProviders"
          >
            <v-card-title>
              Gasversorger verwalten
            </v-card-title>
          </v-card>

          <v-card
              class="mx-auto"
              rounded
              min-height="700"
              v-if="showUserManagement"
          >
            <v-card-title>
              Benutzerverwaltung
            </v-card-title>
          </v-card>
        </v-sheet>
      </v-col>
    </v-row>
  </div>
</template>
<script>

export default {
  name: 'Settings',
  props: [],
  components: {
  },
  data: () => ({
    showGeneral: true,
    showMunicipalities: false,
    showGasProviders: false,
    showUserManagement: false
  }),
  computed: {},
  created () {
  },
  methods: {
    hideAllSettings () {
      this.showUserManagement = false
      this.showGasProviders = false
      this.showGeneral = false
      this.showMunicipalities = false
    }
  }
}
</script>
<style>
</style>
