<template>
  <q-layout>
    <q-page-container>
      <q-page class="bg-page flex flex-center">
        <q-card class="w-3/10 <sm:w-4/5 <md:w-3/5">
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h5 text-bold ellipsis">羊肉爐後台管理</div>
              <div class="col text-h6 ellipsis">登入</div>
            </div>
          </q-card-section>
          <q-card-section>
            <base-form ref="form" class="q-gutter-y-md">
              <text-input v-model="formData.email" :label="'Email'" :placeholder="'請輸入Email'" lazy-rules
                :rules="[$rules.required('Email必填')]" />
              <password-input v-model="formData.password" @keyup.enter="handleLogin"
                :rules="[$rules.required('密碼必填')]" />
              <div>
                <base-button class="w-full q-mb-md" :label="'登入'" style="width: 100%;" @click.prevent="handleLogin" />
                <base-button class="text-white q-mb-md" style="width: 100%;" color="black" label="忘記密碼"
                  @click.prevent="showDialog({ mode: 'create' })" />
                <div class="text-center">還沒有帳號嗎？
                  <span>
                    <router-link class="text-primary no-underline" to="/">
                      立即註冊
                    </router-link>
                  </span>
                </div>
              </div>
            </base-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
  <forget-password-dialog ref="dialog" />
</template>

<script setup>
import ForgetPasswordDialog from './components/ForgetPasswordDialog.vue'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '@/stores/user'
import useCRUD from '@/hooks/useCRUD'

const router = useRouter()
const store = useUser()
const dialog = ref()
const formData = reactive({
  email: '',
  password: '',
})

const showDialog = ({ data, mode }) => {
  dialog.value.showDialog({ data, mode })
}

const createFetch = async (email, password) => {
  return await store.login(email, password)
}

const handleLogin = async () => {
  form.value.validate().then(async (success) => {
    if (success) {
      const { email, password } = formData
      const urlObj = {
        login: () => { return callCreateFetch(email, password) }
      }
      const [res, err] = await urlObj.login()
      if (res) router.push('/')
    }

  })
}

const { form, callCreateFetch } = useCRUD({
  createSuccess: '登入成功',
  createFetch: createFetch
})
</script>

<style scoped>
.bg-page {
  background-image: url('@/assets/login-image.jpg');
  background-size: cover;
  opacity: 0.9;
}
</style>