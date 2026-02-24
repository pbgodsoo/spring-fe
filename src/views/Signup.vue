<template>
  <div class="container">
    <h1>회원가입</h1>

    <input v-model="email" class="input" type="email" placeholder="이메일" />

    <input v-model="name" class="input" type="text" placeholder="이름" />

    <input v-model="password" class="input" type="password" placeholder="비밀번호" />

    <button class="button" @click="signup" :disabled="loading">
      {{ loading ? '가입중...' : '회원가입' }}
    </button>

    <p v-if="msg" class="msg">{{ msg }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/plugins/axiosinterceptor'

const router = useRouter()

const email = ref('')
const name = ref('')
const password = ref('')

const loading = ref(false)
const msg = ref('')

async function signup() {
  msg.value = ''

  if (!email.value.trim() || !name.value.trim() || !password.value.trim()) {
    msg.value = '모든 항목을 입력하세요.'
    return
  }

  loading.value = true

  try {
    const payload = {
      email: email.value,
      name: name.value,
      password: password.value,

      enable: 0,
      role: 'ROLE_USER',
    }

    const res = await api.post('/user/signup', payload)

    msg.value = typeof res.data === 'string' ? res.data : '회원가입 성공'

    email.value = ''
    name.value = ''
    password.value = ''

    setTimeout(() => {
      router.push('/login')
    }, 1000)
  } catch (e) {
    msg.value = e?.response?.data?.message || e?.response?.data || '회원가입 실패'
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.container {
  max-width: 400px;
  margin: 80px auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input {
  padding: 12px;
  font-size: 14px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
}

.button {
  padding: 12px;
  cursor: pointer;
  border: 1px solid #ddd;
  background: #fff;
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.msg {
  font-size: 13px;
  color: #444;
}
</style>
