<template>
  <div class="profile">
    <div class="profile_upload">
      <input type="file" ref="file">
      <input type="button" @click="sendFile" value="send">
    </div>
    <div class="profile_docs">
      <table>
        <thead>
          <th>name</th>
          <th>download</th>
        </thead>
        <tr v-for="(file, i) in userFiles" :key="i">
          <td>{{ file.name.split('|')[1] }}</td>
          <td>
            <a :href="file.url">{{ file.url }}</a>
          </td>
          <td @click="removeFile(file.name)">удалить</td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import types from '../store/modules/user/TYPES';
export default {
	methods: {
		sendFile(event) {
			const fd = new FormData();
			fd.append('file', this.$refs.file.files[0]);
			this.$store.dispatch(types.FILE_UPLOAD, fd);
		},
		removeFile(name) {
			this.$store.dispatch(types.FILE_REMOVE, { name });
		},
	},
	computed: {
		...mapGetters(['userFiles']),
	},
};
</script>

