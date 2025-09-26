import { NextRequest, NextResponse } from 'next/server'

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  '127.0.0.1',
  '::1'
])

const PRIVATE_IP_REGEX = /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.|169\.254\.)/

const sanitizeFileName = (fileName: string): string => {
  const trimmed = fileName.trim().replace(/\s+/g, '_')
  const sanitized = trimmed.replace(/[^a-zA-Z0-9._-]/g, '')
  return sanitized || `imagen_${Date.now()}.png`
}

const isUrlAllowed = (url: URL): boolean => {
  if (!['https:', 'http:'].includes(url.protocol)) {
    return false
  }

  const hostname = url.hostname.toLowerCase()

  if (BLOCKED_HOSTNAMES.has(hostname)) {
    return false
  }

  const isIpAddress = /^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname)

  if (isIpAddress && PRIVATE_IP_REGEX.test(hostname)) {
    return false
  }

  return true
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imageUrlParam = searchParams.get('url')
    const fileNameParam = searchParams.get('filename')

    if (!imageUrlParam) {
      return NextResponse.json(
        { success: false, error: 'Se requiere el parámetro url' },
        { status: 400 }
      )
    }

    if (imageUrlParam.length > 2048) {
      return NextResponse.json(
        { success: false, error: 'La URL proporcionada es demasiado larga' },
        { status: 400 }
      )
    }

    let targetUrl: URL

    try {
      targetUrl = new URL(imageUrlParam)
    } catch {
      return NextResponse.json(
        { success: false, error: 'La URL proporcionada no es válida' },
        { status: 400 }
      )
    }

    if (!isUrlAllowed(targetUrl)) {
      return NextResponse.json(
        { success: false, error: 'URL no permitida para descarga' },
        { status: 400 }
      )
    }

    const response = await fetch(targetUrl, { cache: 'no-store' })

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `No se pudo obtener la imagen (status ${response.status})`
        },
        { status: response.status }
      )
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const contentType = response.headers.get('content-type') ?? 'application/octet-stream'
    const dispositionFileName = sanitizeFileName(fileNameParam || targetUrl.pathname.split('/').pop() || `imagen_${Date.now()}.png`)

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': buffer.length.toString(),
        'Content-Disposition': `attachment; filename="${dispositionFileName}"`,
        'Cache-Control': 'no-store'
      }
    })
  } catch (error) {
    console.error('❌ Error en API image-download:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno al descargar la imagen' },
      { status: 500 }
    )
  }
}
