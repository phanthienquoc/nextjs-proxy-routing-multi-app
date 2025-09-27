<template>
  <div class="presence">
    <section>
      <h2>Team members</h2>
      <ul>
        <li v-for="member in members" :key="member.id">
          <span class="status" :data-active="member.active"></span>
          <span>{{ member.name }}</span>
          <button type="button" @click="chat.toggleMember(member.id)">
            {{ member.active ? 'Set to away' : 'Set to active' }}
          </button>
        </li>
      </ul>
      <p class="hint">
        Presence data lives entirely within this Vue micro frontend, but is exposed under the shared origin provided by the
        Next.js host proxy.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useChatStore } from '../stores/chat';

const chat = useChatStore();

const members = computed(() => chat.presence);

onMounted(() => {
  chat.bootstrap();
});
</script>
