<template>
  <div>
    <transition name="chat-bar">
      <div v-if="isOpen" class="chat-panel">
        <div class="chat-header">
          <div class="header-left">
            <div class="ai-avatar">
              <span class="ai-dot"></span>
              <v-icon size="18" color="white">mdi-robot-excited</v-icon>
            </div>

            <div>
              <div class="header-title">Touskie AI</div>
              <div class="header-sub">
                {{ isTyping ? 'Thinking...' : 'Online · Ready to help' }}
              </div>
            </div>
          </div>

          <div class="header-right">
            <v-btn icon size="x-small" variant="text" color="white" @click="clearChat">
              <v-icon size="16">mdi-refresh</v-icon>
            </v-btn>

            <v-btn icon size="x-small" variant="text" color="white" @click="isOpen = false">
              <v-icon size="18">mdi-chevron-down</v-icon>
            </v-btn>
          </div>
        </div>

        <div class="chat-messages" ref="messagesEl">
          <div
            v-for="(msg, i) in messages"
            :key="i"
            :class="['msg-row', msg.role === 'user' ? 'msg-user' : 'msg-ai']"
          >
            <div v-if="msg.role === 'assistant'" class="msg-avatar">
              <v-icon size="14" color="#f97316">mdi-robot-excited</v-icon>
            </div>

            <div class="msg-bubble" v-html="formatMessage(msg.content)"></div>
          </div>

          <div v-if="isTyping" class="msg-row msg-ai">
            <div class="msg-avatar">
              <v-icon size="14" color="#f97316">mdi-robot-excited</v-icon>
            </div>

            <div class="msg-bubble typing-bubble">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        <div v-if="messages.length <= 1" class="quick-chips">
          <button
            v-for="q in quickQuestions"
            :key="q"
            class="chip"
            @click="sendQuick(q)"
          >
            {{ q }}
          </button>
        </div>

        <div class="chat-input-row">
          <input
            v-model="input"
            class="chat-input"
            placeholder="Ask about listings, pricing, renting..."
            :disabled="isTyping"
            @keyup.enter="send"
          />

          <button
            class="send-btn"
            :disabled="!input.trim() || isTyping"
            @click="send"
          >
            <v-icon size="18" color="white">mdi-send</v-icon>
          </button>
        </div>
      </div>
    </transition>

    <button
      class="fab"
      aria-label="Open chatbot"
      title="Open chatbot"
      @click="toggleChat"
    >
      <transition name="icon-swap" mode="out-in">
        <v-icon v-if="!isOpen" key="open" color="white" size="24">
          mdi-robot-excited
        </v-icon>

        <v-icon v-else key="close" color="white" size="22">
          mdi-close
        </v-icon>
      </transition>

      <span v-if="!isOpen && unread > 0" class="fab-badge">
        {{ unread }}
      </span>
    </button>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || ''
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const OPEN_AI_CHATBOT_KEY = 'touskie_open_ai_chatbot'

const isOpen = ref(false)
const isTyping = ref(false)
const input = ref('')
const messages = ref([])
const unread = ref(0)
const messagesEl = ref(null)

const SYSTEM_PROMPT = `You are Touskie AI, a helpful assistant for the Touskie B2B marketplace platform.
Your job is to help users:
- Find the right industrial listings (agriculture, solar, logistics, steel, hydrogen, data centers, warehousing, consulting)
- Decide whether to buy or rent/lease industrial assets
- Understand pricing factors and what affects value
- Connect with the right consultants for their specific sector
- Navigate the purchase or rental process step by step

Personality: Professional, concise, friendly. Use bullet points for comparisons.
When recommending, ask one clarifying question to understand the user's budget or sector better.
Keep answers under 120 words unless the user asks for more detail.
Never invent specific prices — say "contact the seller for an exact quote" instead.`

const quickQuestions = [
  'Should I buy or rent?',
  'How does purchasing work?',
  'Which sector suits me?',
  'Find me a consultant'
]

const openChat = async () => {
  isOpen.value = true
  unread.value = 0
  localStorage.removeItem(OPEN_AI_CHATBOT_KEY)
  await scrollDown()
}

const toggleChat = () => {
  isOpen.value = !isOpen.value

  if (isOpen.value) {
    unread.value = 0
    scrollDown()
  }
}

const handleOpenChatbotEvent = () => {
  openChat()
}

onMounted(() => {
  messages.value.push({
    role: 'assistant',
    content: "Hi! I'm **Touskie AI** 👋\n\nI can help you find the right listing, decide between buying or renting, and connect you with the best consultant for your sector.\n\nWhat are you looking for today?"
  })

  window.addEventListener('open-touskie-ai-chatbot', handleOpenChatbotEvent)

  if (localStorage.getItem(OPEN_AI_CHATBOT_KEY) === 'true') {
    setTimeout(() => {
      openChat()
    }, 300)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('open-touskie-ai-chatbot', handleOpenChatbotEvent)
})

const send = async () => {
  const text = input.value.trim()

  if (!text || isTyping.value) return

  messages.value.push({
    role: 'user',
    content: text
  })

  input.value = ''
  isTyping.value = true

  await scrollDown()

  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: 400,
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          ...messages.value.map(m => ({
            role: m.role,
            content: m.content
          }))
        ]
      })
    })

    const data = await res.json()

    if (data.error) {
      throw new Error(data.error.message)
    }

    const reply = data.choices?.[0]?.message?.content

    if (!reply) {
      throw new Error('Empty response')
    }

    messages.value.push({
      role: 'assistant',
      content: reply
    })

    if (!isOpen.value) {
      unread.value++
    }
  } catch (e) {
    console.error('Groq error:', e)

    messages.value.push({
      role: 'assistant',
      content: `⚠️ Could not reach Groq. Check your VITE_GROQ_API_KEY in the .env file.\n\nError: ${e.message}`
    })
  } finally {
    isTyping.value = false
    await scrollDown()
  }
}

const sendQuick = q => {
  input.value = q
  send()
}

const clearChat = () => {
  messages.value = [
    {
      role: 'assistant',
      content: 'Chat cleared! What would you like to know about listings or consulting?'
    }
  ]

  unread.value = 0
}

const scrollDown = async () => {
  await nextTick()

  if (messagesEl.value) {
    messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  }
}

const formatMessage = text => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>')
    .replace(/^- (.+)/gm, '• $1')
}
</script>

<style scoped>
.fab {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 9999;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f97316, #ea580c);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(249, 115, 22, 0.5);
  transition: transform 0.2s, box-shadow 0.2s;
}

.fab:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 28px rgba(249, 115, 22, 0.6);
}

.fab-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: white;
  font-size: 11px;
  font-weight: 700;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-panel {
  position: fixed;
  bottom: 100px;
  right: 28px;
  z-index: 9998;
  width: 380px;
  max-height: 560px;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.07);
}

.chat-header {
  background: linear-gradient(135deg, #0a1628 0%, #1a3a6b 100%);
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ai-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(249, 115, 22, 0.2);
  border: 2px solid #f97316;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.ai-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #22c55e;
  border: 2px solid #0a1628;
}

.header-title {
  color: white;
  font-weight: 700;
  font-size: 14px;
}

.header-sub {
  color: rgba(255, 255, 255, 0.6);
  font-size: 11px;
  margin-top: 1px;
}

.header-right {
  display: flex;
  gap: 2px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px 14px;
  background: #f8f9fb;
  display: flex;
  flex-direction: column;
  gap: 10px;
  scroll-behavior: smooth;
}

.chat-messages::-webkit-scrollbar {
  width: 4px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 4px;
}

.msg-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.msg-user {
  flex-direction: row-reverse;
}

.msg-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #fff0e6;
  border: 1.5px solid #f97316;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.msg-bubble {
  max-width: 78%;
  padding: 10px 14px;
  border-radius: 18px;
  font-size: 13.5px;
  line-height: 1.5;
  word-break: break-word;
}

.msg-ai .msg-bubble {
  background: white;
  color: #1a1a2e;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.msg-user .msg-bubble {
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
  border-bottom-right-radius: 4px;
}

.typing-bubble {
  display: flex;
  gap: 5px;
  align-items: center;
  padding: 12px 16px;
}

.typing-bubble span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #f97316;
  animation: bounce 1.2s infinite;
}

.typing-bubble span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-bubble span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.4;
  }

  30% {
    transform: translateY(-6px);
    opacity: 1;
  }
}

.quick-chips {
  padding: 8px 14px 4px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  background: #f8f9fb;
  flex-shrink: 0;
}

.chip {
  background: white;
  border: 1.5px solid #f97316;
  color: #f97316;
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.chip:hover {
  background: #f97316;
  color: white;
}

.chat-input-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  background: white;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.chat-input {
  flex: 1;
  border: 1.5px solid #e8e8e8;
  border-radius: 24px;
  padding: 9px 16px;
  font-size: 13.5px;
  outline: none;
  transition: border 0.2s;
  color: #1a1a2e;
  background: #fafafa;
}

.chat-input:focus {
  border-color: #f97316;
  background: white;
}

.chat-input::placeholder {
  color: #aaa;
}

.send-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f97316, #ea580c);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.15s, opacity 0.15s;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.08);
}

.send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.chat-bar-enter-active,
.chat-bar-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.chat-bar-enter-from,
.chat-bar-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.icon-swap-enter-active,
.icon-swap-leave-active {
  transition: all 0.15s;
}

.icon-swap-enter-from {
  transform: rotate(-90deg);
  opacity: 0;
}

.icon-swap-leave-to {
  transform: rotate(90deg);
  opacity: 0;
}
</style>