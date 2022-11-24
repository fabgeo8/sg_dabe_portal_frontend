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
                © 2022 Kanton St.Gallen, Entwicklung Small Business Know How GmbH
              </p>
            </v-card-text>
          </v-col>
          <v-col cols="6" class="pa-0">
            <v-spacer></v-spacer>
            <v-card-text class="text-right">
              <v-btn text small>Impressum</v-btn>
              <v-btn text small>Support</v-btn>
            </v-card-text>
          </v-col>
        </v-row>

      </v-card>
    </v-footer>

    <div class="">
    </div>
    <!-- global snackbar for alerts -->
    <v-snackbar v-model="snackbar" timeout="2500" :color="snackbarColor"
    >{{ snackbarMessage }}
    </v-snackbar
    >
  </v-app>
</template>

<script>
import EventBus, {ACTIONS} from './events/index'
import {showSnack} from "@/globalActions";

export default {
  components: {},
  data: () => ({
    snackbar: false,
    snackbarMessage: '',
    snackbarColor: '',
  }),
  created() {

  },
  methods: {

  },
  mounted() {
    EventBus.$on(ACTIONS.SNACKBAR, message => {
      this.snackbarMessage = message.message
      this.snackbarColor = message.color
      this.snackbar = true
    })
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
