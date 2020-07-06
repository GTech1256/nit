<template>
    <div class="article">
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
    </div>
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


.article {
  text-align: left;
}

.article__sub {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
}


.article__content {
  margin-bottom: auto;
}
</style>
