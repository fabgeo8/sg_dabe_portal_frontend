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
                <td nowrap="true">{{
                    new Date(props.item.createdAt).toLocaleDateString(undefined, {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })
                  }}
                </td>
                <td nowrap="true">{{ props.item.fullname }}</td>
                <td nowrap="true">{{ props.item.email }}</td>
                <td nowrap="true">
                  <v-select :items="['admin', 'user']" v-model="userRoles[props.item.id]"
                            :loading="userRolesLoading[props.item.id]"
                            @change="updateUserRole(props.item.id)"></v-select>
                </td>
                <td nowrap="true">
                  <v-dialog
                      v-model="confirmDeactivate[props.item.id]"
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
                        <span>Diesen Benutzer deaktivieren.</span>
                      </v-tooltip>
                    </template>
                    <v-card>
                      <v-card-title class="text-h5">
                        Benutzer deaktivieren
                      </v-card-title>
                      <v-card-text class="mt-2">
                        <span v-if="$store.getters.getActiveSettingMunicipality">Der Benutzer wird aus der Benutzerliste der <strong>Gemeinde {{ $store.getters.getActiveClient }}</strong> entfernt und hat keine Berechtigung mehr auf die Gesuche. Der Benutzer kann wieder aktiviert werden.</span>
                        <span v-else>Der Benutzer wird aus der Benutzerliste des <strong>Kanton</strong> entfernt und hat keine Berechtigung mehr auf die Gesuche. Der Benutzer kann wieder aktiviert werden.</span>
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
                            color="red"
                            text
                            @click="setUnauthorized(props.item.id)">
                          Deaktivieren
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
import {showSnack} from '@/globalActions'
import axios from "axios";

export default {
  props: ['activeMunicipality'],
  components: {},
  data: () => ({
    selectedId: '',
    userRoles: [],
    userList: [],
    loadingData: false,
    userRolesLoading: [],
    confirmDeactivate: {}
  }),
  mounted() {
    this.getUserList()
  },
  created() {
  },
  methods: {
    getUserList() {

      this.loadingData = true
      axios.get('/users/' + this.$store.getters.getUserLocation)
          .then((res) => {
            this.userList = res.data
            this.userList.forEach((user) => {
              this.userRoles[user.id] = user.role_name
              this.userRolesLoading[user.id] = false
              this.$set(this.confirmDeactivate, user.id, false)
            })
          })
          .catch((ex) => {
            console.log('fetch application failed: ' + ex.message)
            showSnack({message: 'Benutzerdaten konnten nicht geladen werden.', color: 'red'})
          })
          .finally(() => {
            this.loadingData = false
          })
    },
    updateUserRole(id) {
      this.userRolesLoading[id] = true
      axios.patch('/users/' + id, {role: this.userRoles[id]})
          .then((res) => {
            showSnack({message: 'Rolle des Benutzers wurde aktualisiert.', color: 'success'})
            this.getUserList()
          })
          .catch((ex) => {
            showSnack({message: 'Benutzer konnte nicht geändert werden.', color: 'red'})
          })
          .finally(() => {
            this.userRolesLoading[id] = false
          })
    },
    setFilteredList(e) {
      this.filteredList = e
    },
    setUnauthorized(id) {
      this.loadingData = true
      let userLocation = this.$store.getters.getUserLocation

      axios.patch('/users/' + id + '/set_unauthorized', {userLocation: userLocation})
          .then((res) => {
            showSnack({message: 'Benutzer wurde deaktiviert.', color: 'success'})
            this.getUserList()
            this.$emit('updateUsers')
          })
          .catch((ex) => {
            showSnack({message: 'Benutzer konnte nicht hinzugefügt werden.', color: 'red'})
          })
          .finally(() => {
            this.loadingData = false
          })
    },
    closeDialog (id) {
      this.$set(this.confirmDeactivate, id, false)
    }
  },
  computed: {
    headers: {
      get() {
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
            text: 'Rolle',
            align: 'start',
            filterable: false,
            value: 'role_name'
          },
          {
            text: ''
          }
        ]
      }
    }
  },
  watch: {}
}

</script>
<style>

</style>
