<template>
  <div class="container">
    <h1>로그인</h1>

    <input v-model="email" class="input" type="email" placeholder="이메일" />

    <input v-model="password" class="input" type="password" placeholder="비밀번호" />

    <button class="button" @click="login" :disabled="loading">
      {{ loading ? '로그인중...' : '로그인' }}
    </button>

    <p v-if="msg" class="msg">{{ msg }}</p>

    <div class="links">
      <button class="link" @click="goSignup">회원가입</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/plugins/axiosinterceptor'

const router = useRouter()

const email = ref('')
const password = ref('')

const loading = ref(false)
const msg = ref('')

async function login() {
  msg.value = ''

  if (!email.value.trim() || !password.value.trim()) {
    msg.value = '이메일/비밀번호를 입력하세요.'
    return
  }

  loading.value = true

  try {
    // ✅ 백엔드 로그인 엔드포인트에 맞게 수정
    const res = await api.post('/user/login', {
      email: email.value,
      password: password.value,
    })

    // ✅ 로그인 성공 시 사용자 객체 저장
    // 예:
    // {
    //   "idx": 2,
    //   "email": "ab@naver.com",
    //   "name": "ab"
    // }
    const user = res.data

    localStorage.setItem('user', JSON.stringify(user))

    msg.value = '로그인 성공'

    // ✅ 로그인 후 이동할 페이지
    router.push('/board')
  } catch (e) {
    // ✅ 500 에러일 경우 (아이디/비번 틀림)
    if (e.response?.status === 500) {
      msg.value = '이메일 또는 비밀번호가 틀렸습니다.'
    } else {
      msg.value = '로그인 실패'
    }
    console.error(e)
  } finally {
    loading.value = false
  }
}

function goSignup() {
  router.push('/signup')
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

.links {
  display: flex;
  justify-content: flex-end;
}

.link {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  font-size: 13px;
}
</style>
