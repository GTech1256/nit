<template>
  <div class="article" :class="{ editable: isEditable }" :style="{ opacity: isNotSaved ? '0.5' : 1 }" >
    <div class="article_img-wrapper">
      <img class="article-img" :src="articleData.image.Location" :alt="articleData.image.ETag" @click="uploadNewImage">
      <input type="file">
    </div>
    <input class="article_title" v-model="articleData.title" >
    <input class="article_title" v-model="articleData.text" >
    <div class="article_sub">
      <span class="article_sub-date" @click="setNewDate">{{ new Date(articleData.date).toLocaleDateString() }}</span>
      <span class="article_sub-more">Подробнее</span>
    </div>
    <div v-if="isEditingArticle" class="article_edit-panel">
      <button @click="saveArticle()">save</button>
      <button @click="resetArticle()">revert</button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isEditable: {
      type: Boolean,
      required: true
    },
    isNotSaved: {
      type: Boolean,
    },
    articleDataProps: {
      type: Object,
      required: true
    }
  },
  watch: {
    articleData: {
      handler() {
      this.isEditingArticle = true;
      },
      deep: true
    }
  },
  data() {
    return {
      articleData: this.articleDataProps,
      isEditingArticle: false
    }
  },
  methods: {
    setNewDate() {
      this.articleData.date = Date.now() / 2;
    },
    saveArticle() {

    },
    resetArticle() {
      this.articleData = this.articleDataProps
    },
    uploadNewImage() {

    }
  }
}
</script>
<style lang="scss">
.article {
  height: 300px;
  width: 150px;
  border: 1px solid black;
}

.article_img-wrapper {
  width: 150px;
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
</style>
