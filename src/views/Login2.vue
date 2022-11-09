<template>
  <div>
    <div class="home mt-6">
      <p v-if="isLoggedIn">User: {{ currentUser }}</p>
      <v-btn  @click="login" v-if="!isLoggedIn" color="primary">Login</v-btn>
      <v-btn @click="logout" v-if="isLoggedIn" color="primary">Logout</v-btn>
    </div>
    <div>
      <v-btn class="mt-12" @click="getProtectedApiData()">Get Data</v-btn>
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
      accessTokenExpired: false,
      isLoggedIn: false
    }
  },
  created() {
  },
  mounted() {
    auth.getUser().then((user) => {
      if (user !== null) {
        this.currentUser = user.profile.name;
        this.accessTokenExpired = user.expired;
      }

      this.isLoggedIn = (user !== null && !user.expired);
    });
  },
  methods: {
    login() {
      auth.signIn();
    },
    logout() {
      auth.signOut();
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
    }
  }
}

</script>