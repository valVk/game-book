<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap');

:root {
  --fantasy-font-headers: 'Cormorant Garamond', 'Cinzel', serif;
  --fantasy-font-body: 'Crimson Text', serif;
  --parchment-bg: #f4f1e8;
  --parchment-shadow: rgba(139, 129, 108, 0.2);
  --ink-color: #2d2926;
  --aged-border: #d4c5a9;
}

body {
  background: linear-gradient(135deg, #f4f1e8 0%, #ede8d9 100%);
  min-height: 100vh;
  font-family: var(--fantasy-font-body);
  color: var(--ink-color);
  line-height: 1.7;
}

/* Global typography for fantasy book feel */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--fantasy-font-headers);
  font-weight: 500;
  letter-spacing: 0.5px;
  color: var(--ink-color);
}

h1 { font-size: 2.5rem; margin-bottom: 1.5rem; }
h2 { font-size: 2rem; margin-bottom: 1.25rem; }
h3 { font-size: 1.5rem; margin-bottom: 1rem; }

p {
  font-size: 1.1rem;
  margin-bottom: 1.2rem;
  text-align: justify;
  hyphens: auto;
}

/* Paper book container styling */
.v-application {
  background: transparent;
}

/* Fantasy theme classes for Vuetify components */
.fantasy-header {
  font-family: var(--fantasy-font-headers);
  color: var(--ink-color);
  letter-spacing: 0.5px;
}

.fantasy-body {
  font-family: var(--fantasy-font-body);
  color: var(--ink-color);
}

.fantasy-body * {
  font-family: var(--fantasy-font-body);
  color: var(--ink-color);
}

.fantasy-button {
  font-family: var(--fantasy-font-headers);
  font-weight: 500;
  letter-spacing: 0.3px;
  text-transform: none;
}

.fantasy-dialog {
  background: var(--parchment-bg);
  border: 2px solid var(--aged-border);
  border-radius: 16px;
}

/* Override Vuetify typography classes to use fantasy fonts */
.text-h1, .text-h2, .text-h3, .text-h4, .text-h5, .text-h6 {
  font-family: var(--fantasy-font-headers) !important;
  color: var(--ink-color) !important;
}

.text-body-1, .text-body-2, .text-caption, .text-subtitle-1, .text-subtitle-2 {
  font-family: var(--fantasy-font-body) !important;
  color: var(--ink-color) !important;
}

/* Links styling for book navigation */
a {
  color: #8B4513;
  text-decoration: underline;
  font-weight: 600;
  transition: color 0.3s ease;
}

a:hover {
  color: #A0522D;
  text-shadow: 0 1px 2px rgba(139, 69, 19, 0.3);
}

/* Strong text styling */
strong, b {
  font-weight: 600;
  color: #2d2926;
}

/* Blockquote styling for special text */
blockquote {
  border-left: 4px solid var(--aged-border);
  padding-left: 1.5rem;
  margin: 1.5rem 0;
  font-style: italic;
  background: rgba(212, 197, 169, 0.1);
  border-radius: 0 8px 8px 0;
}
</style>
