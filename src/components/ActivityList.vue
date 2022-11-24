<template>
  <v-timeline
      align-top
      dense
  >
    <v-timeline-item
        v-for="activity in activityList"
        :key="activity.id"
        color="primary"
        small
    >
      <div>
        <div class="font-weight-normal">
          <strong>{{ activity.changed_by }} <a :href="'/gesuch/' + activity.identifier">{{ activity.identifier }}</a></strong> @{{ new Date(activity.createdAt).toLocaleTimeString(undefined, {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'}) }}
        </div>
        <div>{{ activity.activity_text }}</div>
      </div>
    </v-timeline-item>
  </v-timeline>
</template>

<script>
import axios from 'axios'
import { showSnack } from '@/globalActions'

export default {
  name: 'ActivityList',
  props: ['activityList', 'loading'],
  data: () => ({

  }),
  created () {

  },
  methods: {

  },
  computed: {

  }
}
</script>

<style scoped>

</style>
