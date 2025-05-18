const editorEvents = [
  'load',
  'change',
  'caretChange',
  'focus',
  'blur',
  'keydown',
  'keyup',
  'beforePreviewRender',
  'beforeConvertWysiwygToMarkdown',
];

const defaultValueMap = {
  initialEditType: 'markdown',
  initialValue: '',
  height: '300px',
  previewStyle: 'vertical',
};

export const optionsMixin = {
  data() {
    const eventOptions = {};

    editorEvents.forEach((event) => {
      eventOptions[event] = (...args) => {
        this.$emit(event, ...args);
      };
    });

    const options = {
      ...this.options,
      initialEditType: this.initialEditType,
      initialValue: this.initialValue,
      height: this.height,
      previewStyle: this.previewStyle,
      events: eventOptions,
    };

    Object.keys(defaultValueMap).forEach((key) => {
      if (!options[key]) {
        options[key] = defaultValueMap[key];
      }
    });

    return { editor: null, computedOptions: options };
  },

  methods: {
    invoke(methodName, ...args) {
      if (!this.editor) {
        console.warn('Editor is not initialized');
        return null;
      }

      if (typeof this.editor[methodName] !== 'function') {
        console.warn(`Method ${methodName} is not available`);
        return null;
      }

      return this.editor[methodName](...args);
    }
  },

  beforeDestroy() {
    if (this.editor) {
      editorEvents.forEach((event) => {
        this.editor.off(event);
      });
      this.editor.destroy();
    }
  }
};
