// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['vuetify-nuxt-module', '@pinia/nuxt'],
  plugins: [
    '~/plugins/tui-editor/tui-editor.client',
  ],
  vuetify: {
    moduleOptions: {
      /* module specific options */
    },
    vuetifyOptions: {
      theme: {
        defaultTheme: 'fantasy',
        themes: {
          fantasy: {
            dark: false,
            colors: {
              primary: '#8B4513',
              secondary: '#A0522D',
              accent: '#d4c5a9',
              error: '#f44336',
              warning: '#ff9800',
              info: '#2196f3',
              success: '#4caf50',
              background: '#f4f1e8',
              surface: '#f4f1e8',
              'on-background': '#2d2926',
              'on-surface': '#2d2926',
              'on-primary': '#2d2926',
            }
          }
        }
      },
      defaults: {
        VCard: {
          color: 'surface',
        },
        VCardTitle: {
          class: 'fantasy-header'
        },
        VCardText: {
          class: 'fantasy-body'
        },
        VBtn: {
          class: 'fantasy-button'
        },
        VDialog: {
          class: 'fantasy-dialog'
        }
      },
      display: {
        mobileBreakpoint: 'sm',
        thresholds: {
          xs: 0,
          sm: 600,
          md: 960,
          lg: 1280,
          xl: 1920,
        },
      }
    }
  }
})