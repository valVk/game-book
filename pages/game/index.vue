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
  max-width: 800px;
  margin: 0 auto;
  padding: 16px;
}

.game-indicators {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

@media (max-width: 768px) {
  .game-content {
    padding: 8px;
  }
}
</style>