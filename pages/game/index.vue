<template>
<ToastuiEditorViewer ref="toastuiEditor" :initial-value="data" @load="onEditorChange"/>
</template>
<script setup lang="ts">
const emit = defineEmits(['change'])
const props = defineProps(['page'])
const { data } = await useFetch(`/api/content/${props.page}.md`)
const toastuiEditor = ref()

const onEditorChange = () => {
  const markdown = toastuiEditor.value.invoke("getMarkdown");
  console.log('lalala')
  emit('change', markdown.replace('<br>', '\n'))
}
</script>