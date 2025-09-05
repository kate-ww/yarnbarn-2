// Vue Router configuration
import { createRouter, createWebHistory } from 'vue-router'
import YarnList from '../views/YarnList.vue'
import YarnCreate from '../views/YarnCreate.vue'
import YarnEdit from '../views/YarnEdit.vue'

const routes = [
  {
    path: '/',
    name: 'YarnList',
    component: YarnList
  },
  {
    path: '/create',
    name: 'YarnCreate',
    component: YarnCreate
  },
  {
    path: '/edit/:id',
    name: 'YarnEdit',
    component: YarnEdit,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router