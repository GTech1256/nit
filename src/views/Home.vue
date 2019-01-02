<template>
  <div class="home flex">
    <img src="../assets/calendar.png" alt="calendar">
    <news/>
    <profile-frame/>
  </div>
</template>

<script>
// @ is an alias to /src
import ProfileFrame from '@/components/ProfileFrame/BaseProfileFrame';
import News from '@/components/News';

export default {
	components: {
		ProfileFrame,
		News,
	},
};
</script>
<style>
.home {
	justify-content: space-between;
}
</style>

