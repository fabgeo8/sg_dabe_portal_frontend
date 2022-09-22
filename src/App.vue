<template>
  <v-app id="app">
    <v-app-bar
        app
        color="white"
        height="90px"
    >
      <v-container class="py-0 fill-height">
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
                  v-bind="attrs"
                  v-on="on"
              >
                {{ activeApplicationType }}
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
            class="mx-1"
            active-class="nav-btn-active"
            to="/login"
        >
        Login
        </v-btn>
      </v-container>
    </v-app-bar>
    <v-main class="">
      <v-container class="h-100">
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer>
    </v-footer>
    <!-- global snackbar for alerts -->
    <v-snackbar v-model="snackbar" timeout="2500" :color="snackbarColor"
    >{{ snackbarMessage }}</v-snackbar
    >
  </v-app>
</template>

<script>
import EventBus, { ACTIONS } from './events/index'
import {showSnack} from "@/globalActions";

export default {
  components: {},
  data: () => ({
    activeApplicationType: 'Gas',
    snackbar: false,
    snackbarMessage: '',
    snackbarColor: '',
    applicationTypes: [
      {
        name: 'PV',
        id: 1
      },
      {
        name: 'Gas',
        id: 2
      }
    ],
    links: [
      {
        name: 'Dashboard',
        path: '/'
      },
      {
        name: 'Gesuche',
        path: '/gesuche'
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
  created () {

  },
  methods: {
    changeApplicationType (applicationTypeId) {
      const applicationType = this.applicationTypes[this.applicationTypes.findIndex(x => x.id === applicationTypeId)]
      this.activeApplicationType = applicationType.name
      if (applicationType.name === 'PV') {
        showSnack({message: 'not implemented!', color: 'red'})
        this.activeApplicationType = 'Gas'
      }
    }
  },
  mounted () {
    EventBus.$on(ACTIONS.SNACKBAR, message => {
      this.snackbarMessage = message.message
      this.snackbarColor = message.color
      this.snackbar = true
    })
  }
}
</script>

<style lang="scss">
@import "src/style/variables";
@import "src/style/default";

.v-btn.nav-btn-active {
  background-color: #fff;

  &::before {
    background-color: #fff;
  }
}
</style>
