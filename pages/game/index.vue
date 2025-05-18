<template>
  <ToastuiEditorViewer
    ref="toastuiEditor"
    :initial-value="data"
    @load="onEditorLoad"
    @change="onEditorChange"
  />
</template>

<script setup lang="ts">
const emit = defineEmits(['change-page'])
const props = defineProps(['page'])
const toastuiEditor = ref()
const data = ref('')

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
      emit('change-page', link.innerText)
    }
  }
}

// Initial data fetch
const fetchContent = async (page: string) => {
  const { data: content } = await useFetch(`/api/content/${page}`)
  data.value = content.value || ''
}

// Watch for page prop changes
watch(() => props.page, async (newPage) => {
  await fetchContent(newPage)
}, { immediate: true })
</script>