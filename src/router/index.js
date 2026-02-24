import { createRouter, createWebHistory } from 'vue-router'
import Board from '@/views/Board.vue'
import BoardDetail from '@/views/BoardDetail.vue'
import Signup from '@/views/Signup.vue'
import Login from '@/views/Login.vue'

const routes = [
  {
    path: '/board',
    name: 'Board',
    component: Board,
  },
  { path: '/board/:idx', name: 'BoardDetail', component: BoardDetail },
  { path: '/signup', name: 'Signup', component: Signup },
  { path: '/', name: 'Login', component: Login },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
