<template>
  <div class="home flex">
		
    <vue-cal selected-date="2018-11-19"
         xsmall
         :time-from="10 * 60"
         :time-step="2 * 60"
         :disable-views="['years', 'year', 'day']"
         default-view="month"
         :events="events">
				<span slot="events-count-month-view" slot-scope="{ events }" v-if="countEventsMonthView(events)">
					{{ countEventsMonthView(events) }}
				</span>
		</vue-cal>
		
    <news/>
    <profile-frame/>
  </div>
</template>

<script>
// @ is an alias to /src
import ProfileFrame from '@/components/ProfileFrame/BaseProfileFrame';
import News from '@/components/News/index';

import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

export default {
	components: {
		ProfileFrame,
		VueCal,
		News,
	},
	data: () => ({
    events: [
      {
        start: '2018-11-19 10:35',
        end: '2018-11-19 11:30',
        title: 'Doctor appointment'
      },
      {
        start: '2018-11-19 18:30',
        end: '2018-11-19 19:15',
        title: 'Dentist appointment'
      },
      {
        start: '2018-11-20 18:30',
        end: '2018-11-20 20:30',
        title: 'Crossfit'
      },
      {
        start: '2018-11-21 11:00',
        end: '2018-11-21 13:00',
        title: 'Brunch with Jane'
      },
      {
        start: '2018-11-21 19:30',
        end: '2018-11-21 23:00',
        title: 'Swimming lesson'
      }
    ]
  }),
	methods: {
		countEventsMonthView: events => {
			return events ? events.filter(e => e.class === 'leisure').length : 0
		}
	}
};
</script>
<style>
.home {
	justify-content: space-between;
	flex-wrap: wrap;
}

.vuecal__cell-events-count {background: transparent;}
.vuecal__cell-events-count span {background: #42b983;height: 100%;border-radius: 12px;display: block;}
</style>

