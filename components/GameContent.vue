<template>
  <div class="game-content">
    <div v-if="checkLuck || checkCharisma || isGameOver" class="game-indicators mb-3">
      <v-chip v-if="checkLuck" color="green" size="small" class="mr-2">
        <v-icon size="small" class="mr-1">mdi-clover</v-icon>
        Проверка УДАЧИ
      </v-chip>
      <v-chip v-if="checkCharisma" color="purple" size="small" class="mr-2">
        <v-icon size="small" class="mr-1">mdi-account-heart</v-icon>
        Проверка ОБАЯНИЯ
      </v-chip>
      <v-chip v-if="isGameOver" color="red" size="large" class="font-weight-bold">
        <v-icon size="small" class="mr-1">mdi-flag-checkered</v-icon>
        КОНЕЦ ИГРЫ
      </v-chip>
    </div>

    <ClientOnly>
      <ToastuiEditorViewer
        ref="toastuiEditor"
        :initial-value="content"
        @load="onEditorLoad"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
interface Props {
  page: string
  character?: any
  isCharacterCreated?: boolean
}

interface Emits {
  (e: 'change-page', page: string): void
  (e: 'test-charisma'): void
  (e: 'check-luck'): void
  (e: 'use-food'): void
}

const emit = defineEmits<Emits>()
const props = defineProps<Props>()
const toastuiEditor = ref()
const content = ref('')
const checkLuck = ref(false);
const checkCharisma = ref(false);
const isGameOver = ref(false);

const onEditorLoad = (editor: any) => {
  // console.log('Editor loaded', editor.preview.getHTML())
  editor.preview.previewContent.addEventListener('click', handleClick)

  // Store editor instance if needed
  toastuiEditor.value = editor
}


const handleClick = (event: MouseEvent) => {
  if (toastuiEditor.value) {
    const target = event.target as HTMLElement
    const link = target.closest('a')
    // if (link && toastuiEditor.value.preview.getHTML().contains(link)) {
    if (link) {
      event.preventDefault()
      const href = link.getAttribute('href')
      if (href) {
        // Extract page ID from href (e.g., "001", "#n_89", etc.)
        const pageId = href.replace('#n_', '').replace('#', '')
        emit('change-page', pageId)
      }
    }
  }
}


// Initial data fetch
const fetchContent = async (page: string) => {
  const { data } = await useFetch(`/api/content/${page}`)

  if (data.value) {
    // Handle new API response format
    if (typeof data.value === 'object') {
      content.value = data.value.content || ''
      isGameOver.value = data.value.isGameOver && props.isCharacterCreated
    } else {
      // Fallback for old string response
      content.value = data.value || ''
      isGameOver.value = false
    }
  } else {
    content.value = ''
    isGameOver.value = false
  }

  checkLuck.value = content.value.includes('ПРОВЕРЬТЕ СВОЮ УДАЧУ')
  checkCharisma.value = content.value.includes('Проверьте свое ОБАЯНИЕ')
}

// Watch for page prop changes
watch(() => props.page, async (newPage) => {
  await fetchContent(newPage)
}, { immediate: true })
</script>

<style scoped>
.game-content {
  max-width: 900px;
  margin: 2rem auto;
  padding: 3rem;
  background: var(--parchment-bg);
  border-radius: 12px;
  box-shadow: 
    0 8px 32px var(--parchment-shadow),
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    0 0 0 1px var(--aged-border);
  position: relative;
  overflow: hidden;
}

.game-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(139, 129, 108, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(139, 129, 108, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(139, 129, 108, 0.03) 0%, transparent 50%);
  pointer-events: none;
}

.game-content > * {
  position: relative;
  z-index: 1;
}

.game-indicators {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(212, 197, 169, 0.2);
  border-radius: 8px;
  border: 1px solid var(--aged-border);
}

/* Enhanced ToastuiEditor styling for book look */
:deep(.toastui-editor-contents) {
  font-family: var(--fantasy-font-body) !important;
  font-size: 1.1rem !important;
  line-height: 1.8 !important;
  color: var(--ink-color) !important;
  text-align: justify;
  hyphens: auto;
}

:deep(.toastui-editor-contents h1),
:deep(.toastui-editor-contents h2),
:deep(.toastui-editor-contents h3),
:deep(.toastui-editor-contents h4),
:deep(.toastui-editor-contents h5),
:deep(.toastui-editor-contents h6) {
  font-family: var(--fantasy-font-headers) !important;
  font-weight: 500 !important;
  letter-spacing: 0.5px !important;
  color: var(--ink-color) !important;
  margin-top: 2rem !important;
  margin-bottom: 1rem !important;
  text-align: center;
}

:deep(.toastui-editor-contents h1) { 
  font-size: 2.2rem !important; 
  border-bottom: 2px solid var(--aged-border);
  padding-bottom: 0.5rem;
}

:deep(.toastui-editor-contents h2) { 
  font-size: 1.8rem !important; 
}

:deep(.toastui-editor-contents h3) { 
  font-size: 1.4rem !important; 
}

:deep(.toastui-editor-contents p) {
  font-size: 1.1rem !important;
  margin-bottom: 1.5rem !important;
  text-indent: 2rem;
  text-align: justify;
  hyphens: auto;
}

:deep(.toastui-editor-contents p:first-of-type) {
  text-indent: 0;
  font-size: 1.2rem !important;
  font-weight: 500;
  margin-bottom: 2rem !important;
}

:deep(.toastui-editor-contents a) {
  color: #8B4513 !important;
  text-decoration: underline !important;
  font-weight: 600 !important;
  font-family: var(--fantasy-font-headers) !important;
  font-size: 1.1rem !important;
  padding: 2px 4px;
  border-radius: 3px;
  transition: all 0.3s ease;
  background: rgba(139, 69, 19, 0.05);
}

:deep(.toastui-editor-contents a:hover) {
  color: #A0522D !important;
  background: rgba(139, 69, 19, 0.15);
  text-shadow: 0 1px 2px rgba(139, 69, 19, 0.3);
  transform: translateY(-1px);
}

:deep(.toastui-editor-contents strong),
:deep(.toastui-editor-contents b) {
  font-weight: 600 !important;
  color: var(--ink-color) !important;
  font-family: var(--fantasy-font-headers) !important;
}

:deep(.toastui-editor-contents blockquote) {
  border-left: 4px solid var(--aged-border) !important;
  padding-left: 1.5rem !important;
  margin: 2rem 0 !important;
  font-style: italic !important;
  background: rgba(212, 197, 169, 0.15) !important;
  border-radius: 0 8px 8px 0 !important;
  padding: 1rem 1.5rem !important;
}

:deep(.toastui-editor-contents ul),
:deep(.toastui-editor-contents ol) {
  margin: 1.5rem 0 !important;
  padding-left: 2rem !important;
}

:deep(.toastui-editor-contents li) {
  margin-bottom: 0.8rem !important;
  line-height: 1.6 !important;
}

@media (max-width: 768px) {
  .game-content {
    margin: 1rem;
    padding: 1.5rem;
    border-radius: 8px;
  }
  
  :deep(.toastui-editor-contents h1) { 
    font-size: 1.8rem !important; 
  }
  
  :deep(.toastui-editor-contents h2) { 
    font-size: 1.5rem !important; 
  }
  
  :deep(.toastui-editor-contents p) {
    text-indent: 1rem;
    font-size: 1rem !important;
  }
}

@media (max-width: 480px) {
  .game-content {
    margin: 0.5rem;
    padding: 1rem;
  }
  
  :deep(.toastui-editor-contents p) {
    text-indent: 0;
  }
}
</style>