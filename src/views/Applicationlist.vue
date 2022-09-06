<template>
  <div>
    <global-filter title="Gesuchsliste"></global-filter>

    <v-row>
      <v-col class="lighten-4 grey rounded py-0 px-0" cols="12" md="3" lg="3" xl="2">
        <v-row no-gutters>
          <v-col class="rounded-t d-none d-md-block px-6 py-6">
            <v-row>
              <v-col>
                <v-text-field label="Suchen..." outlined full-width></v-text-field>
                <v-checkbox label="Offene Gesuche" class="my-0"></v-checkbox>
                <v-checkbox label="Beweilligte Gesuche" class="my-0"></v-checkbox>
                <v-checkbox label="Abgelehnte Gesuche" class="my-0"></v-checkbox>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col class="px-6 py-6">
            <v-btn text block>Filter zurücksetzen</v-btn>
          </v-col>
        </v-row>
      </v-col>
      <gas-application-list v-if="true"></gas-application-list>
    </v-row>
  </div>
</template>
<script>

import GlobalFilter from '../components/GlobalFilter'
import GasApplicationList from '../components/GasApplicationList'

export default {
  components: {
    'global-filter': GlobalFilter,
    'gas-application-list': GasApplicationList
  },
  data: () => ({
  }),
  computed: {},
  created () {
  },
  methods: {

  }
}

</script>
<style>

</style>
