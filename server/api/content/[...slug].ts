// server/api/content.js (или .ts)
import { defineEventHandler } from 'h3'
import { readFile } from 'node:fs/promises'
import path from 'path'

export default defineEventHandler(async (event) => {
  // Используем getRouterParams для безопасного получения параметров
  const params = getRouterParams(event)
  const slug = params.slug

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Отсутствует название файла'
    })
  }

  // Безопасный путь к файлам
  let fileName = slug

  // Handle special cases
  if (fileName === 'preface') {
    fileName = 'preface.md'
  } else {
    // For numbered sections, ensure 3-digit format
    fileName = `${slug.padStart(3, '0')}.md`
  }

  const contentPath = path.join(process.cwd(), 'sections', fileName)

  try {
    const content = await readFile(contentPath, 'utf-8')

    // Check for game over by looking for numbered navigation links in markdown
    const hasGameLinks = checkForGameLinks(content)
    const isGameOver = slug !== 'preface' && !hasGameLinks
    
    // Parse dice roll metadata from HTML comments
    const diceRollMetadata = parseDiceRollMetadata(content)

    return {
      content,
      isGameOver,
      hasLinks: hasGameLinks,
      diceRoll: diceRollMetadata
    }

  } catch (error) {
    console.log(error)
    throw createError({
      statusCode: 404,
      message: 'Файл не найден'
    })
  }
})

// Helper function to detect navigation links in markdown content
function checkForGameLinks(content: string): boolean {
  // Look for the specific format: [**89**](#n_89) or [**230**](#n_230)
  const gameLinkRegex = /\[\*\*(\d+)\*\*\]\(#n_\d+\)/g
  
  // Also check for simpler variants: [89](#n_89) or [230](#n_230)  
  const simpleLinkRegex = /\[(\d+)\]\(#n_\d+\)/g
  
  // Check for HTML anchor links: <a href="#n_89">89</a>
  const htmlAnchorRegex = /<a[^>]+href\s*=\s*["']#n_\d+["'][^>]*>/gi
  
  const hasGameLinks = gameLinkRegex.test(content)
  const hasSimpleLinks = simpleLinkRegex.test(content)
  const hasHtmlAnchors = htmlAnchorRegex.test(content)
  
  const result = hasGameLinks || hasSimpleLinks || hasHtmlAnchors
  console.log(`Game links detection for content preview: "${content.substring(0, 100)}..." - Found links: ${result}`)
  
  return result
}

// Helper function to parse dice roll metadata from HTML comments
function parseDiceRollMetadata(content: string) {
  const metadata: {
    required?: 'luck' | 'charisma' | 'combat'
    successLink?: string
    failureLink?: string
    hasLuckCheck?: boolean
    hasCharisma?: boolean
    hasCombat?: boolean
  } = {}

  // Check for dice roll requirement comment
  const diceRollMatch = content.match(/<!-- DICE_ROLL_REQUIRED: (\w+) -->/)
  if (diceRollMatch) {
    metadata.required = diceRollMatch[1] as 'luck' | 'charisma' | 'combat'
  }

  // Check for success/failure links
  const successMatch = content.match(/<!-- LUCK_SUCCESS_LINK: (\d+) -->/)
  if (successMatch) {
    metadata.successLink = successMatch[1]
  }

  const failureMatch = content.match(/<!-- LUCK_FAILURE_LINK: (\d+) -->/)
  if (failureMatch) {
    metadata.failureLink = failureMatch[1]
  }

  // Also check for content-based indicators (fallback)
  metadata.hasLuckCheck = /ПРОВЕРЬТЕ СВОЮ УДАЧУ/i.test(content)
  metadata.hasCharisma = /Проверьте свое ОБАЯНИЕ/i.test(content)
  metadata.hasCombat = /ЛОВКОСТЬ.*\d+/i.test(content)

  // If we have HTML comments, those take priority
  if (metadata.required) {
    if (metadata.required === 'luck') metadata.hasLuckCheck = true
    if (metadata.required === 'charisma') metadata.hasCharisma = true
    if (metadata.required === 'combat') metadata.hasCombat = true
  }

  return metadata
}