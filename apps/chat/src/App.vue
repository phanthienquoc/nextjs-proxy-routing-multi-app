<template>
  <div class="shell">
    <header class="shell__header">
      <div class="shell__title-group">
        <h1>Team Chat</h1>
        <p>Vue 3 + Pinia micro frontend served via the host proxy at <code>/chat</code>.</p>
      </div>
      <nav>
        <RouterLink to="/" class="link">Conversation</RouterLink>
        <RouterLink to="/presence" class="link">Presence</RouterLink>
      </nav>
    </header>
    <main class="shell__content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts"></script>