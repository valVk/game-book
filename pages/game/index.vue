<template>
  <ToastuiEditorViewer
    ref="toastuiEditor"
    :initial-value="content"
    @load="onEditorLoad"
  />
  <p>checkLuck: {{ checkLuck }}</p>
  <p>checkCharisma: {{ checkCharisma }}</p>
</template>

<script setup lang="ts">
const emit = defineEmits(['change-page'])
const props = defineProps(['page'])
const toastuiEditor = ref()
const content = ref('')
const checkLuck = ref(false);
const checkCharisma = ref(false);

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
  const { data } = await useFetch(`/api/content/${page}`)
  content.value = data.value || ''
  checkLuck.value = content.value.includes('ПРОВЕРЬТЕ СВОЮ УДАЧУ')
  checkCharisma.value = content.value.includes('Проверьте свое ОБАЯНИЕ')
}

// Watch for page prop changes
watch(() => props.page, async (newPage) => {
  await fetchContent(newPage)
}, { immediate: true })
</script>