<template>
  <v-app id="app">
    <v-app-bar
        app
        color="white"
        height="90px"
        class="px-0"
    >
      <v-container fluid class="py-0 fill-height  px-md-12">
        <a href="/">
          <v-img
              class="ml-2 mr-4"
              src="@/assets/images/logo-sg-flag.png"
              max-width="40"
              contain
          ></v-img>
        </a>
        <div class="text-center">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  color="primary"
                  dark
                  class="mr-1"
                  v-bind="attrs"
                  v-on="on"
              >
                {{ activeApplicationType }}
                <v-icon
                    right
                    dark
                >
                  mdi-chevron-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                  v-for="item in applicationTypes"
                  :key="item.id"
                  @click="changeApplicationType(item.id)"
              >
                <v-list-item-title>{{ item.name }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <v-btn
            v-for="link in links"
            :key="link.path"
            :to="link.path"
            text
            class="mx-1"
            active-class="nav-btn-active"
        >
          {{ link.name }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
            text
            class=""
            active-class="nav-btn-active"
            to="/login"
            icon
            large
        >
          <v-icon>mdi-account</v-icon>
        </v-btn>
        <v-btn
            text
            class=""
            active-class="nav-btn-active"
            to="/einstellungen"
            icon
            large
        >
          <v-icon>mdi-cog</v-icon>
        </v-btn>
      </v-container>
    </v-app-bar>
    <v-main class="">
      <v-container fluid class="h-100 px-md-12">
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer padless>
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
    applicationTypes: [
      {
        name: 'PV-Ersatzabgabe',
        value: 'pv',
        id: 1
      },
      {
        name: 'Gewährleistung Biobrennstoffe',
        value: 'gas',
        id: 2
      }
    ],
    links: [
      {
        name: 'Dashboard',
        path: '/'
      },
      {
        name: 'Gesuch',
        path: '/gesuch'
      },
      {
        name: 'Gesuchliste',
        path: '/gesuchliste'
      },
      {
        name: 'Aktivitäten',
        path: '/aktivitaet'
      }
    ],
    municipalities: [],
    dateFrom: null,
    dateTo: null
  }),
  created() {
  },
  methods: {
    changeApplicationType(applicationTypeId) {
        const applicationType = this.applicationTypes[this.applicationTypes.findIndex(x => x.id === applicationTypeId)]
        this.$store.commit('updateApplicationType', applicationType.value)
      }
  },
  mounted() {
    EventBus.$on(ACTIONS.SNACKBAR, message => {
      this.snackbarMessage = message.message
      this.snackbarColor = message.color
      this.snackbar = true
    })
  },
  computed: {
    activeApplicationType: {
      get () {
        try {
          return this.applicationTypes[this.applicationTypes.findIndex(x => x.value === this.$store.state.data.persisted.applicationType)].name
        } catch {
          return ''
        }
      }
    }
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
