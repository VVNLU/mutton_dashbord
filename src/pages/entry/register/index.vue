<template>
  <q-layout>
    <q-page-container>
      <q-page class="bg-page flex flex-center">
        <q-card class="w-3/10 <sm:w-4/5 <md:w-3/5">
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h5 text-bold ellipsis">羊肉爐後台管理</div>
              <div class="col text-h6 ellipsis">註冊</div>
            </div>
          </q-card-section>
          <q-card-section>
            <base-form ref="form" class="q-gutter-y-md">
              <text-input
                v-model="formData.email"
                :label="'Email'"
                :placeholder="'請輸入Email'"
                lazy-rules
                :rules="[$rules.required('Email必填')]"
              />
              <password-input
                v-model="formData.password"
                @keyup.enter="handleRegister"
                :rules="[$rules.required('密碼必填')]"
              />
              <div>
                <base-button
                  class="w-full q-mb-md"
                  :label="'註冊'"
                  style="width: 100%"
                  @click.prevent="handleRegister"
                />
                <div class="text-center">
                  <router-link class="text-primary no-underline" to="/login">
                    返回登入
                  </router-link>
                </div>
              </div>
            </base-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '@/stores/user'
import useCRUD from '@/hooks/useCRUD'

const router = useRouter()
const store = useUser()
const formData = reactive({
  email: '',
  password: ''
})

const createFetch = async (email, password) => {
  return await store.register(email, password)
}

const handleRegister = async () => {
  form.value.validate().then(async (success) => {
    if (success) {
      const { email, password } = formData
      const urlObj = {
        register: () => {
          return callCreateFetch(email, password)
        }
      }
      const [res, err] = await urlObj.register()
      if (res) router.push('/login')
    }
  })
}

const { form, callCreateFetch } = useCRUD({
  createSuccess: '註冊成功',
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
