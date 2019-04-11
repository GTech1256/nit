<template>
  <div>
    <h2 class="news">News</h2>
    <button @click="isShowNotSavedNews = true" v-if="isProfileLoaded">add new news</button>
    <div class="news_container">
    <news-article v-if="isShowNotSavedNews" :articleDataProps="{image: { ETag: 'n'}, title: 'n', text: 'n', date: Date.now()}" :isEditable="canEditNews" :isNotSaved="true" @saved="onSaveNewArticle"/>
    <!-- all current news -->
    <news-article v-for="article in data.data" :key="article.id" :articleDataProps="article" :isEditable="canEditNews" />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
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
    },
    ...mapGetters(['isProfileLoaded'])
  },
  methods: {
    onSaveNewArticle(article) {
      console.log(article)
      let newArray = [article].concat(this.data.data);
      newArray.length = 10;

      console.log(newArray)
      this.data.data = newArray;
      this.isShowNotSavedNews = false;
    }
  }
}
</script>
<style>
.news {
	min-width: 600px;
}

.news_container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
</style>

