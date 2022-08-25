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

export default {
  components: {},
  data: () => ({
    snackbar: false,
    snackbarMessage: '',
    snackbarColor: '',
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
