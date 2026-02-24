import { createRouter, createWebHistory } from 'vue-router'
import Board from '@/views/Board.vue'
import BoardDetail from '@/views/BoardDetail.vue'
import Signup from '@/views/Signup.vue'

const routes = [
  {
    path: '/',
    name: 'Board',
    component: Board,
  },
  { path: '/board/:idx', name: 'BoardDetail', component: BoardDetail },
  { path: '/signup', name: 'Signup', component: Signup },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
