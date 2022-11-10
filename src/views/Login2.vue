<template>
  <div>
    <div class="home mt-6">
      <p v-if="isLoggedIn">User: {{ currentUser }}</p>
      <v-btn @click="login" v-if="!isLoggedIn" color="primary">Login</v-btn>
      <v-btn @click="logout" v-if="isLoggedIn" color="primary">Logout</v-btn>
    </div>
    <div>
      <v-btn class="mt-12" @click="getProtectedApiData()">Get Data</v-btn>
    </div>
    <div>
      <v-btn class="mt-6" @click="loadToken()">Load token</v-btn>
    </div>
    <div class="mt-4">
      <p>Token: </p>
      <p>{{ token }}</p>
    </div>
    <div class="mt-4">
      <v-text-field v-model="customToken" label="Set Access Token"></v-text-field>
      <v-btn @click="setCustomToken()">Access Token setzen</v-btn>
    </div>
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
      customToken: '',
      accessTokenExpired: false,
      isLoggedIn: false
    }
  },
  created() {
  },
  mounted() {
    // auth.getUser().then((user) => {
    //   if (user !== null) {
    //     this.currentUser = user.profile.name;
    //     this.accessTokenExpired = user.expired;
    //   }
    //
    //   this.isLoggedIn = (user !== null && !user.expired);
    // });
  },
  methods: {
    setCustomToken () {
      axios.defaults.headers.common[authorizationHeader] = `Bearer ${this.customToken}`;
    },
    login() {
      auth.signIn();
    },
    logout() {
      auth.signOut();
    },
    loadToken () {
      auth.getAccessToken().then((userToken) => {
        this.token = userToken
      });
    },
    getProtectedApiData() {
      const authorizationHeader = 'Authorization';
      auth.getAccessToken().then((userToken) => {
        axios.defaults.headers.common[authorizationHeader] = `Bearer ${userToken}`;

        axios.get('/auth/gas')
            .then((response) => {
              this.dataEventRecordsItems = response.data;
            })
            .catch((error) => {
              console.log(error);
            });
      });
    },
    computed: {
    }
  }
}

</script>