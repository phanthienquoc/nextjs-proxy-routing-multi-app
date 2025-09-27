<template>
  <div class="conversation">
    <section class="conversation__messages">
      <article v-for="message in messages" :key="message.id" class="conversation__message">
        <header>
          <strong>{{ message.author }}</strong>
          <time>{{ new Date(message.timestamp).toLocaleTimeString() }}</time>
        </header>
        <p>{{ message.body }}</p>
      </article>
    </section>
    <form class="composer" @submit.prevent="handleSubmit">
      <label>
        <span>Display name</span>
        <input v-model="author" placeholder="You" required />
      </label>
      <label>
        <span>Message</span>
        <textarea v-model="body" rows="3" placeholder="Say hello…" required />
      </label>
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useChatStore } from '../stores/chat';

const chat = useChatStore();
const { sortedMessages: messages } = storeToRefs(chat);

const author = ref('You');
const body = ref('');

onMounted(() => {
  chat.bootstrap();
});

function handleSubmit() {
  if (!body.value.trim()) {
    return;
  }

  chat.sendMessage(author.value.trim(), body.value.trim());
  body.value = '';
}
</script>
