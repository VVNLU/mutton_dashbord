<template>
  <base-dialog v-model="isShowDialog" title="忘記密碼" confirm-button-text="送出" @save="onSave" @hide="onHide">
    <base-form ref="form">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12">
          <q-item>
            <text-input v-model="data.state.account" class="full-width" label="帳號 *" placeholder="請輸入帳號"
              :rules="[$rules.required('帳號必填')]" />
          </q-item>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12">
          <q-item>
            <email-input v-model="data.state.email" class="full-width" label="Email *" placeholder="請輸入Email"
              :rules="[$rules.required('Email必填')]" />
          </q-item>
        </div>
      </div>
    </base-form>
  </base-dialog>
</template>

<script setup>
import { useUser } from '@/stores/user'
import useDialog from '@/hooks/useDialog'

const emit = defineEmits(['save'])

const store = useUser()

const createFetch = async (payload) => {
  return await store.forgetPassword(payload)
}

const onSave = async () => {
  const [res, error] = await save()
  if (res) emit('save')
}

const onHide = () => {
  data.reset()
}

const { form, data, isShowDialog, showDialog, save } = useDialog({
  formData: {
    account: '',
    email: '',
  },
  createFetch: createFetch,
  createSuccess: '忘記密碼送出成功',
})
</script>