<template>
  <div class="news_contttt">
    <news-create-modal
      v-model="isShowNewsCreateModal"
      @created="handleNewsCreate"
    />
    <div class="news-cont">
      <h2 class="news--title">Новости</h2>
      <b-button
        v-if="isProfileLoaded"
        id="btn-show-create-news"
        class="mb-2 mt-2"
        variant="primary"
        @click="isShowNewsCreateModal = true"
      >
        Добавить новую новость
      </b-button>
    </div>

    <div class="news__container" v-if="data.data.length">
      <news-article
        v-for="article in data.data"
        :key="article._id"
        class="news__article"
        v-bind="article"
        :isEditable="canEditNews"
      />
    </div>
    <p v-else class="no_news">Новостей нет.</p>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { getNews } from '@/api/news';
import Article from './Article.vue';
import NewsCreateModal from './NewsCreateModal/NewsCreateModal.vue';

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
    handleNewsCreate(article) {
      console.log({ article }, 'handle');

      const newArticles = [article, ...this.data.data];
      newArticles.length = 10;

      this.data = {
        ...this.data,
        data: newArticles,
      };
      this.isShowNewsCreateModal = false;
      console.log(this.isShowNewsCreateModal);
    },
  },
};
</script>
<style>
.news_contttt {
  min-height: 98vh;
}

.news__container {
}

.news--title {
  color: white;
  margin-right: 20px;
}

.news__article {
  margin-bottom: 50px;
}

.news-cont {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #28475d;
}

.no_news {
  font-size: 35px;
  font-weight: bold;
  margin-top: 45vh;
}
</style>
