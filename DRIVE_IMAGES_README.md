# 📸 Guía: Usar Imágenes de Google Drive en Red23

## ✅ Configuración Completada

Ya está configurado el soporte para imágenes externas incluyendo Google Drive.

## 🔗 Cómo Obtener Enlaces de Google Drive

### Método 1: Enlace Directo (Recomendado)
1. **Sube tu imagen** a Google Drive
2. **Haz clic derecho** en la imagen → **"Obtener enlace"**
3. **Copia el enlace** y pégalo en el campo "URL de la imagen"
4. **El sistema lo convierte automáticamente** al formato correcto

### Ejemplo:
```
Enlace original: https://drive.google.com/file/d/1ABC123XYZ/view?usp=sharing
Se convierte a:   https://drive.google.com/uc?export=view&id=1ABC123XYZ
```

## 🎨 Servicios de Imágenes Soportados

- ✅ **Google Drive** (se convierte automáticamente)
- ✅ **Imgur** (i.imgur.com, imgur.com)
- ✅ **Unsplash** (images.unsplash.com)
- ✅ **Pixabay** (cdn.pixabay.com)
- ✅ **Lorem Picsum** (picsum.photos)

## ⚠️ Requisitos

- **Formatos**: JPG, PNG, GIF, WebP, SVG
- **Tamaño recomendado**: 1200x400px o similar (16:9)
- **Acceso público**: Las imágenes deben ser públicas

## 🚀 Cómo Usar

1. En el admin de premios, activa "**Usar solo imagen**"
2. Pega cualquier enlace de Google Drive (se convertirá automáticamente)
3. Agrega un enlace de clic opcional
4. ¡Listo! Se mostrará solo la imagen en la página de premios

## 🔧 Configuración Técnica

- ✅ `next.config.ts` actualizado con hostnames permitidos
- ✅ Funciones de conversión automática de URLs
- ✅ Validación de URLs de imagen
- ✅ Vista previa en tiempo real
- ✅ Migración de base de datos aplicada
