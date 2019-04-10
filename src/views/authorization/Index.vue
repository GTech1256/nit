<template>
<div class="auth">
   <b-form @submit.prevent="onSubmit" @reset.prevent="onReset" v-if="show" class="col-6 auth_form">
      <b-form-group
        id="input-group-1"
        label="Ваша почта:"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="form.email"
          type="email"
          required
          placeholder="Почту от аккаунта"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Ваш пароль:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.password"
          type="password"
          required
          placeholder="Пароль от аккаунта"
        ></b-form-input>
      </b-form-group>


      <b-button type="submit" variant="primary" >Отправить</b-button>
      <b-button type="reset" variant="danger" class="offset-1">Сбросить</b-button>
    </b-form>
    </div>
</template>
<script>
import types from '../../store/modules/user/TYPES';

  export default {
    data() {
      return {
        form: {
          email: '',
          password: '',
        },
        
        show: true
      }
    },
    methods: {
      onSubmit() {
        
        	this.$store.dispatch(types.AUTH_SIGNIN, this.form).then(() => {
            this.$router.push({ name: 'profile' })
          }).catch((e) => {
            alert(JSON.stringify(e));
          })
      },
      onReset() {
        // Reset our form values
        this.form.email = ''
        this.form.password = ''

        // Trick to reset/clear native browser form validation state
        this.show = false
        this.$nextTick(() => {
          this.show = true
        })
      }
    }
  }
</script>
<style lang="scss">
.auth {
  height: 100%;
  &_form {
    border: 1px solid rgba(0, 0, 0, .3);
    padding: 20px;
    border-radius: 10px;
    margin: 20px auto;
  }
}
</style>
