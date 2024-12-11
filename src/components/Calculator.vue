<template>
  <q-page class="flex flex-center" @click.stop>
    <div class="q-pa-sm" style="width: 300px">
      <q-card class="bg-grey-3">
        <q-card-section class="q-pb-none">
          <q-input v-model="display" :style="{ fontSize: fontSize }" outlined readonly />
        </q-card-section>
        <q-card-section>
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
import { ref, watch } from "vue"

const emit = defineEmits(['enter'])

const display = ref("0") // 顯示的輸入
const currentInput = ref("") // 當前輸入的運算式
const fontSize = ref("3rem")

const buttons = [
  { label: "7", color: "#777677" },
  { label: "8", color: "#777677" },
  { label: "9", color: "#777677" },
  { label: "←", color: "#ff9e0b" },
  { label: "4", color: "#777677" },
  { label: "5", color: "#777677" },
  { label: "6", color: "#777677" },
  { label: "+", color: "#ff9e0b" },
  { label: "1", color: "#777677" },
  { label: "2", color: "#777677" },
  { label: "3", color: "#777677" },
  { label: "-", color: "#ff9e0b" },
  { label: "AC", color: "#ff9e0b" },
  { label: "0", color: "#777677" },
  { label: "=", color: "#ff9e0b" },
  { label: "↵", color: "#ff9e0b" },
]

watch(currentInput, (newValue) => {
  const maxLength = 8
  const fontSizeMultiplier = 1.5

  if (newValue.length > maxLength) {
    fontSize.value = `${Math.max(3 / (newValue.length / fontSizeMultiplier), 1)}rem`
  } else {
    fontSize.value = "3rem"
  }
})

const getButtonStyle = (btn) => ({
  backgroundColor: btn.color,
  color: "#fff",
})

const handleButtonClick = (btn) => {
  const { label } = btn

  if (label === "AC") {
    currentInput.value = ""
    display.value = "0"
    return
  }

  if (label === "←") {
    currentInput.value = currentInput.value.slice(0, -1)
    display.value = currentInput.value || "0"
    return
  }

  if (label === "↵") {
    try {
      if (currentInput.value === '') {
        currentInput.value = 0
        emit('enter', currentInput.value)
      } else {
        const result = eval(currentInput.value)
        currentInput.value = result.toString()
        emit('enter', result)
      }
    } catch {
      display.value = "Error"
      currentInput.value = "Error"
    }
    return
  }

  if (label === "=") {
    try {
      display.value = eval(currentInput.value).toString() || "0"
    } catch {
      display.value = "Error"
    }
    currentInput.value = display.value
    return
  }

  if (label === "+" || label === "-") {
    const lastChar = currentInput.value.toString().slice(-1)
    if (lastChar === label) {
      return
    }
    if (lastChar === "+" || lastChar === "-") {
      currentInput.value = currentInput.value.toString().slice(0, -1) + label
    } else {
      currentInput.value += label
    }
    display.value = currentInput.value
    return
  }

  if (currentInput.value === "0" && !isNaN(label)) {
    currentInput.value = label
  } else {
    currentInput.value += label
  }
  display.value = currentInput.value
}

</script>

<style scoped>
.button-custom {
  flex: 1 0 20%;
  height: 60px;
  max-width: 25%;
  font-size: 1.4rem;
}
</style>
