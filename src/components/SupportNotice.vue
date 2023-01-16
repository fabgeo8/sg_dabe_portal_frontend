<template>
  <v-card>
    <v-card-text class="mt-6">
      <h2 class="mb-4">Support</h2>
      <p>
        Die Webapplikation wird von der Energiefachstelle des Kantons St.Gallen betrieben. Bei inhaltlichen oder
        technischen Fragen wenden Sie sich bitte per E-Mail an <a href="mailto:formularsystem@sg.ch">formularsystem@sg.ch</a>
      </p>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
          text
          @click="$emit('closeSheet')"
      >
        Schliessen
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'SupportNotice',
  props: [],
  components: {},
  data: function () {
    return {
      data: null
    }
  },
  mounted() {

  },
  watch: {},
  methods: {}
}
</script>

<style scoped>

</style>
