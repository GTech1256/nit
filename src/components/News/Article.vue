<template>
  <b-card class="article col-2 offset-1" :class="{ editable: isEditable }" :style="{ opacity: isNotSaved ? '0.5' : 1 }" >
    <div class="article_img-wrapper">
      <img class="article-img" :src="articleData.image.Location" :alt="articleData.image.ETag" @click="uploadNewImage">
      <input type="file">
    </div>
    <input class="article_title" v-model="articleData.title" >
    <input class="article_title" v-model="articleData.text" >
    <div class="article_sub">
      <span class="article_sub-date" @click="setNewDate">{{ new Date(articleData.date).toLocaleDateString() }}</span>
      <b-link href="#" class="card-link">Подробнее</b-link>
    </div>
    <div v-if="isEditingArticle" class="article_edit-panel">
      <button @click="saveArticle()">save</button>
      <button @click="resetArticle()">revert</button>
    </div>
  </b-card>
</template>
<script>
import cloneDeep from 'lodash/cloneDeep';

// import types from '@/store/modules/news';

export default {
  props: {
    isEditable: {
      type: Boolean,
      required: true,
    },
    isNotSaved: {
      type: Boolean,
    },
    articleDataProps: {
      type: Object,
      required: true,
    },
  },
  watch: {
    articleData: {
      handler() {
        this.isEditingArticle = true;
      },
      deep: true,
    },
  },
  data() {
    return {
      articleData: cloneDeep(this.articleDataProps),
      isEditingArticle: false,
    };
  },
  methods: {
    setNewDate() {
      this.articleData.date = Date.now() / 2;
    },
    saveArticle() {

    },
    resetArticle() {
      this.articleData = cloneDeep(this.articleDataProps);
      this.$nextTick(() => {
        this.isEditingArticle = false;
      });
    },
    uploadNewImage() {

    },
  },
};
</script>
<style lang="scss" scoped>
.card, .card-body {
  padding: 0;
}

.article_img-wrapper {
  height: 150px;
  overflow: hidden;
  background-color: #7f7f7f;
}
.article_img {
  width: inherit;
  height: inherit;
  transform: scale(1);
  transition: transform 0.5s ease;
  &:hover {
    transform: scale(1.2);
  }
}

.editable {
  input, .article_sub-date, .article-img {
    cursor: pointer;
  }

}

.article:not(.editable) {
  input, .article_sub-date, .article-img {
    pointer-events: none;
  }
}

input {
  border: transparent;
  outline: none;
  background: transparent;
}
</style>
