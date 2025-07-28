# Guía para Subir el Juego STOP a GitHub

Esta guía detallada te ayudará a subir tu juego STOP a GitHub y configurar el despliegue automático con GitHub Pages.

## Paso 1: Configurar credenciales de Git

```bash
cd /workspace/shadcn-ui
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@ejemplo.com"
```

## Paso 2: Crear un nuevo repositorio en GitHub

1. Ve a [GitHub](https://github.com/)
2. Inicia sesión en tu cuenta
3. Haz clic en el botón "+" en la esquina superior derecha y selecciona "Nuevo repositorio"
4. Nombra tu repositorio (por ejemplo, "stop-game")
5. Deja la descripción opcional (por ejemplo, "Juego STOP con autenticación, ranking y funciones sociales")
6. Elige si quieres que sea público o privado
7. NO inicialices el repositorio con README, .gitignore o licencia
8. Haz clic en "Crear repositorio"

## Paso 3: Inicializar Git y subir el código

```bash
cd /workspace/shadcn-ui
git init
git add .
git commit -m "Versión inicial del juego STOP con autenticación, ranking y funciones sociales"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/stop-game.git
git push -u origin main
```

> **IMPORTANTE**: Reemplaza `TU-USUARIO` con tu nombre de usuario de GitHub y `stop-game` con el nombre que elegiste para tu repositorio.

## Paso 4: Configurar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Haz clic en "Settings" (Configuración)
3. En el menú lateral, haz clic en "Pages"
4. En "Source", selecciona "GitHub Actions"
5. La acción de despliegue que ya está configurada en el archivo `.github/workflows/deploy.yml` se activará automáticamente

## Paso 5: Verificar el despliegue

1. Ve a la pestaña "Actions" en tu repositorio
2. Verás la acción de despliegue en proceso
3. Una vez completada, haz clic en ella para ver los detalles
4. En la sección de "Deploy to GitHub Pages", encontrarás un enlace al sitio desplegado
5. Tu juego estará disponible en: `https://TU-USUARIO.github.io/stop-game/`

## Paso 6: Configurar Fusión Automática (Auto-Merge)

Si deseas configurar la fusión automática que mencionaste:

1. Ve a la página principal de tu repositorio
2. Haz clic en "Settings" (Configuración)
3. En la sección "Pull Requests", busca "Allow auto-merge" y activa esta opción
4. Guarda los cambios

Ahora, cuando se cumplan los requisitos configurados en las reglas de protección de ramas, GitHub fusionará automáticamente los pull requests aprobados.

## Paso 7: Modificar la configuración base para GitHub Pages

Como estás desplegando en GitHub Pages, es posible que necesites modificar la configuración del enrutador:

```javascript
// En src/App.tsx, modifica la configuración del BrowserRouter
<BrowserRouter basename="/stop-game">
  {/* tus rutas aquí */}
</BrowserRouter>
```

Reemplaza `/stop-game` con el nombre de tu repositorio.

## Solución de problemas comunes

### Error 404 después del despliegue
- Verifica que el basename del router coincida con el nombre de tu repositorio
- Comprueba que el archivo vite.config.ts tenga la base configurada correctamente

### Fallos en el workflow de GitHub Actions
- Verifica que las dependencias estén correctamente especificadas en package.json
- Asegúrate de que el token de GitHub tenga los permisos necesarios