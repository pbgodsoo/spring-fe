import { createRouter, createWebHistory } from 'vue-router'
import Board from '@/views/Board.vue'
import BoardDetail from '@/views/BoardDetail.vue'

const routes = [
  {
    path: '/',
    name: 'Board',
    component: Board,
  },
  { path: '/board/:idx', name: 'BoardDetail', component: BoardDetail },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
