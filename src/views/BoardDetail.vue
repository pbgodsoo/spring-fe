<template>
  <div class="container">
    <div class="top">
      <h1>게시글 상세</h1>

      <button class="button outline" @click="goBack">뒤로</button>
    </div>

    <p v-if="loading" class="msg">불러오는 중...</p>

    <p v-else-if="errMsg" class="msg">{{ errMsg }}</p>

    <div v-else class="card">
      <div class="row">
        <span class="label">번호</span>
        <span>#{{ detail.idx }}</span>
      </div>

      <div class="row">
        <span class="label">제목</span>
        <span>{{ detail.title }}</span>
      </div>

      <div class="row col">
        <span class="label">내용</span>
        <pre class="contents">{{ detail.contents }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/plugins/axiosinterceptor'

const route = useRoute()
const router = useRouter()

const detail = ref({ idx: null, title: '', contents: '' })

const loading = ref(false)
const errMsg = ref('')

async function fetchDetail() {
  loading.value = true
  errMsg.value = ''

  try {
    const idx = route.params.idx
    const res = await api.get(`/board/${idx}`)
    detail.value = res.data
  } catch (e) {
    errMsg.value = e?.response?.data?.message || '상세 조회 실패'
    console.error(e)
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.back()
}

onMounted(() => {
  fetchDetail()
})
</script>

<style scoped>
.container {
  max-width: 560px;
  margin: 60px auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.button {
  padding: 10px 12px;
  cursor: pointer;
  border: 1px solid #ddd;
  background: #fff;
}

.button.outline {
  background: transparent;
}

.msg {
  font-size: 13px;
  color: #444;
}

.card {
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.row.col {
  flex-direction: column;
  align-items: flex-start;
}

.label {
  width: 60px;
  color: #666;
  font-size: 13px;
}

.contents {
  width: 100%;
  white-space: pre-wrap;
  margin: 0;
  font-size: 14px;
}
</style>
