<template>
  <q-page class="flex flex-center" @click.stop>
    <div class="q-pa-sm" style="width: 350px">
      <q-card class="bg-grey-3">
        <q-card-section>
          <q-input v-model="display" :style="{ fontSize: fontSize }" outlined readonly />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="row q-gutter-sm">
            <q-btn v-for="btn in buttons" :key="btn.label" :label="btn.label" :style="getButtonStyle(btn)"
              @click="handleButtonClick(btn)" class="button-custom" rounded />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue"
import useNotify from '@/hooks/useNotify'

const emit = defineEmits(['enter'])
const { notify } = useNotify()

const display = ref("") // 顯示的輸入
const currentInput = ref("") // 當前輸入的運算式
const fontSize = ref("3rem")

const buttons = [
  { label: "7", color: "#777677" },
  { label: "8", color: "#777677" },
  { label: "9", color: "#777677" },
  { label: "4", color: "#777677" },
  { label: "5", color: "#777677" },
  { label: "6", color: "#777677" },
  { label: "1", color: "#777677" },
  { label: "2", color: "#777677" },
  { label: "3", color: "#777677" },
  { label: "←", color: "#ff9e0b" },
  { label: "0", color: "#777677" },
  { label: "↵", color: "#ff9e0b" },
]


const getButtonStyle = (btn) => ({
  backgroundColor: btn.color,
  color: "#fff",
})

const handleButtonClick = (btn) => {
  const { label } = btn

  if (label === "←") {
    currentInput.value = currentInput.value.slice(0, -1)
    display.value = currentInput.value || "0"
    return
  }

  if (label === "↵") {
    if (currentInput.value.length > 10) {
      notify({ message: '最多 10 個字', type: 'negative' })
      return
    }
    try {
      const result = currentInput.value
      currentInput.value = result.toString()
      emit('enter', result)
    } catch {
      display.value = "Error"
      currentInput.value = "Error"
    }
    return
  }


  if (currentInput.value === "0" && label === "0") {
    currentInput.value += label
  } else {
    currentInput.value += label
  }

  display.value = currentInput.value
}

</script>

<style scoped>
.button-custom {
  flex: 1 0 25%;
  height: 60px;
  font-size: 1.4rem;
}
</style>
