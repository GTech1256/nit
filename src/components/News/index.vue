<template>
  <div>
    <h2 class="news">News</h2>
    <button @click="isShowNotSavedNews = true">add new news</button>
    <news-article v-if="isShowNotSavedNews" :articleDataProps="{image: { ETag: 'n'}, title: 'n', text: 'n', date: Date.now()}" :isEditable="canEditNews" :isNotSaved="true" />
    <!-- all current news -->
    <news-article v-for="article in data.data" :key="article.id" :articleDataProps="article" :isEditable="canEditNews" />
  </div>
</template>
<script>
import Article from './Article';
import { getNews } from '@/api/news';

export default {
  components: {
    NewsArticle: Article
  },
  data() {
    return {
      data: {
        meta: {

        },
        data: []
      },
      isShowNotSavedNews: false
    }
  },
  async mounted() {
    getNews().then(({ data }) => this.data = data).catch(console.dir)
  },
  computed: {
    canEditNews() {
      return true;
    }
  }
}
</script>
<style>
.news {
	min-width: 600px;
}
</style>

