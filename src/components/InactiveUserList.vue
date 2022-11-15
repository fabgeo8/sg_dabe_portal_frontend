<template>
  <div>
    <v-row class="my-0">
      <v-col>
        <!-- Application List Table -->
        <v-layout child-flex>
        <v-data-table
            :items="userList"
            :items-per-page="10"
            :loading="loadingData"
            :headers="headers"

            loading-text="Benutzerdaten werden geladen."
            class="elevation-1">
          <template v-slot:item="props">
            <tr>
              <td nowrap="true">{{ new Date(props.item.createdAt).toLocaleDateString(undefined, {day: '2-digit', month: '2-digit', year: 'numeric'}) }}</td>
              <td nowrap="true">{{ props.item.fullname }}</td>
              <td nowrap="true">{{ props.item.email }}</td>
              <td nowrap="true">
                <v-dialog
                    v-model="confirmActivate[props.item.id]"
                    width="500"
                >
                  <template v-slot:activator="{ on: dialog, attrs }">
                    <v-tooltip top>
                      <template v-slot:activator="{ on: tooltip }">
                        <v-btn
                            color=""
                            icon
                            v-bind="attrs"
                            v-on="{ ...tooltip, ...dialog}"
                        >
                          <v-icon small class="mr-2">mdi-account-arrow-down</v-icon>
                        </v-btn>
                      </template>
                      <span>Diesen Benutzer aktivieren.</span>
                    </v-tooltip>
                  </template>
                  <v-card>
                    <v-card-title class="text-h5">
                      Benutzer aktivieren
                    </v-card-title>
                    <v-card-text class="mt-2">
                      <span v-if="$store.getters.getActiveSettingMunicipality">Der Benutzer wird aus der aktiviert und zur Benutzerliste der <strong>Gemeinde {{ $store.getters.getActiveSettingClient }}</strong> der als 'user' hinzugefügt. Der Benutzer hat somit <strong>Zugriff auf Gesuchsdaten der Gemeinde {{ $store.getters.getActiveSettingClient }}</strong>.</span>
                      <span v-else>Der Benutzer wird aus der aktiviert und zur Benutzerliste des <strong>Kanton</strong> der als 'user' hinzugefügt. Der Benutzer hat somit <strong>Zugriff auf Gesuchsdaten aller Gemeinden</strong>.</span>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                          color="default"
                          text
                          @click="closeDialog(props.item.id)"
                      >
                        Abbrechen
                      </v-btn>
                      <v-btn
                          color="success"
                          text
                          @click="setAuthorized(props.item.id)">
                        Aktivieren
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </td>
            </tr>
          </template>
        </v-data-table>
        </v-layout>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { showSnack } from '@/globalActions'
import axios from "axios";

export default {
  props: ['activeMunicipality'],
  components: {
    // 'gas-application-form': GasApplicationForm
  },
  data: () => ({
    userList: [],
    loadingData: false,
    confirmActivate: {}
  }),
  mounted () {
    this.getUserList()
  },
  created () {
  },
  methods: {
    getUserList () {
      this.loadingData = true
      axios.get('/users/unauthorized')
          .then((res) => {
            this.userList = res.data

            this.userList.forEach((user) => {
              this.$set(this.confirmActivate, user.id, false)
            })
          })
          .catch((ex) => {
            console.log('fetch application failed: ' + ex.message)
            showSnack({ message: 'Benutzerdaten konnten nicht geladen werden.', color: 'red' })
          })
          .finally(() => {
            this.loadingData = false
          })
    },
    setFilteredList (e) {
      this.filteredList = e
    },
    closeDialog (id) {
      this.$set(this.confirmActivate, id, false)
    },
    setAuthorized (id) {
      this.loadingData = true
      let userLocation = this.$store.getters.getUserLocation

      axios.patch('/users/' + id + '/set_authorized', { userLocation: userLocation })
          .then((res) => {
            showSnack({ message: 'Benutzer wurde aktiviert.', color: 'success' })
            this.getUserList()
            this.$emit('updateUsers')
          })
          .catch((ex) => {
            showSnack({ message: 'Benutzer konnte nicht hinzugefügt werden.', color: 'red' })
          })
          .finally(() => {
            this.loadingData = false
          })
    }
  },
  computed: {
    applicationList: {
      get () { return null }
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
            text: 'Name',
            align: 'start',
            filterable: true,
            value: 'fullname'
          },
          {
            text: 'Email',
            align: 'start',
            filterable: false,
            value: 'email'
          },
          {
            text: '',
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
