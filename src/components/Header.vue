<template>
  <ul class="header">
    <router-link class="header_item" :to="{ name: 'home' }" tag="li">home</router-link>
    <router-link class="header_item" :to="{ name: 'signin' }" tag="li">login</router-link>
    <router-link class="header_item" :to="{ name: 'signup' }" tag="li">signup</router-link>
  </ul>
</template>
<style lang="scss">
.header {
	margin: 0;
	padding: 20px 0;
	background: rgb(7, 148, 173);
	display: flex;
	justify-content: space-around;
	list-style: none;
	&_item {
		cursor: pointer;
		font-size: 21px;
		font-weight: bold;
	}
}
</style>

