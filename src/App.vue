<template>
  <v-app id="app">
    <router-view></router-view>
    <v-footer padless fixed>
      <v-card
          flat
          tile
          class="grey lighten-4"
          width="100%"
      >
        <v-row class="ma-0 align-center">
          <v-col cols="6" class="pa-0">
            <v-card-text class="d-flex align-center" style="font-size: 0.8rem">
              <p class="d-flex align-self-center mb-0">
                © {{ new Date().getFullYear() }} Kanton St.Gallen, Entwicklung Small Business Know How GmbH V1.0.0
              </p>
            </v-card-text>
          </v-col>
          <v-col cols="6" class="pa-0">
            <v-spacer></v-spacer>
            <v-card-text class="text-right">
              <v-btn @click="sheet.legalNotice = true" text small>Impressum</v-btn>
              <v-btn @click="sheet.supportNotice = true" text small>Support</v-btn>
            </v-card-text>
          </v-col>
        </v-row>

      </v-card>
    </v-footer>

    <div class="">
      <v-bottom-sheet
          v-model="sheet.legalNotice"
          scrollable
      >
        <legal-notice @closeSheet="sheet.legalNotice=false"></legal-notice>
      </v-bottom-sheet>
    </div>

    <div class="">
      <v-bottom-sheet
          v-model="sheet.supportNotice"
          scrollable
      >
        <support-notice @closeSheet="sheet.supportNotice=false"></support-notice>
      </v-bottom-sheet>
    </div>
    <!-- global snackbar for alerts -->
    <v-snackbar v-model="snackbar" timeout="3500" class="mb-16" :color="snackbarColor"
    >{{ snackbarMessage }}
    </v-snackbar>
  </v-app>
</template>

<script>
import EventBus, {ACTIONS} from './events/index'
import {showSnack} from "@/globalActions";
import store from "./store";
import Mgr from './services/SecurityService'
import LegalNotice from "@/components/LegalNotice.vue";
import SupportNotice from "@/components/SupportNotice.vue";
const auth = new Mgr()

export default {
  components: {
    'legal-notice': LegalNotice,
    'support-notice': SupportNotice
  },
  data: () => ({
    snackbar: false,
    snackbarMessage: '',
    snackbarColor: '',
    sheet: {
      legalNotice: false,
      supportNotice: false
    }
  }),
  created() {
  },
  methods: {
    getSigninStatus () {
      auth.getSignedIn()
          .then((isSignedIn) => {
            console.log("user is signed in " + isSignedIn)
            if (isSignedIn === false) {
              store.commit("userSignedOut")
            } else {
              store.commit('userSignedIn')
              store.dispatch('getUserApiInfo')
            }
          })
          .catch((err) => {
            console.log(err)
          })
    }
  },
  mounted() {
    EventBus.$on(ACTIONS.SNACKBAR, message => {
      this.snackbarMessage = message.message
      this.snackbarColor = message.color
      this.snackbar = true
    })
    this.getSigninStatus()
  },
  computed: {
  }
}
</script>

<style lang="scss">
@import "src/style/variables";
@import "src/style/default";

.v-btn.nav-btn-active {
  background-color: #fff;

  .v-icon {
    color: #008334;
  }

  &::before {
    background-color: #fff;
  }
}

header {
  .v-toolbar__content {
    padding: 0;
  }
}
</style>
