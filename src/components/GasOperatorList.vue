<template>
  <div>
    <v-row>
      <v-col>
        <p>
          Hinweis: Änderungen an der Liste der Gasversorger haben keine Auswirkungen auf bereits erfasste Gesuche.
          Es wird dadurch ausschliesslich die Auswahlliste beim Formular-Assistenten angepasst.
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn @click="showCreateDialog = true;" color="primary">Gasversorger hinzufügen</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h3>Liste der Gasversorger</h3>
      </v-col>
    </v-row>
    <v-row class="my-0">
      <v-col>
        <!-- Application List Table -->
        <v-layout child-flex>
        <v-data-table
            :items="gasOperatorList"
            :items-per-page="10"
            :loading="loadingData"
            :headers="headers"
            locale="de-CH"
            loading-text="Gasversorger werden geladen."
            class="elevation-1">
          <template v-slot:item="props">
            <tr>
              <td nowrap="true">{{ props.item.name }}</td>
              <td nowrap="true">{{ props.item.short_name }}</td>
              <td>
                <v-icon small @click="editGasOperator(props.item)" class="mr-2">mdi-pencil</v-icon>
                <v-icon small @click="confirmDelete(props.item)" class="ml-2">mdi-delete</v-icon>
              </td>
            </tr>
          </template>
        </v-data-table>
        </v-layout>
      </v-col>
    </v-row>

    <v-dialog max-width="640" persistent v-model="showDialog">
      <v-card>
        <v-card-title class="pr-4">
          <span class="headline">Gasversorger bearbeiten</span>
        </v-card-title>
        <v-container v-if="!editedDataset" style="height: 300px;">
          <v-row
              class="fill-height"
              align-content="center"
              justify="center"
          >
            <v-col
                class="text-subtitle-1 text-center"
                cols="12"
            >
              Gasversorger wird geladen
            </v-col>
            <v-col cols="6">
              <v-progress-linear
                  color="primary accent-4"
                  indeterminate
                  rounded
                  height="6"
              ></v-progress-linear>
            </v-col>
          </v-row>
        </v-container>
        <div v-else>
          <v-card-text>
            <validation-observer
                ref="applicationFormObserver"
                v-slot="{ }"
            >
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <validation-provider
                        v-slot="{ errors }"
                        name="gasOperator"
                        rules="required"
                    >
                      <v-text-field v-model="form.name" label="Gasversorger"
                                    :error-messages="errors"></v-text-field>
                    </validation-provider>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <validation-provider
                        v-slot="{ errors }"
                        name="gasOperatorShort"
                        rules="required"
                    >
                      <v-text-field v-model="form.short_name" label="Kurzname"
                                    :error-messages="errors"></v-text-field>
                    </validation-provider>
                  </v-col>
                </v-row>
              </v-container>
            </validation-observer>
          </v-card-text>
          <v-card-actions class="pb-6 pr-6">
            <v-spacer></v-spacer>
            <v-btn
                color=""
                @click="resetDialog"
                depressed
            >
              Abbrechen
            </v-btn>
            <v-btn
                color="primary lighten-1"
                @click="save()"
                :loading="isSaving"
                :disabled="isSaving"
                depressed
                :class="{ collapse: !editedDataset || !editedDataset }"
            >
              Speichern
            </v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog
        v-model="confirmDeleteDialog"
        persistent
        hide-overlay
        width="500"
    >
      <v-card>
        <v-card-title class="text-h5">
          Gasversorger entfernen
        </v-card-title>
        <v-card-text class="mt-2">
          <span>Der Gasversorger wird dauerhaft entfernt.</span>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color=""
              text
              @click="resetDialog"
          >
            Abbrechen
          </v-btn>
          <v-btn
              color="red"
              text
              :loading="isSaving"
              @click="deleteItem(itemToDelete)">
            Entfernen
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog max-width="640" persistent v-model="showCreateDialog">
      <v-card>
        <v-card-title class="pr-4">
          <span class="headline">Gasversorger erstellen</span>
        </v-card-title>
          <v-card-text>
            <validation-observer
                ref="applicationCreateFormObserver"
                v-slot="{ }"
            >
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <validation-provider
                        v-slot="{ errors }"
                        name="gasOperator"
                        rules="required"
                    >
                      <v-text-field v-model="form.name" label="Gasversorger"
                                    :error-messages="errors"></v-text-field>
                    </validation-provider>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <validation-provider
                        v-slot="{ errors }"
                        name="gasOperatorShort"
                        rules="required"
                    >
                      <v-text-field v-model="form.short_name" label="Kurzname"
                                    :error-messages="errors"></v-text-field>
                    </validation-provider>
                  </v-col>
                </v-row>
              </v-container>
            </validation-observer>
          </v-card-text>
          <v-card-actions class="pb-6 pr-6">
            <v-spacer></v-spacer>
            <v-btn
                color=""
                @click="resetDialog"
                depressed
            >
              Abbrechen
            </v-btn>
            <v-btn
                color="primary lighten-1"
                @click="create()"
                :loading="isSaving"
                :disabled="isSaving"
                depressed
            >
              Speichern
            </v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { showSnack } from '@/globalActions'
import axios from "axios";
import {ValidationObserver, ValidationProvider} from "vee-validate";

export default {
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data: () => ({
    gasOperatorList: [],
    loadingData: false,
    showDialog: false,
    showCreateDialog: false,
    confirmDeleteDialog: false,
    editedDataset: null,
    isSaving: false,
    itemToDelete: null,
    form: {
      name: '',
      short_name: ''
    }
  }),
  mounted () {
    this.getData()
  },
  created () {
  },
  methods: {
    getData () {
      this.loadingData = true
      axios.get('/settings/gas_operators')
          .then((res) => {
            this.gasOperatorList = res.data
          })
          .catch((ex) => {
            console.log('fetch data failed: ' + ex.message)
            showSnack({ message: 'Daten konnten nicht geladen werden.', color: 'red' })
          })
          .finally(() => {
            this.loadingData = false
          })
    },
    editGasOperator (operator) {
      this.showDialog = true
      this.loadingData = true
      axios.get('/settings/gas_operators/' + operator.id)
          .then((res) => {
            this.editedDataset = res.data

            this.form.name = this.editedDataset.name
            this.form.short_name = this.editedDataset.short_name
          })
          .catch((ex) => {
            console.log('fetch data failed: ' + ex.message)
            showSnack({ message: 'Daten konnten nicht geladen werden.', color: 'red' })
            this.showDialog = false
          })
          .finally(() => {
            this.loadingData = false
          })
    },
    resetDialog () {
      this.editedDataset = null
      this.form.name = ''
      this.form.short_name = ''
      this.showDialog = false
      this.showCreateDialog = false
      this.confirmDeleteDialog = false
      this.itemToDelete = null
    },
    confirmDelete (item) {
      this.itemToDelete = item
      this.confirmDeleteDialog = true
    },
    deleteItem (item) {
      this.isSaving = true
      axios.delete('settings/gas_operators/' + item.id)
          .then((res) => {
            if (res.status === 200) {
              showSnack({message: 'Gasversorger wurde erfolgreich entfernt', color: 'success'})
              this.resetDialog()
              this.getData()
            } else {
              showSnack({
                message: 'Gasversorger konte nicht entfernt werden. Keine Berechtigung.',
                color: 'red'
              })
            }
          })
          .catch((err) => {
            console.log(err)
            showSnack({
              message: 'Gasversorger konte nicht entfernt werden. Serverfehler.',
              color: 'red'
            })
          })
          .finally(() => {
            this.isSaving = false
          })
    },
    save () {
      this.$refs.applicationFormObserver.validate()
          .then((valid) => {
                if (valid) {
                  this.isSaving = true
                  axios.patch('settings/gas_operators/' + this.editedDataset.id, this.form)
                      .then((res) => {
                        if (res.status === 200) {
                          showSnack({message: 'Gasversorger wurden erfolgreich gespeichert', color: 'success'})
                          this.resetDialog()
                          this.getData()
                        } else {
                          showSnack({
                            message: 'Gasversorger konten nicht gespeichert werden. Keine Berechtigung.',
                            color: 'red'
                          })
                        }
                      })
                      .catch((err) => {
                        console.log(err)
                        showSnack({
                          message: 'Gasversorger konten nicht gespeichert werden. Serverfehler.',
                          color: 'red'
                        })
                      })
                      .finally(() => {
                        this.isSaving = false
                      })
                }})
    },
    create () {
      this.$refs.applicationCreateFormObserver.validate()
          .then((valid) => {
            if (valid) {
              this.isSaving = true
              axios.post('settings/gas_operators/', this.form)
                  .then((res) => {
                    if (res.status === 200) {
                      showSnack({message: 'Gasversorger wurden erfolgreich erstellt', color: 'success'})
                      this.resetDialog()
                      this.getData()
                    } else {
                      showSnack({
                        message: 'Gasversorger konten nicht erstellt werden. Keine Berechtigung.',
                        color: 'red'
                      })
                    }
                  })
                  .catch((err) => {
                    console.log(err)
                    showSnack({
                      message: 'Gasversorger konten nicht erstellt werden. Serverfehler.',
                      color: 'red'
                    })
                  })
                  .finally(() => {
                    this.isSaving = false
                  })
            }})
    }

  },
  computed: {
    headers: {
      get () {
        return [
          {
            text: 'Gasversorger',
            align: 'start',
            filterable: false,
            value: 'name'
          },
          {
            text: 'Kurzname',
            align: 'start',
            filterable: false,
            value: 'short_name'
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
