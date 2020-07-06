<template>
  <div class="home">
    <img class="home__pic" src="../../assets/news.jpg">
    <div class="home__container">


      <div class="home__news block">
        <news/>
      </div>

      <div class="home__callendar block">
        <div class="callendar">
        <vue-cal
          selected-date="2018-11-19"
          class="callendar-content center-block col-6"
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
        </div>

      </div>

    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import News from '@/components/News/index';

import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';

export default {
  components: {
    VueCal,
    News,
  },
  data: () => ({
    events: [
      {
        start: '2018-11-19 10:35',
        end: '2018-11-19 11:30',
        title: 'Doctor appointment',
      },
      {
        start: '2018-11-19 18:30',
        end: '2018-11-19 19:15',
        title: 'Dentist appointment',
      },
      {
        start: '2018-11-20 18:30',
        end: '2018-11-20 20:30',
        title: 'Crossfit',
      },
      {
        start: '2018-11-21 11:00',
        end: '2018-11-21 13:00',
        title: 'Brunch with Jane',
      },
      {
        start: '2018-11-21 19:30',
        end: '2018-11-21 23:00',
        title: 'Swimming lesson',
      },
    ],
  }),
  methods: {
    countEventsMonthView: events => (events ? events.filter(e => e.class === 'leisure').length : 0),
  },
};
</script>
<style lang="scss" scoped>
.home {
  justify-content: space-between;
  flex-wrap: wrap;
}


.block {
  padding: 20px;

}

.callendar-badge {
  font-size: 22px;
}

.callendar-content {
  margin: auto;
  margin-top: 20px;
  background-color: white;
}

.vuecal__cell-events-count {background: transparent;}
.vuecal__cell-events-count span {background: #42b983;height: 100%;border-radius: 12px;display: block;}

.home__container {
  padding: 0 5%;
}

.home__pic {
  width: 80%;
  margin: 15px auto;
}

.home__callendar {
  max-width: 500px;
}


@media screen and (min-width: 900px) {
  .home__container {
    display: flex;
    padding: 0 5%;
    justify-items: space-between;
  }
  .home__pic {
    width: 60%;
    margin: 15px auto;
  }

  .home__news {
    flex-grow: 4;
  }

  .home__callendar {
    flex-shrink: 0;
    flex-grow: 0;
  }
}
</style>
