<template>
  <div>
    <news-create-modal
      v-model="isShowNewsCreateModal"
    />
    <h2 class="news">Новости</h2>
    <b-button
      id="btn-show-create-news"
      @click="isShowNewsCreateModal = true"
      v-if="isProfileLoaded"
    >
      Добавить новую новость
    </b-button>
    <div class="news_container">
      <news-article
        v-for="article in data.data"
        :key="article.id"
        v-bind="article"
        :isEditable="canEditNews"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import Article from './Article.vue';
import NewsCreateModal from './NewsCreateModal/NewsCreateModal.vue';
import { getNews } from '@/api/news';

export default {
  components: {
    NewsArticle: Article,
    NewsCreateModal,
  },
  data() {
    return {
      data: {
        meta: {

        },
        data: [],
      },
      isShowNewsCreateModal: false,
    };
  },
  mounted() {
    getNews()
      .then(({ data }) => {
        this.data = data;
      });
  },
  computed: {
    canEditNews() {
      return true;
    },
    ...mapGetters(['isProfileLoaded']),
  },
  methods: {
    onSaveNewArticle(article) {
      const newArray = [...article, this.data.data];
      newArray.length = 10;

      this.data.data = newArray;
      this.isShowNewsCreateModal = false;
    },
  },
};
</script>
<style>
.news {

}

.news_container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
</style>
