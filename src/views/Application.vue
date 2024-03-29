<template>
  <v-row class="mt-3">
    <v-col cols="12"
           sm="12" md="12">
      <h1>Gesuchdetail</h1>
    </v-col>
    <v-col>
      <v-row>
        <v-col class="mt-0">
          <p>Bitte geben Sie die vollständige <span class="font-weight-bold">Gesuch-ID</span> ein.<br> Wenn Sie die Gesuch-ID nicht kennen, benutzen Sie die
            Filter- und Suchmöglichkeiten unter
            <router-link to="/gesuchliste">Gesuchliste</router-link>
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="12">
          <v-text-field outlined append-icon="mdi-magnify" persistent-placeholder placeholder="bspw. 46AR1AEW-X1" v-model="searchString"
                        label="Gesuch-ID eingeben" @click:append="loadApplication()" style="max-width: 960px" @change="loadApplication()"></v-text-field>
        </v-col>
      </v-row>
      <v-row v-if="false">
        <v-col cols="12" md="7" >
          <v-btn class="float-right" @click="loadApplication()" color="primary">Gesuch anzeigen</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <gas-application-form ref="gasForm" @reset="resetApplication" :collapse="!showApplication || activeApplicationType !== 'gas'" :isSingleForm="true"></gas-application-form>
          <pv-application-form ref="pvForm" @reset="resetApplication" :collapse="!showApplication || activeApplicationType !== 'pv'" :isSingleForm="true"></pv-application-form>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>

import axios from 'axios'
import {showSnack} from '@/globalActions'
import GasApplicationForm from '@/components/GasApplicationForm'
import PvApplicationForm from "@/components/PvApplicationForm"

export default {
  components: {
    'gas-application-form': GasApplicationForm,
    'pv-application-form': PvApplicationForm
  },
  props: ['identifier'],
  data: () => ({
    searchString: '',
    showApplication: false,
    applicationLoading: false
  }),
  mounted() {
    if (this.identifier) {
      this.searchApplication(this.identifier)
    }
  },
  methods: {
    loadApplication() {
      this.$router.push('/gesuch/' + this.searchString)
      this.searchApplication(this.searchString)
    },
    resetApplication () {
      this.$router.push('/gesuch/')
      this.searchString = ''
      this.showApplication = false
    },
    searchApplication(identifier) {
      this.showApplication = true
      this.applicationLoading = true
      axios
          .get('/applications/' + this.activeApplicationType + '/by_identifier/' + identifier)
          .then((response) => {
            if (response.data) {
              switch(this.activeApplicationType){
                case 'gas':
                  this.$refs.gasForm.setApplication(response.data.id)
                  break
                case 'pv':
                  this.$refs.pvForm.setApplication(response.data.id)
                  break
                default:
                  showSnack({
                    message: 'Fehler beim Abrufen des gewünschten Gesuch.',
                    color: 'red'
                  })
              }
            } else {
              showSnack({message: 'Der Datensatz konnte nicht gefunden werden.', color: 'red'})
              this.showApplication = false
            }
          })
          .catch((err) => {
            showSnack({
              message: 'Fehler beim Abrufen des gewünschten Gesuch. ' +
                  'Das Gesuch existiert nicht oder Sie haben keine Berechtigung den Datensatz abzurufen.',
              color: 'red'
            })
            this.showApplication = false
          })
          .finally(() => {
            this.applicationLoading = false
          })
    }
  },
  computed: {
    activeApplicationType: {
      get() {
        try {
          return this.$store.state.data.persisted.applicationType
        } catch {
          return ''
        }
      }
    }
  }
}

</script>
<style>

</style>
