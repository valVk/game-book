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

    return {
      content,
      isGameOver,
      hasLinks: hasGameLinks
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