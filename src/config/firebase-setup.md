# Configuración de Firebase para Autenticación Real

## Pasos para habilitar autenticación real:

### 1. Crear un proyecto Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto"
3. Ingresa el nombre de tu proyecto (ej: "stop-game-real")
4. Sigue los pasos para crear el proyecto

### 2. Configurar Authentication
1. En el panel izquierdo, ve a "Authentication"
2. Haz clic en "Comenzar"
3. Ve a "Sign-in method"
4. Habilita los proveedores que quieres usar:
   - **Google**: Habilita y configura (requiere OAuth consent screen)
   - **Facebook**: Habilita y agrega App ID y App Secret de Facebook
   - **Email/Password**: Habilita para registro con email

### 3. Configurar dominio autorizado
1. En "Authentication" > "Settings" > "Authorized domains"
2. Agrega tu dominio de producción cuando despliegues

### 4. Obtener configuración del proyecto
1. Ve a "Project settings" (ícono de engrane)
2. Scroll hacia abajo hasta "Your apps"
3. Haz clic en "Web app" (</>) para crear una app web
4. Registra la app con un nombre
5. Copia la configuración que aparece

### 5. Configurar variables de entorno
1. Crea un archivo `.env.local` en la raíz del proyecto
2. Pega la configuración de Firebase:

```env
VITE_FIREBASE_API_KEY=tu-api-key-aqui
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:tu-app-id
```

### 6. Configurar proveedores sociales

#### Para Google:
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto Firebase
3. Ve a "APIs & Services" > "Credentials"
4. Configura OAuth consent screen
5. Los Client IDs se configuran automáticamente con Firebase

#### Para Facebook:
1. Ve a [Facebook Developers](https://developers.facebook.com/)
2. Crea una nueva app
3. Agrega "Facebook Login" como producto
4. En configuración de Facebook Login, agrega tu dominio
5. Copia App ID y App Secret a Firebase Console

### 7. Reiniciar el servidor de desarrollo
```bash
pnpm run dev
```

## Estado actual:
- ✅ Código preparado para Firebase real
- ⚠️ Usando modo demo hasta que configures Firebase
- 🔧 Variables de entorno necesarias en `.env.local`

Una vez que configures Firebase correctamente, la autenticación cambiará automáticamente de modo demo a autenticación real.