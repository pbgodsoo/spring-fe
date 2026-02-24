<template>
  <div class="container">
    <h1>게시글 작성</h1>

    <input v-model="title" class="input" placeholder="제목" />
    <textarea v-model="content" class="textarea" placeholder="내용"></textarea>

    <button class="button" @click="submit" :disabled="loading">
      {{ loading ? '등록중...' : '등록' }}
    </button>

    <p v-if="msg" class="msg">{{ msg }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/plugins/axiosinterceptor'

const title = ref('')
const content = ref('')
const loading = ref(false)
const msg = ref('')

async function submit() {
  msg.value = ''

  if (!title.value.trim() || !content.value.trim()) {
    msg.value = '제목/내용을 입력하세요.'
    return
  }

  loading.value = true

  try {
    const payload = {
      title: title.value,
      contents: content.value,
    }

    const res = await api.post('/board/register', payload)
    msg.value = typeof res.data === 'string' ? res.data : '등록 완료'

    title.value = ''
    content.value = ''
  } catch (e) {
    msg.value = e?.response?.data?.message || '등록 실패 (서버/프록시 설정 확인)'
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: 60px auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input,
.textarea {
  padding: 10px;
  font-size: 14px;
}

.textarea {
  min-height: 120px;
  resize: none;
}

.button {
  padding: 10px;
  cursor: pointer;
}
</style>
