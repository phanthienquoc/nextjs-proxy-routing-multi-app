import { defineStore } from 'pinia';

export type ChatMessage = {
  id: string;
  author: string;
  body: string;
  timestamp: number;
};

export type PresenceMember = {
  id: string;
  name: string;
  active: boolean;
};

const randomId = () => Math.random().toString(36).slice(2, 11);

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [] as ChatMessage[],
    presence: [] as PresenceMember[]
  }),
  getters: {
    sortedMessages(state) {
      return [...state.messages].sort((a, b) => a.timestamp - b.timestamp);
    },
    onlineMembers(state) {
      return state.presence.filter((member) => member.active);
    }
  },
  actions: {
    bootstrap() {
      if (this.messages.length > 0) {
        return;
      }

      const now = Date.now();
      this.messages = [
        {
          id: randomId(),
          author: 'Alex',
          body: 'Hey crew! Checking in from the chat micro frontend.',
          timestamp: now - 1000 * 60 * 4
        },
        {
          id: randomId(),
          author: 'Casey',
          body: 'Proxy is working — served seamlessly through the Next.js host.',
          timestamp: now - 1000 * 60 * 2
        }
      ];

      this.presence = [
        { id: randomId(), name: 'Alex', active: true },
        { id: randomId(), name: 'Casey', active: true },
        { id: randomId(), name: 'Drew', active: false }
      ];
    },
    sendMessage(author: string, body: string) {
      this.messages.push({
        id: randomId(),
        author,
        body,
        timestamp: Date.now()
      });
    },
    toggleMember(id: string) {
      const member = this.presence.find((item) => item.id === id);
      if (!member) {
        return;
      }
      member.active = !member.active;
    }
  }
});
