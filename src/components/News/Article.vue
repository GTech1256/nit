<template>
  <b-card class="article col-2 offset-1" :class="{ editable: isEditable }" :style="{ opacity: isNotSaved ? '0.5' : 1 }" >
    <div class="article_img-wrapper">
      <input class="article-img__upload" type="file" @change="setImage" ref="imageInput">
      <img class="article-img" v-if="articleData.image" :src="articleData.image.Location">
      
    </div>
    <input class="article_title" v-model="articleData.title" >
    <input class="article_text" v-model="articleData.text" >
    {{ articleData._id || 'data'}}
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
import { uploadArticle } from '@/api/news'

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
    setImage({ target }) {

      const reader = new FileReader();
      reader.readAsDataURL(target.files[0]);
      reader.onload = () => {
        this.$set(this.articleData, 'image', { Location: reader.result })
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
    },
    setNewDate() {
      this.articleData.date = Date.now() / 2;
    },
    /**
   * ADD new article of news
   * @body { ?FormData:image, String:title, String:text, ?Date:date }
   *
   * @return
   *    200 - <news>
   *    xxx -
   */
    saveArticle() {
      uploadArticle({
        title: this.articleData.title,
        text: this.articleData.text,
        date: this.articleData.date,
      }, this.$refs.imageInput.files[0])
      .then(({ data }) => {
        this.$emit('saved', data);
      })
    },
    resetArticle() {
      this.articleData = cloneDeep(this.articleDataProps);
      this.$nextTick(() => {
        this.isEditingArticle = false;
      });
    },
  }
}
</script>
<style lang="scss" scoped>
.card, .card-body {
  padding: 0;
}

.article_img-wrapper {
  height: 150px;
  overflow: hidden;
  background-color: #7f7f7f;
  position: relative;
}
.article_img {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  transform: scale(1);
  transition: transform 0.5s ease;
  &:hover {
    transform: scale(1.2);
  }
}

.article_sub {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
}

.editable {
  input, .article_sub-date, .article_img-wrapper {
    cursor: pointer;
  }

}

.article:not(.editable) {
  input, .article_sub-date, .article_img-wrapper {
    pointer-events: none;
  }
}

input {
  border: transparent;
  outline: none;
  background: transparent;
}

.article-img__upload {
 position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  opacity: 0;
}
</style>
