# Manual de Uso - Red23
## Plataforma de Generación de Imágenes con IA y Automatización WhatsApp

---

## 📋 Índice

1. [Pantalla de Login](#pantalla-de-login)
2. [Pantalla de Registro](#pantalla-de-registro)
3. [Panel / Dashboard de Usuario](#panel--dashboard-de-usuario)
4. [Integración WhatsApp (No API oficial)](#integración-whatsapp-no-api-oficial)
5. [Logeo WhatsApp](#logeo-whatsapp)
6. [Seteo de Imagen a Subir a Estado de WhatsApp](#seteo-de-imagen-a-subir-a-estado-de-whatsapp)
7. [Generación de Imagen de Estado](#generación-de-imagen-de-estado)
8. [Galería de Imágenes](#galería-de-imágenes)
9. [Grupo Telegram](#grupo-telegram)

---

## 🔐 Pantalla de Login

### Acceso al Sistema
La pantalla de login de Red23 ofrece dos formas de acceso:

![Login Interface](src/app/login/page.tsx:22-36)

### Características Principales:
- **Autenticación con Clerk**: Sistema seguro de autenticación integrado
- **Interfaz Dual**: Pestañas para Login y Solicitud de Demo
- **Redirección Automática**: Después del login exitoso, redirección al `/dashboard`
- **Diseño Responsivo**: Optimizado para dispositivos móviles y desktop

### Proceso de Login:
1. **Acceder a la página**: Navegue a `/login` desde la página principal
2. **Seleccionar pestaña "Iniciar Sesión"**
3. **Completar credenciales**: Email y contraseña en los campos de Clerk
4. **Autenticación**: El sistema valida las credenciales automáticamente
5. **Redirección**: Acceso directo al dashboard principal

### Botón "Solicitar Acceso":
- Para usuarios nuevos sin cuenta
- Cambia automáticamente a la pestaña de "Solicitar Demo"
- Permite registro de nuevos usuarios

---

## 📝 Pantalla de Registro

### Solicitud de Demo Personalizada
Red23 maneja el registro a través de un sistema de solicitud de demo:

![Demo Request Form](src/components/auth/DemoRequestForm.tsx:43-127)

### Información Requerida:
- **Nombre Completo** *(Obligatorio)*
- **Email** *(Obligatorio)*
- **WhatsApp/Teléfono** *(Obligatorio)*
- **Empresa/Marca** *(Opcional)*

### Características del Registro:
- **Formulario Inteligente**: Validación en tiempo real
- **Seguridad de Datos**: Información protegida y no compartida con terceros
- **Respuesta Rápida**: Contacto en las próximas 24 horas
- **Demo Personalizada**: Análisis específico del negocio del usuario

### Proceso de Registro:
1. **Completar Formulario**: Llenar todos los campos obligatorios
2. **Envío de Solicitud**: El sistema procesa la información
3. **Confirmación**: Mensaje de éxito con próximos pasos
4. **Contacto**: El equipo de Red23 se contacta en 24 horas

---

## 🏠 Panel / Dashboard de Usuario

### Vista General del Dashboard
El dashboard es el centro de control principal de Red23:

![Dashboard Overview](src/app/dashboard/page.tsx:68-94)

### Secciones Principales:

#### 📊 Estadísticas Clave
- **Imágenes Generadas**: Contador total con crecimiento mensual
- **Posts WhatsApp**: Publicaciones automáticas del mes
- **En Galería**: Total de imágenes guardadas
- **Uso Mensual**: Progress bar del límite mensual (ej: 127/500 imágenes)

#### ⚡ Acciones Rápidas
![Quick Actions](src/app/dashboard/page.tsx:152-170)

1. **Generar Imagen** (`/chat`)
   - Acceso directo al chatbot IA
   - Icono: MessageCircle
   - Color: Primario

2. **Ver Galería** (`/gallery`)
   - Explorar todas las imágenes creadas
   - Icono: Gallery
   - Color: Secundario

3. **Subir Imagen** (`/upload`)
   - Subir imágenes propias
   - Icono: Image
   - Color: Terciario

4. **Configurar WhatsApp** (`/whatsapp-setup`)
   - Conectar cuenta de WhatsApp
   - Icono: Smartphone
   - Color: Primario oscuro

#### 🖼️ Imágenes Recientes
- Grid de últimas 4 imágenes generadas
- Información: título, fecha de creación
- Enlace directo a galería completa

#### 📅 Próximas Publicaciones
- Lista de posts programados para WhatsApp
- Estado: "Programado" con fecha y hora
- Opción para programar nuevas publicaciones

---

## 📱 Integración WhatsApp (No API oficial)

### Sistema de Conexión Alternativo
Red23 utiliza un sistema de integración no oficial con WhatsApp:

![WhatsApp Setup](src/app/whatsapp-setup/page.tsx:73-140)

### Métodos de Conexión:

#### 🔗 Conexión por QR
- **Proceso**: Escaneo de código QR desde WhatsApp Web
- **Ventajas**: Rápido y directo
- **Uso**: Ideal para configuración inicial

#### 📱 Conexión por SMS
- **Proceso**: Verificación por código SMS
- **Ventajas**: No requiere cámara
- **Uso**: Alternativa al método QR

### Estados de Conexión:
- **Desconectado**: Indicador rojo con alerta
- **Conectado**: Indicador verde con checkmark
- **En Proceso**: Loading durante la conexión

---

## 🔑 Logeo WhatsApp

### Proceso de Autenticación
![WhatsApp Login Process](src/app/whatsapp-setup/page.tsx:85-124)

### Pasos para Conectar:
1. **Introducir Número**: Formato internacional (+1234567890)
2. **Seleccionar Método**: QR o SMS
3. **Autenticación**: 
   - QR: Escanear desde WhatsApp → Configuración → Dispositivos vinculados
   - SMS: Ingresar código de verificación
4. **Confirmación**: Estado cambia a "Conectado"

### Información de Seguridad:
- **Simulación Actual**: El sistema actual simula la conexión (2 segundos)
- **Datos Seguros**: Número de teléfono almacenado de forma segura
- **Desconexión**: Opción para desconectar en cualquier momento

---

## 📤 Seteo de Imagen a Subir a Estado de WhatsApp

### Configuración de Publicación Automática
![Auto-posting Settings](src/app/whatsapp-setup/page.tsx:142-213)

### Opciones de Configuración:

#### ⏰ Programación Temporal
- **Hora de Publicación**: Selector de tiempo (ej: 09:00)
- **Días Activos**: Checkbox para cada día de la semana
- **Por Defecto**: Lunes a Viernes activados

#### 🎯 Tipo de Contenido
1. **Última imagen generada** *(Por defecto)*
2. **Imagen aleatoria de favoritas**
3. **Solo imágenes programadas específicamente**

#### 📝 Configuración Avanzada
![Advanced Settings](src/app/whatsapp-setup/page.tsx:216-261)

- **Plantilla de Descripción**: Texto personalizado para cada post
- **Notificaciones**: Confirmación de publicaciones exitosas
- **Backup Automático**: Copia de seguridad de imágenes publicadas
- **Modo Privado**: Restricción a contactos solamente

### Activación del Sistema:
- **Requisito**: WhatsApp debe estar conectado
- **Switch Principal**: Habilitar/deshabilitar publicación automática
- **Validación**: Botón "Guardar" solo activo con conexión establecida

---

## 🎨 Generación de Imagen de Estado

### Sistema de Creación IA
Red23 utiliza un chatbot IA para generar imágenes personalizadas:

### Características del Generador:
- **IA Avanzada**: Integración con OpenAI para generación de imágenes
- **Prompts Inteligentes**: Descripción en texto natural
- **Calidad Profesional**: Imágenes optimizadas para redes sociales
- **Formatos Múltiples**: Adaptación automática para WhatsApp Stories

### Proceso de Generación:
1. **Acceso al Chat**: Desde dashboard o navegación directa
2. **Descripción**: Introducir prompt descriptivo
3. **Procesamiento**: IA genera la imagen basada en el texto
4. **Preview**: Visualización antes de guardar
5. **Guardar**: Almacenamiento automático en galería

### Ejemplos de Prompts:
- "Arte digital abstracto con colores vibrantes y formas geométricas"
- "Paisaje montañoso al amanecer con niebla y colores cálidos"
- "Logo minimalista con formas geométricas en azul y blanco"

---

## 🖼️ Galería de Imágenes

### Sistema de Gestión Completo
![Gallery Interface](src/app/gallery/page.tsx:104-142)

### Funcionalidades Principales:

#### 🔍 Búsqueda y Filtros
- **Búsqueda Inteligente**: Por título, prompt o etiquetas
- **Filtros Rápidos**:
  - **Todas**: Mostrar todas las imágenes
  - **Favoritas**: Solo imágenes marcadas como favoritas
  - **Programadas**: Imágenes con publicación programada

#### 👁️ Modos de Visualización
- **Grid View**: Vista en cuadrícula (por defecto)
- **List View**: Vista en lista con más detalles

#### 🎯 Gestión de Imágenes
![Image Management](src/app/gallery/page.tsx:205-248)

Para cada imagen disponible:
- **Descargar**: Guardar imagen localmente
- **Favoritos**: Marcar/desmarcar como favorita
- **Programar**: Agendar para WhatsApp
- **Eliminar**: Remover de la galería

#### 📋 Información Detallada
- **Título**: Nombre de la imagen
- **Prompt Original**: Descripción usada para generar
- **Etiquetas**: Tags para organización
- **Fecha**: Cuándo fue creada
- **Estado**: Favorita, programada, etc.

### Carga de Imágenes Propias
![Upload Interface](src/app/upload/page.tsx:91-140)

#### 📤 Métodos de Subida
- **Drag & Drop**: Arrastrar archivos directamente
- **Selector**: Click para abrir explorador de archivos
- **Formatos**: JPG, PNG, GIF, WebP (máx. 10MB)

#### 📝 Metadatos
- **Título**: Identificación de la imagen
- **Descripción**: Detalles del contenido
- **Etiquetas**: Separadas por comas
- **Opciones**: Favoritas, programar, hacer pública

---

## 📱 Grupo Telegram

### Comunidad y Soporte

Red23 cuenta con un grupo de Telegram para:

#### 🤝 Comunidad
- **Intercambio de Ideas**: Compartir prompts exitosos
- **Casos de Éxito**: Mostrar resultados de la plataforma
- **Networking**: Conectar con otros usuarios

#### 🆘 Soporte Técnico
- **Resolución de Problemas**: Ayuda inmediata
- **Updates**: Notificaciones de nuevas funcionalidades
- **Feedback**: Canal directo para sugerencias

#### 📚 Recursos
- **Tutoriales**: Guías paso a paso
- **Tips**: Mejores prácticas para generar imágenes
- **Templates**: Plantillas de prompts efectivos

### Acceso al Grupo:
- **Enlace**: Proporcionado tras registro exitoso
- **Moderación**: Grupo moderado por el equipo de Red23
- **Reglas**: Enfoque en temas relacionados con la plataforma

---

## 🔧 Configuraciones Adicionales

### Sistema de Autenticación
- **Clerk Integration**: Sistema robusto de autenticación
- **Redirección**: `/dashboard` post-login
- **Seguridad**: Manejo seguro de sesiones

### Temas y Personalización
- **Dark/Light Mode**: Toggle disponible en toda la app
- **Responsive Design**: Optimizado para todos los dispositivos
- **Accesibilidad**: Cumple estándares de accesibilidad web

### Estados de la Aplicación
- **Loading States**: Indicadores durante procesamiento
- **Error Handling**: Manejo elegante de errores
- **Success Messages**: Confirmaciones claras de acciones

---

## 📞 Soporte y Contacto

### Canales de Ayuda
- **Demo Personalizada**: Solicitud a través del formulario de registro
- **Grupo Telegram**: Soporte comunitario y oficial
- **Contacto Directo**: Respuesta garantizada en 24 horas

### Información de Seguridad
- **Datos Protegidos**: No compartimos información con terceros
- **Backup Automático**: Seguridad de las imágenes creadas
- **Conexiones Seguras**: Todas las integraciones protegidas

---

*Este manual cubre las funcionalidades principales de Red23. Para soporte adicional, únase a nuestro grupo de Telegram o solicite una demo personalizada.*