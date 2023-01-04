<template>
  <v-dialog
      v-model="showDialog"
      width="500"
  >
  <v-card>
    <v-card-title class="text-h5">
      GWR Adresse für diese EGID
    </v-card-title>
    <v-card-text class="mt-2">
            <span v-if="form_zip">
              Für die angegebene EGID wurden folgende Adressdaten im GWR gefunden.<br/>
              <br/>
              <b>Adresse gemäss GWR</b><br/>
              Strasse: {{ overwriteAddress.object_street }} <br/>
              Hausnummer: {{ overwriteAddress.object_streetnumber }} <br/>
              Ort: {{ overwriteAddress.object_city }} <br/>
              PLZ: {{ overwriteAddress.object_zip }} <br/>
              Parzelle: {{ overwriteAddress.object_plot }} <br/>
              <br/>

              <b>Aktuell erfasste Adresse</b><br/>
              Strasse: {{ form_street }} <br/>
              Hausnummer: {{ form_streetnumber }} <br/>
              Ort: {{ form_city }} <br/>
              PLZ: {{ form_zip }} <br/>
              Parzelle: {{ form_plot }} <br/>
              <br/>
              Wollen Sie die aktuell erfasste Adresse mit den Adressdaten aus dem GWR überschreiben?
              <br>
            </span>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
          color="default"
          text
          @click="showDialog = false"
      >
        Abbrechen
      </v-btn>
      <v-btn
          color="success"
          text
          @click="overwriteFormAddress()">
        Überschreiben
      </v-btn>
    </v-card-actions>
  </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
import {showSnack} from "../globalActions";

export default {
  name: "AddressOverwrite.vue",
  props: ['form_street', 'form_streetnumber', 'form_city', 'form_zip', 'form_plot', 'form_egid'],
  data: () => ({
    overwriteAddress: {
      object_street: '',
      object_streetnumber: '',
      object_city: '',
      object_zip: '',
      object_plot: ''
    },
    loadingMaddData: false,
    showDialog: false
  }),
  mounted() {
  },
  methods: {
    overwriteFormAddress() {
      this.$emit('overwriteAddress', this.overwriteAddress)
      this.showDialog = false
    },
    getMaddDataByEgid() {
      if (this.loadingMaddData) return
      this.loadingMaddData = true
      this.$emit('toggleLoading', true)
      axios
          .get('https://api3.geo.admin.ch/rest/services/api/MapServer/find?layer=ch.bfs.gebaeude_wohnungs_register&searchText=' + this.form_egid + '&searchField=egid&returnGeometry=false')
          .then((response) => {
            let featureAttributes = null
            if (response.data && response.data.results?.length > 0) {
              response.data.results.forEach(feature => {
                if (feature.attributes.egid === this.form_egid) {
                  // found feature with searched egid
                  featureAttributes = feature.attributes

                  this.overwriteAddress.object_street = featureAttributes.strname[0]
                  this.overwriteAddress.object_streetnumber = featureAttributes.deinr
                  this.overwriteAddress.object_city = featureAttributes.dplzname
                  this.overwriteAddress.object_zip = featureAttributes.dplz4
                  this.overwriteAddress.object_plot = featureAttributes.lparz

                  this.showDialog = true
                }
              })
              if (!featureAttributes) {
                showSnack({message: 'Kein GWR Eintrag für diese EGID gefunden.'})
              }
            }
          }).catch(error => {
        console.log(error)
      }).finally(() => {
        this.loadingMaddData = false
        this.$emit('toggleLoading', false)
      })
    }
  }
}
</script>

<style scoped>

</style>