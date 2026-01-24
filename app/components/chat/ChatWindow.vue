<!-- frontend/components/ChatWindow.vue -->
<template>
  <div class="flex flex-col h-screen max-h-[600px] bg-white rounded-lg shadow-lg">
    <!-- Header -->
    <div class="flex items-center gap-3 p-4 border-b">
      <img :src="otherUser.avatar" class="w-10 h-10 rounded-full" />
      <div class="flex-1">
        <div class="font-semibold">{{ otherUser.name }}</div>
        <div class="text-sm text-gray-500">
          <span v-if="isOnline" class="text-green-500">●</span>
          {{ isOnline ? '在线' : '离线' }}
        </div>
      </div>
    </div>

    <!-- Messages -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
      <div
          v-for="msg in messages"
          :key="msg.id"
          class="flex"
          :class="msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'"
      >
        <div
            class="max-w-[70%] rounded-lg p-3"
            :class="
            msg.sender_id === currentUserId
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-800'
          "
        >
          <div v-if="msg.message_type === 'text'">{{ msg.content }}</div>
          <img v-else-if="msg.message_type === 'image'" :src="msg.attachment_url" class="max-w-full rounded" />
          <div class="text-xs opacity-70 mt-1">
            {{ formatTime(msg.created_at) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Input -->
    <div class="border-t p-4">
      <div class="flex gap-2">
        <button @click="chooseImage" class="p-2 hover:bg-gray-100 rounded">
          <IconPhoto class="w-6 h-6" />
        </button>
        <input
            v-model="newMessage"
            @keyup.enter="sendMessage"
            placeholder="输入消息..."
            class="flex-1 border rounded-lg px-4 py-2"
        />
        <button @click="sendMessage" class="bg-purple-600 text-white px-6 py-2 rounded-lg">
          发送
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSocket } from '~/composables/useSocket'

const props = defineProps<{
  conversationId: string
  otherUser: any
}>()

const socket = useSocket()
const currentUserId = useCurrentUser().id
const messages = ref([])
const newMessage = ref('')
const isOnline = ref(false)

onMounted(() => {
  loadMessages()
  socket.emit('join', currentUserId)

  socket.on('new_message', (msg) => {
    if (msg.conversation_id === props.conversationId) {
      messages.value.push(msg)
      scrollToBottom()
    }
  })
})

const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  socket.emit('send_message', {
    conversationId: props.conversationId,
    senderId: currentUserId,
    receiverId: props.otherUser.id,
    content: newMessage.value,
    messageType: 'text',
  })

  newMessage.value = ''
}

const loadMessages = async () => {
  const { data } = await useFetch(`/api/conversations/${props.conversationId}/messages`)
  messages.value = data.value || []
  scrollToBottom()
}
</script>