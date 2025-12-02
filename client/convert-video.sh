#!/bin/bash

echo "🎬 Script de conversión de video para compatibilidad web"
echo "=================================================="
echo ""

if ! command -v ffmpeg &> /dev/null; then
    echo "❌ Error: ffmpeg no está instalado"
    echo ""
    echo "Para instalar ffmpeg en macOS, ejecuta:"
    echo "  brew install ffmpeg"
    echo ""
    echo "Si no tienes Homebrew instalado, visita: https://brew.sh"
    exit 1
fi

echo "✅ ffmpeg encontrado"
echo ""

VIDEO_INPUT="public/vsl.mp4"
VIDEO_OUTPUT="public/vsl-converted.mp4"
VIDEO_BACKUP="public/vsl-original.mp4"

if [ ! -f "$VIDEO_INPUT" ]; then
    echo "❌ Error: No se encontró el archivo $VIDEO_INPUT"
    exit 1
fi

echo "📹 Archivo de entrada: $VIDEO_INPUT"
echo "💾 Archivo de salida: $VIDEO_OUTPUT"
echo ""

VIDEO_SIZE=$(du -h "$VIDEO_INPUT" | cut -f1)
echo "📊 Tamaño del video original: $VIDEO_SIZE"
echo ""

echo "🔄 Iniciando conversión a formato web-compatible..."
echo "   - Codec de video: H.264 (libx264)"
echo "   - Codec de audio: AAC"
echo "   - Calidad: CRF 23 (buena calidad)"
echo "   - Optimización: faststart (streaming web)"
echo ""

ffmpeg -i "$VIDEO_INPUT" \
    -c:v libx264 \
    -preset medium \
    -crf 23 \
    -c:a aac \
    -b:a 128k \
    -movflags +faststart \
    -y \
    "$VIDEO_OUTPUT"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Conversión completada exitosamente!"
    echo ""
    
    CONVERTED_SIZE=$(du -h "$VIDEO_OUTPUT" | cut -f1)
    echo "📊 Tamaño del video convertido: $CONVERTED_SIZE"
    echo ""
    
    echo "📦 Creando backup del video original..."
    cp "$VIDEO_INPUT" "$VIDEO_BACKUP"
    echo "   Backup guardado en: $VIDEO_BACKUP"
    echo ""
    
    echo "🔄 Reemplazando video original con la versión convertida..."
    mv "$VIDEO_OUTPUT" "$VIDEO_INPUT"
    echo ""
    
    echo "🎉 ¡Proceso completado!"
    echo ""
    echo "El video ahora debería funcionar en todos los navegadores web."
    echo "Si quieres restaurar el original, está en: $VIDEO_BACKUP"
else
    echo ""
    echo "❌ Error durante la conversión"
    echo "Revisa los mensajes de error de ffmpeg arriba"
    exit 1
fi

