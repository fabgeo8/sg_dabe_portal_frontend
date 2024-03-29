<template>
  <div>
    <v-app-bar
        v-if="isLoggedIn"
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
            class="ml-3"
            active-class="nav-btn-active"
        >
          {{ link.name }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
            text
            active-class="nav-btn-active"
            to="/me"
            icon
            large
        >
          <v-icon>mdi-account</v-icon>
        </v-btn>
        <v-btn
            text
            class="ml-2"
            active-class="nav-btn-active"
            to="/einstellungen"
            icon
            large
            v-if="isSettingAuthorized"
        >
          <v-icon>mdi-cog</v-icon>
        </v-btn>
      </v-container>
    </v-app-bar>
    <v-main class="" style="padding-bottom: 60px;">
      <v-container v-if="isAuthorized || $route.name === 'Login' " fluid class="h-100 px-md-12">
        <router-view></router-view>
      </v-container>
      <v-container v-if="!isAuthorized" fluid class="px-md-12 h-100">
        <v-progress-linear v-if="userInfoLoading" indeterminate color="primary"></v-progress-linear>
        <div v-else>
          <v-alert
              v-if="$store.getters.getUserExpired"
              prominent
              outlined
              type="error"
              class="mt-4"
          >
            Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an. Sie werden in 5s automatisch auf die
            Login-Seite weitergeleitet. Wenn die Weiterleitung nicht funktioniert, klicken Sie <a @click="signOut()">hier</a>.
          </v-alert>
          <v-alert
              v-else
              prominent
              type="error"
              class="mt-4"
          >
            Sie sind aktuell nicht berechtigt für den Zugriff auf diese Applikation. Der Benutzer muss für diese
            Applikation zuerst freigeschaltet werden.<br/>
            Bitte informieren Sie die für die Applikation verantwortliche Person, damit Sie freigeschaltet werden.
          </v-alert>
        </div>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import EventBus, {ACTIONS} from "../events";
import Mgr from '../services/SecurityService'
const auth = new Mgr()
export default {
  name: "Layout",
  components: {},
  data: () => ({
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
        name: 'Gesuchliste',
        path: '/gesuchliste'
      },
      {
        name: 'Gesuch',
        path: '/gesuch'
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

      window.location.reload();
    },
    signOut () {
      auth.signOut()
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
      get() {
        try {
          return this.applicationTypes[this.applicationTypes.findIndex(x => x.value === this.$store.state.data.persisted.applicationType)].name
        } catch {
          return ''
        }
      }
    },
    isSettingAuthorized: {
      get() {
        return !this.$store.state.auth.isMunicipalityUser || (this.$store.state.auth.isMunicipalityUser && this.$store.state.auth.isAdmin)
      }
    },
    userInfoLoading: {
      get() {
        return this.$store.state.auth.userInfoLoading
      }
    },
    isLoggedIn: {
      get() {
        try {
          return this.$store.state.auth.isLoggedIn
        } catch {
          return false
        }
      }
    },
    isAuthorized: {
      get() {
        try {
          return this.$store.state.auth.isAuthorized
        } catch {
          return false
        }
      }
    }
  }
}
</script>

<style scoped>
.h-100 {
  min-height: 100%;
}
</style>