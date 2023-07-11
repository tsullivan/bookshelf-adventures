<script setup lang="ts">
import { ref, type Ref } from 'vue'
const msg: Ref<string> = ref('')
const fling: Ref<string> = ref(msg.value.toUpperCase())
</script>

<template>
  <div>
    <h1>Hello world</h1>
    <h2>{{ fling }}</h2>
    <input v-model="msg" type="text" />
  </div>
</template>
