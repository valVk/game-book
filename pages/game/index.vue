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
        :initial-value="typeof content === 'object' ? content.content : content"
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

// Character composable for dice roll management
const { checkLuck: rollLuck, setPendingRoll, getPendingRoll, clearPendingRoll } = useCharacter()

const onEditorLoad = (editor: any) => {
  // console.log('Editor loaded', editor.preview.getHTML())
  editor.preview.previewContent.addEventListener('click', handleClick)

  // Store editor instance if needed
  toastuiEditor.value = editor
  
  // Process dice roll sections after editor loads
  processEditorContent()
}


const handleClick = (event: MouseEvent) => {
  if (toastuiEditor.value) {
    const target = event.target as HTMLElement
    
    // Handle dice roll button clicks
    if (target.classList.contains('luck-roll-btn')) {
      event.preventDefault()
      handleLuckRoll()
      return
    }
    
    const link = target.closest('a')
    if (link) {
      event.preventDefault()
      const href = link.getAttribute('href')
      if (href) {
        // Check if this link is blocked by pending dice roll
        if (link.classList.contains('blocked-link')) {
          return // Don't navigate if link is blocked
        }
        
        // Extract page ID from href (e.g., "001", "#n_89", etc.)
        const pageId = href.replace('#n_', '').replace('#', '')
        emit('change-page', pageId)
      }
    }
  }
}

// Process editor content to add dice roll functionality
const processEditorContent = () => {
  if (!toastuiEditor.value) return
  
  const editorContent = toastuiEditor.value.preview.previewContent
  
  // Get dice roll metadata from server response (if available)
  let diceRollData = null
  if (typeof content.value === 'object' && content.value.diceRoll) {
    diceRollData = content.value.diceRoll
  }
  
  // Check if dice roll is required based on server metadata
  if (diceRollData?.required === 'luck' && diceRollData.successLink && diceRollData.failureLink) {
    const currentPageId = props.page
    let pendingRoll = getPendingRoll(currentPageId)
    const availableLuckPoints = getAvailableLuckPoints()
    
    // Only reset if there's no pending roll (first time on this page)
    // Don't reset if roll is already completed - preserve the result and styling
    if (!pendingRoll) {
      setPendingRoll(currentPageId, 'luck')
      pendingRoll = getPendingRoll(currentPageId)
    }
    
    // Check if player has no luck points available - auto-fail
    if (availableLuckPoints === 0) {
      // Set auto-fail result
      setPendingRoll(currentPageId, 'luck')
      
      // Update the pending roll with failure result
      if (character.value.pendingRolls) {
        character.value.pendingRolls[currentPageId] = {
          type: 'luck',
          result: false,
          timestamp: Date.now()
        }
      }
      
      // Show only failure link
      showResultBasedLinks(editorContent, diceRollData.successLink, diceRollData.failureLink, false)
      
      // Add auto-fail message
      addAutoFailMessage(editorContent)
      return
    }
    
    if (!pendingRoll || pendingRoll.result === undefined) {
      // Set pending roll if not already set
      if (!pendingRoll) {
        setPendingRoll(currentPageId, diceRollData.required)
      }
      
      // Block ALL navigation links initially and add dice roll button
      blockLinksAndAddDiceRoll(editorContent, diceRollData.successLink, diceRollData.failureLink)
    } else {
      // Roll completed, show appropriate link based on result
      showResultBasedLinks(editorContent, diceRollData.successLink, diceRollData.failureLink, pendingRoll.result)
    }
  }
}

// Add auto-fail message to the page
const addAutoFailMessage = (container: HTMLElement) => {
  const luckText = container.querySelector('p')
  if (luckText && luckText.textContent?.includes('ПРОВЕРЬТЕ СВОЮ УДАЧУ')) {
    const autoFailDiv = document.createElement('div')
    autoFailDiv.className = 'auto-fail-message'
    autoFailDiv.style.cssText = `
      text-align: center;
      margin: 1rem 0;
      padding: 1rem;
      background: rgba(125, 45, 26, 0.1);
      border: 2px solid #A0432F;
      border-radius: 8px;
      font-family: var(--fantasy-font-headers);
      font-weight: 600;
      color: #7D2D1A;
    `
    autoFailDiv.innerHTML = `
      <p>🎲 У вас не осталось очков удачи!</p>
      <p style="font-size: 1.1rem; margin-top: 0.5rem;">
        ❌ Удача автоматически не на вашей стороне!
      </p>
    `
    
    luckText.appendChild(autoFailDiv)
  }
}

// Block navigation links and add dice roll interface
const blockLinksAndAddDiceRoll = (container: HTMLElement, successLink: string, failureLink: string) => {
  // Find and block the luck-related links
  const links = container.querySelectorAll('a')
  links.forEach(link => {
    const href = link.getAttribute('href')
    if (href?.includes(`#n_${successLink}`) || href?.includes(`#n_${failureLink}`)) {
      // Make link look like regular text (disabled state)
      link.classList.add('blocked-link')
      link.style.cssText = `
        color: var(--ink-color) !important;
        text-decoration: none !important;
        pointer-events: none !important;
        cursor: text !important;
        font-weight: normal !important;
        background: none !important;
        font-family: var(--fantasy-font-body) !important;
        opacity: 1 !important;
      `
    }
  })
  
  // Find the luck check text and add dice roll button
  const luckText = container.querySelector('p')
  if (luckText && luckText.textContent?.includes('ПРОВЕРЬТЕ СВОЮ УДАЧУ')) {
    // Check if button already exists to prevent duplicates
    const existingButton = container.querySelector('.luck-roll-btn')
    if (existingButton) {
      return
    }
    
    const diceButton = document.createElement('button')
    diceButton.className = 'luck-roll-btn fantasy-button'
    diceButton.innerHTML = '🎲 Проверить удачу'
    diceButton.style.cssText = `
      display: block;
      margin: 1rem auto;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-family: var(--fantasy-font-headers);
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 8px rgba(139, 69, 19, 0.3);
    `
    
    luckText.appendChild(diceButton)
  }
}

// Show links based on dice roll result
const showResultBasedLinks = (container: HTMLElement, successLink: string, failureLink: string, success: boolean) => {
  const links = container.querySelectorAll('a')
  links.forEach(link => {
    const href = link.getAttribute('href')
    const isSuccessLink = href?.includes(`#n_${successLink}`)
    const isFailureLink = href?.includes(`#n_${failureLink}`)
    
    if ((success && isSuccessLink) || (!success && isFailureLink)) {
      // Show the appropriate link with paper-like styling
      link.classList.remove('blocked-link')
      const linkColor = success ? '#2D5016' : '#7D2D1A' // Dark green or dark red for paper effect
      const bgColor = success ? 'rgba(45, 80, 22, 0.1)' : 'rgba(125, 45, 26, 0.1)'
      const borderColor = success ? '#4A6B2F' : '#A0432F'
      
      link.style.cssText = `
        color: ${linkColor} !important;
        text-decoration: underline !important;
        pointer-events: auto !important;
        cursor: pointer !important;
        font-weight: 600 !important;
        font-family: var(--fantasy-font-headers) !important;
        background: ${bgColor} !important;
        padding: 2px 6px !important;
        border-radius: 4px !important;
        border: 1px solid ${borderColor} !important;
        box-shadow: 0 2px 4px rgba(139, 129, 108, 0.2) !important;
        transition: all 0.3s ease !important;
      `
      
      // Add hover effect
      link.addEventListener('mouseenter', () => {
        link.style.background = success ? 'rgba(45, 80, 22, 0.2)' : 'rgba(125, 45, 26, 0.2)'
        link.style.transform = 'translateY(-1px)'
      })
      
      link.addEventListener('mouseleave', () => {
        link.style.background = bgColor
        link.style.transform = 'translateY(0)'
      })
    } else if (isSuccessLink || isFailureLink) {
      // Keep other link as disabled text (don't hide it)
      link.style.cssText = `
        color: var(--ink-color) !important;
        text-decoration: none !important;
        pointer-events: none !important;
        cursor: text !important;
        font-weight: normal !important;
        background: none !important;
        font-family: var(--fantasy-font-body) !important;
        opacity: 0.5 !important;
      `
    }
  })
  
  // Remove dice roll button if it exists
  const diceButton = container.querySelector('.luck-roll-btn')
  if (diceButton) {
    diceButton.remove()
  }
}

// Handle luck roll button click
const handleLuckRoll = () => {
  const currentPageId = props.page
  const result = rollLuck(currentPageId)
  
  // Emit the luck check event for character sheet updates
  emit('check-luck')
  
  // Reprocess content to show result
  processEditorContent()
  
  // Show result message
  const editorContent = toastuiEditor.value.preview.previewContent
  const resultDiv = document.createElement('div')
  resultDiv.className = 'dice-result'
  resultDiv.style.cssText = `
    text-align: center;
    margin: 1rem 0;
    padding: 1rem;
    background: ${result.lucky ? 'rgba(34, 139, 34, 0.1)' : 'rgba(178, 34, 34, 0.1)'};
    border: 2px solid ${result.lucky ? '#228B22' : '#B22222'};
    border-radius: 8px;
    font-family: var(--fantasy-font-headers);
    font-weight: 600;
  `
  resultDiv.innerHTML = `
    <p>🎲 Выпало: ${result.roll}</p>
    <p style="font-size: 1.2rem; margin-top: 0.5rem;">
      ${result.lucky ? '✅ Удача на вашей стороне!' : '❌ Удача отвернулась от вас!'}
    </p>
  `
  
  const luckText = editorContent.querySelector('p')
  if (luckText) {
    luckText.appendChild(resultDiv)
  }
}


// Initial data fetch
const fetchContent = async (page: string) => {
  const { data } = await useFetch(`/api/content/${page}`)

  if (data.value) {
    // Handle new API response format
    if (typeof data.value === 'object') {
      content.value = data.value // Store entire object for access to diceRoll metadata
      isGameOver.value = data.value.isGameOver && props.isCharacterCreated
      
      // Set indicators based on server metadata or content
      checkLuck.value = data.value.diceRoll?.hasLuckCheck || data.value.content?.includes('ПРОВЕРЬТЕ СВОЮ УДАЧУ') || false
      checkCharisma.value = data.value.diceRoll?.hasCharisma || data.value.content?.includes('Проверьте свое ОБАЯНИЕ') || false
    } else {
      // Fallback for old string response
      content.value = data.value || ''
      isGameOver.value = false
      checkLuck.value = content.value.includes('ПРОВЕРЬТЕ СВОЮ УДАЧУ')
      checkCharisma.value = content.value.includes('Проверьте свое ОБАЯНИЕ')
    }
  } else {
    content.value = ''
    isGameOver.value = false
    checkLuck.value = false
    checkCharisma.value = false
  }
}

// Watch for page prop changes
watch(() => props.page, async (newPage) => {
  await fetchContent(newPage)
  // Process content after it loads
  await nextTick()
  processEditorContent()
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