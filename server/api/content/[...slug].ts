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
  const contentPath = path.join(process.cwd(), 'sections', [slug.padStart(3, '0'), 'md'].join('.'))

  try {
    const content = await readFile(contentPath, 'utf-8')

    return content

  } catch (error) {
    console.log(error)
    throw createError({
      statusCode: 404,
      message: 'Файл не найден'
    })
  }
})