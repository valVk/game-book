import Editor from './Editor.vue';
import Viewer from './Viewer.vue';
import '@toast-ui/editor/dist/i18n/uk-ua';

import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';

/**
 * https://github.com/nhn/tui.editor/tree/0c5c11bac0b9954e2cac2ff2a081ce8c80a5f14d/apps/vue-editor
 * https://nhn.github.io/tui.editor/latest/tutorial-example03-editor-with-wysiwyg-mode
 * https://codesandbox.io/s/onchange-tuieditor-v4ngb?file=/src/App.vue
 */

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component(Editor.name!, {
    extends: Editor,
    props: {
      options: {
        type: Object,
        default: () => ({
          minHeight: '200px',
          language: 'uk',
          useCommandShortcut: true,
          usageStatistics: false,
          hideModeSwitch: true,
          autofocus:false,
          toolbarItems: [
            ['heading', 'bold', 'italic', 'strike'],
            ['quote', 'ul', 'ol', 'indent', 'outdent'],
          ]
        })
      }
    }
  });

  nuxtApp.vueApp.component(Viewer.name!, Viewer);
});
