<template>
  <div class="h-100">
    <v-row v-if="isLoggedIn">
      <v-col>
        <v-card class="mt-4">
          <v-card-title>
            Benutzerinfo
          </v-card-title>
          <v-card-text>
            Name: {{userInfo.name}}<br>
            Email: {{userInfo.email}}<br>
            Gemeinde: {{ $store.getters.getActiveClient }}
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="logout" v-if="isLoggedIn" color="primary">Logout</v-btn>
          </v-card-actions>
        </v-card>
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
      userInfo: {
        email: '',
        name: ''
      },
    }
  },
  created() {
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
    logout() {
      auth.signOut();
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
</style>