<template>
  <b-modal
    id="modal-create-news"
    ref="modal"
    title="Создание новости"
    centered
    @show="resetModal"
    @shown="focusMyElement"
    @hidden="resetModal"
    @ok="handleOk"
    @change="$emit('input', $event)"
    v-model="value"
  >
    <form
      ref="form"
      @submit.stop.prevent="handleSubmit"
    >
      <b-form-group
        label="Заголовок новости"
        label-for="input-1"
        :invalid-feedback="titleState"
      >
        <b-form-input
          id="input-1"
          ref="focusThis"
          v-model="title"
          :state="!titleState"
          required
          placeholder="Введите заголовок"
        />
      </b-form-group>

      <b-form-group
        label="Текст новости"
        label-for="input-2"
        :invalid-feedback="textState"
      >
        <b-form-input
          id="input-2"
          v-model="text"
          :state="!textState"
          required
          placeholder="Введите текст новости"
        />
      </b-form-group>

      <b-form-group
        label="Дата новости"
        label-for="input-3"
        :invalid-feedback="dateState"
      >
        <b-form-datepicker
          class="mb-2"
          id="input-3"
          v-model="date"
          :state="!dateState"
        />
      </b-form-group>

      <b-form-group
        label="Дата новости"
        label-for="input-3"
        :invalid-feedback="dateState"
      >
        <b-form-file
          v-model="image"
          :state="Boolean(image)"
          accept=".jpg, .png"
          placeholder="Выберите фаил или перенесите его"
          drop-placeholder="Перенесите его фаил сюда..."
        />
      </b-form-group>
    </form>

    <template v-slot:modal-footer>
      <div class="w-100">
        <b-button
          variant="success"
          class="float-right"
          type="submit"
          @click="handleSubmit"
        >
          Сохранить
        </b-button>
        <b-button
          variant="secondary"
          class="float-right mr-2"
          @click="$root.$emit('bv::hide::modal', 'modal-create-news', '#btn-show-create-news')"
        >
          Закрыть
        </b-button>
      </div>
    </template>

  </b-modal>
</template>
<script>
import { uploadArticle } from '@/api/news';

export default {

  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },

  data: () => ({
    title: '',
    image: null,
    text: '',
    date: new Date(),
  }),

  computed: {
    titleState() {
      if (this.title.length < 3) {
        return 'Длина заголовка не может быть меньше 3 символов';
      }

      return '';
    },

    textState() {
      if (this.text.length < 3) {
        return 'Длина контента не может быть меньше 10 символов';
      }

      return '';
    },

    dateState() {
      if (!this.date) {
        return 'Вы забыли выбрать дату';
      }

      // if (this.date > new Date().getTime()) {
      //   return 'Дата новости не может быть в будущем';
      // }

      return '';
    },
  },

  methods: {
    resetModal() {
      this.title = '';
      this.image = null;
      this.text = '';
      this.date = new Date();

      // this.nameState = null;
    },

    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmit();
    },

    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.$refs.form.checkValidity()) {
        return;
      }

      console.log('PRE SAVE');

      this.saveArticle()
        .then(({ data }) => {
          this.$emit('input', data);
        });
    },

    saveArticle() {
      return uploadArticle({
        title: this.title,
        text: this.text,
        date: this.date,
        image: this.image,
      });
    },

    focusMyElement() {
      this.$refs.focusThis.focus();
    },
  },
};
</script>
