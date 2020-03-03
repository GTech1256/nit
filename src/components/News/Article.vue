<template>
  <b-card
    class="article col-2 offset-1"
  >
    <div class="article__image-placeholder">
      <img
        class="article__image"
        v-if="image"
        :src="image.url"
        :alt="image.name"
        width="300"
        height="100"
      >
    </div>

    <p>{{title}}</p>
    <p class="article__content">{{text}}</p>
    <div class="article__sub">
      <span
        class="article__sub-date"
      >
        {{ new Date(date).toLocaleDateString() }}
      </span>
      <b-link href="#" class="card-link">Подробнее</b-link>
    </div>
  </b-card>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      reguire: true,
    },
    image: {
      type: Object,
    },
    text: {
      type: String,
      reguire: true,
    },
    date: {
      type: String,
      reguire: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.card, .card-body {
  display: flex;
  padding: 0;

  flex-direction: column;
}

.article {
  width: 300px;
  height: 300px;
}

.article__sub {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
}

.article__image-placeholder {
  width: 100%;
  height: 30%;

  background: url("~/img/img-placeholder.png") center/100%;
  background-size: cover;
}

.article__image {
  width: 100%;
  height: 100%
}

.article__content {
  margin-bottom: auto;
}
</style>
