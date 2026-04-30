import { createRouter, createWebHistory } from 'vue-router'
import Welcome from './views/Welcome.vue'
import UserView from './views/UserView.vue'
import ListingView from './views/ListingView.vue'
import ConsultantView from './views/ConsultantView.vue'
import Login from './views/login.vue'
import Signup from './views/Signup.vue'
import TransactionView from './views/TransactionView.vue'

const routes = [
  { path: '/', name: 'Welcome', component: Welcome },
  { path: '/login', name: 'Login', component: Login },
  { path: '/signup', name: 'Signup', component: Signup },

  { path: '/users', name: 'Users', component: UserView },
  { path: '/listings', name: 'Listings', component: ListingView },
  { path: '/consultants', name: 'Consultants', component: ConsultantView },
  { path: '/transaction', name: 'Transaction', component: TransactionView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router