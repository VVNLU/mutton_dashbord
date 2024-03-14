<template>
    <q-layout>
        <q-page-container>
            <q-page class="bg-page flex flex-center">
                <q-card class="bg-card q-pb- w-3/10 <sm:w-4/5 <md:w-3/5">
                    <q-card-section>
                        <div class="text-center q-pt-lg">
                            <span class="text-h4 text-bold">羊肉爐後台管理</span>
                        </div>
                    </q-card-section>
                    <q-card-section>
                        <base-form ref="form">
                            <text-input v-model="formData.account" :label="'帳號'" :placeholder="'請輸入帳號'" lazy-rules
                                :rules="[$rules.required('帳號必填')]" />
                            <password-input v-model="formData.password" @keyup.enter="handleLogin" />
                            <confirm-button class="q-mb-md" style="width: 100%" :label="'登入'"
                                @click.prevent="handleLogin" />
                        </base-form>
                    </q-card-section>
                </q-card>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script setup>
import { reactive, nextTick, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import useCRUD from '@/hooks/useCRUD'

const router = useRouter()
const formData = reactive({
    account: '',
    password: '',
})

const handleLogin = async () => {
    form.value.validate().then(async (success) => {
        if (success) {
            router.push({ path: '/' })
        }
    })
}

const { form } = useCRUD({
    createSuccess: '登入成功'
})
</script>

<style scoped>
.bg-page {
    background-image: url('@/assets/login-image.jpg');
    background-size: cover;
    opacity: 0.9;
}
</style>