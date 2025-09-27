import { createRouter, createWebHistory } from 'vue-router';

const ConversationView = () => import('../views/ConversationView.vue');
const PresenceView = () => import('../views/PresenceView.vue');

const router = createRouter({
  history: createWebHistory('/chat'),
  routes: [
    {
      path: '/',
      name: 'conversation',
      component: ConversationView
    },
    {
      path: '/presence',
      name: 'presence',
      component: PresenceView
    }
  ]
});

export default router;
