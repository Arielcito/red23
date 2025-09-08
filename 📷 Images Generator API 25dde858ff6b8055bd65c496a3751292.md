# 📷 Images Generator API

API para generar imágenes a partir de un `prompt`, con opción de incrustar un logo en una posición determinada.

---

## 🔑 Autenticación

Todas las requests deben incluir un **Bearer Token** en el header `Authorization`.

```
Authorization: Bearer PpIaCbhaKLsMaJ659upB51zlG51LesQ9aX5cjoqlePew5mDWW1pH17Q0M76lBuo2
```

---

## 🔗 URL

[**https://imagesgeneratorapi-219275077232.us-central1.run.app**](https://imagesgeneratorapi-219275077232.us-central1.run.app/)

---

## 📍 Endpoints

### `POST /generate`

Genera una imagen en base al `prompt` y opcionalmente incrusta un logo.

### Request Body (JSON)

| Campo | Tipo | Requerido | Descripción | Default |
| --- | --- | --- | --- | --- |
| `prompt` | **string** | ✅ | Texto descriptivo para la generación de la imagen. | null |
| `logo` | **string** | ❌ | URL de la imagen del logo (PNG/JPG/JPEG/GIF/WEBP). | null |
| `position` | **int** | ❌ | Posición del logo (1–9, estilo keypad). Ej: `1=arriba izquierda`, `5=centro`, `9=abajo derecha`. | 9 |
| `tokens` | int | ❌ | Tokens consumidos por generación de imagen. | 0 |
| `user_email` | string | ❌ | Email de usuario. | null |

POST /generate
Content-Type: application/json
Authorization: Bearer <API_TOKEN>

Ejemplo de Request

```jsx
{
"prompt": "Que diga 'tenes un 20% de descuento' y lluvia de dolares"",
"logo": "[https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Cabify-logo-purple.png/960px-Cabify-logo-purple.png](https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Cabify-logo-purple.png/960px-Cabify-logo-purple.png)",
"position": 9,
"user_email":"test@gmail.com",
"tokens": 1
}
```

### Ejemplo de respuesta

```jsx
{
    "data": {
        "created_at": "2025-08-28 01:27:53",
        "position": 9,
        "logo": "https://logosenvector.com/logo/img/puma-37624.png",
        "prompt": "Que diga 'tenes un 20% de descuento' y lluvia de dolares",
        "result": "https://storage.googleapis.com/stories_ia/d734fd4d-0fb6-4cce-b340-efcac663bbdb.png",
        "result_with_logo": "https://storage.googleapis.com/stories_ia/d734fd4d-0fb6-4cce-b340-efcac663bbdb_with_logo.png",
		    "user_email":"test@gmail.com",
				"tokens": 1
    },
    "message": "Image generated successfully",
    "request_id": "d734fd4d-0fb6-4cce-b340-efcac663bbdb",
    "status": "success"
}
```

### Errores posibles

- **401 Unauthorized** → Token inválido.
- **400 Invalid JSON** → Request mal formado.
- **400 Missing required field 'prompt'** → No se envió `prompt` o no es string.
- **400 'logo' must be a string (URL expected)** → `logo` no es string.
- **400 'position' must be a int between 1 and 9** → `position` no es int entre 1 y 9
- **500 Image generation failed** → Error al generar la imagen.

### Aclaraciones

- Si el logo enviado no es válido, la imagen se va a generar igualmente sin logo en la posición 9.
- Imagen de referencia de posiciones:

![image.png](%F0%9F%93%B7%20Images%20Generator%20API%2025dde858ff6b8055bd65c496a3751292/image.png)

---

### `GET /images`

Obtiene las imágenes generadas, con opciones de filtrado y límite.

## Query Parameters

| Parámetro | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `user_email` | String | ❌ | Filtra por usuario. |
| `limit` | Integer | ❌ | Cantidad máxima de registros a retornar. Default: `20`.  |
| `start_date` | String | ❌ | Fecha mínima para el filtro, en formato `YYYY-MM-DD`. Inlcuye desde las 00:00:00 del día. |
| `end_date` | String | ❌ | Fecha máxima para el filtro, en formato `YYYY-MM-DD`. Incluye hasta las 23:59:59 del día. |

GET /images
Content-Type: application/json
Authorization: Bearer <API_TOKEN>

Ejemplo de Request

/images?user_email=test@gmail.com&start_date=2025-08-01&end_date=2025-08-31&limit=5

### Ejemplo de respuesta

```jsx
{
    "count": 1,
    "data": [
        {
            "created_at": "2025-09-06T18:52:52+00:00",
            "id": 3,
            "logo": "https://logosenvector.com/logo/img/puma-37624.png",
            "prompt": "Genera una imagen para publicar en una historia con las siguiente indicacion: Que diga 'tenes un 20% de descuento' y lluvia de dolares",
            "request_id": "01a28e7f-10d5-4216-a089-b2a7a9fa5a19",
            "result": "https://storage.googleapis.com/stories_ia/01a28e7f-10d5-4216-a089-b2a7a9fa5a19_with_logo.png",
            "result_with_logo": "https://storage.googleapis.com/stories_ia/01a28e7f-10d5-4216-a089-b2a7a9fa5a19_with_logo.png",
            "tokens": 2,
            "user_email": "test@gmail.com"
        }
    ],
    "end_date": null,
    "limit": 20,
    "start_date": null,
    "status": "success"
}
```

---

### `GET /winners`

Obtiene los ganadores del canal de Telegram, con opciones de filtrado.

## Query Parameters

| Parámetro | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `date` | String | ❌ | Fecha para el filtro, en formato `YYYY-MM-DD`. Inlcuye desde las 00:00:00 del día. |

GET /winners
Content-Type: application/json
Authorization: Bearer <API_TOKEN>

Ejemplo de Request

/winners?date=2025-09-07

### Ejemplo de respuesta

```jsx
{
    "data": [
        {
            "first_name": "Test User",
            "id": 3,
            "message": "Felicitaciones!!!\n\n👉 Usuario ganador del sorteo diario: [Test User](tg://user?id=7266065145)",
            "user_id": 7266065145,
            "username": null,
            "won_at": "2025-09-07T21:55:42.191583"
        }
    ],
    "status": "success"
}
```