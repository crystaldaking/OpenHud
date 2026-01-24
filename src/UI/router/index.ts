import { createMemoryHistory, createRouter } from 'vue-router'

import PlayersView from '../views/PlayersView.vue'
import TeamsView from '../views/TeamsView.vue'

const routes = [
  { path: '/', component: PlayersView },
  { path: '/players', component: PlayersView },
  { path: '/teams', component: TeamsView },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})