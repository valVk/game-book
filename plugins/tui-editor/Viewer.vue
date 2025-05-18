<template>
  <div ref="toastuiEditor"></div>
</template>
<script>
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';
import { optionsMixin } from './mixin/option';

export default {
  name: 'ToastuiEditorViewer',
  mixins: [optionsMixin],
  props: {
    height: {
      type: String,
    },
    initialValue: {
      type: String,
    },
    options: {
      type: Object,
    },
  },
  watch: {
    initialValue(newValue) {
      if (this.editor) {
        this.editor.setMarkdown(newValue);
      }
    }
  },
  mounted() {
    const options = { ...this.computedOptions, el: this.$refs.toastuiEditor };
    this.editor = new Viewer(options);

    // Emit load event after initialization
    this.$nextTick(() => {
      if (this.editor) {
        this.$emit('load', this.editor);
      }
    });
  },
  methods: {
    getRootElement() {
      return this.$refs.toastuiEditor;
    },
  },
};
</script>
