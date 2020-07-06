<template>
  <div class="profile">
    <div class="profile_upload">
      <input type="file" ref="file">
      <input type="button" @click="sendFile" value="send" :disabled="isUploading">
    </div>
    <div class="profile_docs">
      <table>
        <thead>
          <th>name</th>
          <th>download</th>
        </thead>
        <tr v-for="(file, i) in userFiles" :key="i">
          <td>{{ file.name }}</td>
          <td>
            <a :href="file.url">Ссылка на скачивание</a>
          </td>
          <td>
            <button @click="removeFile(file)">удалить</button>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import types from '../../store/modules/user/TYPES';

export default {
  data: () => ({
    isUploading: false,
  }),
  methods: {
    sendFile() {
      const fd = new FormData();
      fd.append('file', this.$refs.file.files[0]);
      this.isUploading = true;
      this.$store.dispatch(types.FILE_UPLOAD, fd)
        .then(() => {
          const input = this.$refs.file;
          input.type = 'text';
          input.type = 'file';
        })
        .catch((e) => {
          console.log(e);
          alert('Ошибка при загрузке файла');
        })
        .finally(() => {
          this.isUploading = false;
        });
    },
    removeFile({ name }) {
      console.log({ name }, 11);

      this.$store.dispatch(types.FILE_REMOVE, { name });
    },
  },
  computed: {
    ...mapGetters(['userFiles']),
  },
};
</script>
