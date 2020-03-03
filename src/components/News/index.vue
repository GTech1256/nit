<template>
  <div>
    <news-create-modal
      v-model="isShowNewsCreateModal"
      @created="handleNewsCreate"
    />
    <h2 class="news">Новости</h2>
    <b-button
      v-if="isProfileLoaded"
      id="btn-show-create-news"
      class="mb-2 mt-2"
      variant="outline-primary"
      @click="isShowNewsCreateModal = true"
    >
      Добавить новую новость
    </b-button>
    <div class="news__container">
      <news-article
        v-for="article in data.data"
        :key="article._id"
        class="news__article"
        v-bind="article"
        :isEditable="canEditNews"
      />
    </div>
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
      const newArray = [article, ...this.data.data];
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

.news__container {
  display: flex;
  width: 80%;
  margin: 0 auto;
  flex-wrap: wrap;
}

.news__article {
  margin-bottom: 50px;
}
</style>
