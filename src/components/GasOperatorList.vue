<template>
  <div>
    <v-row>
      <v-col>
        <h3>Liste der Gasversorger</h3>
      </v-col>
    </v-row>
    <v-row class="my-0">
      <v-col>
        <!-- Application List Table -->
        <v-layout child-flex>
        <v-data-table
            :items="gasOperatorList"
            :items-per-page="10"
            :loading="loadingData"
            :headers="headers"
            locale="de-CH"
            loading-text="Gasversorger werden geladen."
            class="elevation-1">
          <template v-slot:item="props">
            <tr>
              <td nowrap="true">{{ props.item.name }}</td>
              <td nowrap="true">{{ props.item.short_name }}</td>
              <td></td>
            </tr>
          </template>
        </v-data-table>
        </v-layout>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { showSnack } from '@/globalActions'
import axios from "axios";

export default {
  components: {
  },
  data: () => ({
    gasOperatorList: [],
    loadingData: false,
  }),
  mounted () {
    this.getData()
  },
  created () {
  },
  methods: {
    getData () {
      this.loadingData = true
      axios.get('/settings/gas_operators')
          .then((res) => {
            this.gasOperatorList = res.data
          })
          .catch((ex) => {
            console.log('fetch data failed: ' + ex.message)
            showSnack({ message: 'Daten konnten nicht geladen werden.', color: 'red' })
          })
          .finally(() => {
            this.loadingData = false
          })
    }
  },
  computed: {
    headers: {
      get () {
        return [
          {
            text: 'Gasversorger',
            align: 'start',
            filterable: false,
            value: 'name'
          },
          {
            text: 'Kurzname',
            align: 'start',
            filterable: false,
            value: 'short_name'
          },
          {
            text: '',
            filterable: false
          }
        ]
      }
    }
  },
  watch: {

  }
}

</script>
<style>

</style>
