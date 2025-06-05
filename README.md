# TP3 - Aplicación de Bienestar

## Descripción

Esta app de bienestar personal permite a los usuarios registrar su estado de ánimo, escribir notas diarias y adjuntar imágenes para llevar un historial visual y textual de su bienestar. Además, la app motiva al usuario mostrando frases inspiradoras y permite editar o eliminar entradas previas. El diseño se adapta a modo claro/oscuro y es completamente responsive.

## Temática

La temática central es el **bienestar emocional y el autocuidado**. La app está pensada para que cada usuario pueda reflexionar sobre su día, identificar patrones en su estado de ánimo y motivarse con frases positivas.


## Librerías principales utilizadas

- **Expo**: Framework para desarrollo rápido de apps React Native.
- **React Native**: Base para el desarrollo móvil multiplataforma.
- **expo-router**: Navegación basada en archivos para Expo.
- **expo-image-picker**: Selección de imágenes desde la galería o cámara.
- **expo-constants**: Acceso a variables de entorno y configuración.
- **@expo/vector-icons**: Íconos vectoriales para la interfaz.
- **uuid**: Generación de identificadores únicos para las entradas.
- **express** (backend): Servidor Node.js para almacenar y servir las entradas.
- **cors** (backend): Permite el acceso desde la app móvil/web al backend.
- **firebase** (opcional): Para autenticación y/o almacenamiento en la nube.


## Instrucciones para instalar y correr la app

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd TP3/Aplicaciones-moviles3/TP3
```

### 2. Instalar dependencias del frontend

```bash
npm install
```

### 3. Instalar dependencias del backend

```bash
cd backend
npm install
cd ..
```

### 4. Configurar variables de entorno

- Si usas Firebase, completa los datos en `src/utils/firebaseConfig.js`.
- Si necesitas cambiar la URL del backend, edítala en `src/utils/api.js` o en `app.json` bajo `extra.API_URL`.

### 5. Iniciar el backend

```bash
cd backend
node index.js
# El backend debería correr en http://localhost:4000
cd ..
```

### 6. Iniciar la app Expo

```bash
npx expo start
```

- Escanea el QR con la app de Expo Go o ejecuta en un emulador.


## Notas

- Si corres la app en un dispositivo físico, asegúrate de que el backend sea accesible desde la red local (usa la IP de tu PC en vez de `localhost`).
- Para desarrollo web, asegúrate de que el backend tenga habilitado CORS.
