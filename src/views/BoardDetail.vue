<template>
  <div class="container">
    <div class="top">
      <h1>게시글 상세</h1>

      <div class="actions">
        <button class="button outline" v-if="!loading && !errMsg" @click="toggleEdit">
          {{ editMode ? '수정 취소' : '수정' }}
        </button>

        <button
          class="button danger"
          v-if="!loading && !errMsg"
          @click="remove"
          :disabled="loadingDelete"
        >
          {{ loadingDelete ? '삭제중...' : '삭제' }}
        </button>

        <button class="button outline" @click="goBack">뒤로</button>
      </div>
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
        <input v-if="editMode" v-model="editTitle" class="input" placeholder="제목" />

        <span v-else>{{ detail.title }}</span>
      </div>

      <div class="row col">
        <span class="label">내용</span>

        <textarea v-if="editMode" v-model="editContents" class="textarea" placeholder="내용" />

        <pre v-else class="contents">{{ detail.contents }}</pre>
      </div>

      <div v-if="editMode" class="editActions">
        <button class="button" @click="update" :disabled="loadingUpdate">
          {{ loadingUpdate ? '저장중...' : '저장' }}
        </button>

        <p v-if="editMsg" class="msg">{{ editMsg }}</p>
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

const editMode = ref(false)

const editTitle = ref('')
const editContents = ref('')

const loadingUpdate = ref(false)
const loadingDelete = ref(false)

const editMsg = ref('')

async function fetchDetail() {
  loading.value = true
  errMsg.value = ''

  try {
    const idx = route.params.idx
    const res = await api.get(`/board/${idx}`)
    detail.value = res.data

    editTitle.value = detail.value.title || ''
    editContents.value = detail.value.contents || ''
  } catch (e) {
    errMsg.value = e?.response?.data?.message || '상세 조회 실패'
    console.error(e)
  } finally {
    loading.value = false
  }
}

function toggleEdit() {
  editMsg.value = ''
  editMode.value = !editMode.value

  if (!editMode.value) {
    editTitle.value = detail.value.title || ''
    editContents.value = detail.value.contents || ''
  }
}

async function update() {
  editMsg.value = ''

  if (!editTitle.value.trim() || !editContents.value.trim()) {
    editMsg.value = '제목/내용을 입력하세요.'
    return
  }

  loadingUpdate.value = true

  try {
    const idx = route.params.idx

    const payload = {
      title: editTitle.value,
      contents: editContents.value,
    }

    await api.put(`/board/${idx}`, payload)

    editMsg.value = '수정 완료'

    await fetchDetail()

    editMode.value = false
  } catch (e) {
    editMsg.value = e?.response?.data?.message || '수정 실패'
    console.error(e)
  } finally {
    loadingUpdate.value = false
  }
}

async function remove() {
  const ok = confirm('정말 삭제할까요?')
  if (!ok) return

  loadingDelete.value = true

  try {
    const idx = route.params.idx

    await api.delete(`/board/${idx}`)

    router.push('/')
  } catch (e) {
    alert(e?.response?.data?.message || '삭제 실패')
    console.error(e)
  } finally {
    loadingDelete.value = false
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

.actions {
  display: flex;
  gap: 8px;
  align-items: center;
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

.button.danger {
  border-color: #f2b8b5;
}

.input,
.textarea {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
}

.textarea {
  min-height: 140px;
  resize: none;
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

.editActions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
}
</style>
