<template>
  <div class="h-100">
    <v-row class="h-100">
      <v-col cols="12" md="7" class="d-none d-md-flex " height="100%"
             width="100%" id="login-background"
      >
      </v-col>
      <v-col cols="12" md="5" class="my-auto pl-12">
        <v-img
            class=""
            src="@/assets/images/Logo_KT_SG_3.svg"
            max-width="450px"
            max-height="180px"
            contain
        ></v-img>
        <h1>Portal Formularsystem</h1>
        <p>Sie sind nicht angemeldet. Bitte authentifizieren Sie sich über SECURE Connect</p>
        <v-alert v-if="!apiOnline" type="error" outlined class="mr-6">
          Die Applikation ist momentan offline. Versuchen Sie es später noch einmals.
        </v-alert>
        <v-btn class="mt-5" @click="login" v-if="!isLoggedIn" color="primary">Login</v-btn>

      </v-col>
    </v-row>
  </div>
</template>

<script>
import Mgr from '../services/SecurityService'
import axios from "axios";

const auth = new Mgr();

export default {
  name: 'Login',
  props: [],

  components: {},
  data: function () {
    return {
      currentUser: '',
      token: '',
      accessTokenExpired: false,
      isLoggedIn: false,
      apiOnline: true,
      userInfo: {
        email: '',
        name: ''
      },
    }
  },
  created() {
    this.apiHearbeat()
  },
  mounted() {
    auth.getUser().then((user) => {
      if (user !== null) {
        this.userInfo.name = user.profile.name
        this.userInfo.email = user.profile.email
        this.accessTokenExpired = user.expired;
      }
      this.isLoggedIn = (user !== null && !user.expired);
    });
  },
  methods: {
    login() {
      auth.signIn();
    },
    apiHearbeat () {
      axios.get('')
          .then((res) => {
            if (res.status === 200) {
              this.apiOnline = true
            }
          })
          .catch((err) => {
              this.apiOnline = false
          })
          .finally(() => {
            window.setTimeout(() => this.apiHearbeat(), 3000);
          })
    }
  },
  computed: {
    userMunicipality: {
      get() {
        return this.$store.state.auth.userMunicipality
      }
    }
  }
}

</script>
<style>
  .h-100 {
    height: 100%;
  }

  #login-background {
    background-color: #008334;
  }
</style>