<template>
  <div class="container">
    <h1>게시글 작성</h1>

    <input v-model="title" class="input" placeholder="제목" />
    <textarea v-model="content" class="textarea" placeholder="내용"></textarea>

    <button class="button" @click="submit" :disabled="loadingWrite">
      {{ loadingWrite ? '등록중...' : '등록' }}
    </button>

    <p v-if="msg" class="msg">{{ msg }}</p>

    <hr class="divider" />

    <div class="listHeader">
      <h2>게시글 목록</h2>
      <button class="button outline" @click="fetchList" :disabled="loadingList">
        {{ loadingList ? '불러오는중...' : '새로고침' }}
      </button>
    </div>

    <p v-if="listMsg" class="msg">{{ listMsg }}</p>

    <ul v-if="boards.length" class="list">
      <li v-for="b in boards" :key="b.idx" class="listItem">
        <span class="idx">#{{ b.idx }}</span>
        <span class="title">{{ b.title }}</span>
      </li>
    </ul>

    <p v-else class="empty">
      {{ loadingList ? '불러오는 중...' : '게시글이 없습니다.' }}
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axiosinterceptor'

const title = ref('')
const content = ref('')

const loadingWrite = ref(false)

const msg = ref('')

const boards = ref([])

const loadingList = ref(false)

const listMsg = ref('')

async function fetchList() {
  loadingList.value = true
  try {
    const res = await api.get('/board/list')
    boards.value = Array.isArray(res.data) ? res.data : []
  } catch (e) {
    listMsg.value = e?.response?.data?.message || '목록 조회 실패'
    console.error(e)
  } finally {
    loadingList.value = false
  }
}

async function submit() {
  msg.value = ''

  if (!title.value.trim() || !content.value.trim()) {
    msg.value = '제목/내용을 입력하세요.'
    return
  }

  loadingWrite.value = true

  try {
    const payload = {
      title: title.value,
      contents: content.value,
    }

    const res = await api.post('/board/register', payload)
    msg.value = typeof res.data === 'string' ? res.data : '등록 완료'

    title.value = ''
    content.value = ''

    await fetchList()
  } catch (e) {
    msg.value = e?.response?.data?.message || '등록 실패 (서버/프록시 설정 확인)'
    console.error(e)
  } finally {
    loadingWrite.value = false
  }
}
onMounted(() => {
  fetchList()
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
  padding: 10px 12px;
  cursor: pointer;
  border: 1px solid #ddd;
  background: #fff;
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button.outline {
  background: transparent;
}

.msg {
  font-size: 13px;
  color: #444;
}

.divider {
  margin: 10px 0;
  border: none;
  border-top: 1px solid #eee;
}

.listHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.listItem {
  display: flex;
  gap: 10px;
  padding: 12px;
  border-bottom: 1px solid #f1f1f1;
  align-items: center;
}

.listItem:last-child {
  border-bottom: none;
}

.idx {
  width: 50px;
  color: #666;
  font-size: 13px;
}

.title {
  flex: 1;
  font-size: 14px;
}

.empty {
  color: #777;
  font-size: 13px;
  padding: 8px 0;
}
</style>
