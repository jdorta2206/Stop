# 🚀 Guía de Despliegue en GitHub

Esta guía te ayudará a subir tu juego STOP a GitHub y desplegarlo automáticamente.

## 📋 Pasos para subir a GitHub

### 1. Crear repositorio en GitHub
1. Ve a [github.com](https://github.com) e inicia sesión
2. Haz clic en **"New"** o el botón **"+"** → **"New repository"**
3. Nombre sugerido: `stop-game` o `juego-stop`
4. Selecciona **"Public"** si quieres que sea visible
5. **NO** marques "Initialize with README" (ya tenemos uno)
6. Haz clic en **"Create repository"**

### 2. Comandos para subir el código

```bash
# Navegar al directorio del proyecto
cd /workspace/shadcn-ui

# Inicializar repositorio git
git init

# Agregar todos los archivos
git add .

# Hacer primer commit
git commit -m "🎯 Initial commit: STOP Game with word validation system"

# Agregar el repositorio remoto (CAMBIAR por tu URL)
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git

# Subir código a GitHub
git push -u origin main
```

### 3. Configurar GitHub Pages (Despliegue Automático)

1. En tu repositorio de GitHub, ve a **Settings** → **Pages**
2. En **Source**, selecciona **"GitHub Actions"**
3. El archivo `.github/workflows/deploy.yml` ya está configurado
4. Cada vez que hagas push a `main`, se desplegará automáticamente

### 4. Tu juego estará disponible en:
```
https://TU-USUARIO.github.io/TU-REPOSITORIO
```

## 🔧 Configuración Adicional

### Variables de entorno para Firebase
Si usas Firebase, agrega estas variables en **Settings** → **Secrets and variables** → **Actions**:

```
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_project_id
```

### Comandos útiles para actualizaciones

```bash
# Agregar cambios
git add .

# Commit con mensaje descriptivo
git commit -m "✨ Feature: Nueva funcionalidad agregada"

# Subir cambios (despliegue automático)
git push
```

## 📝 Tipos de commit recomendados

- `✨ feat:` Nueva funcionalidad
- `🐛 fix:` Corrección de bugs
- `📚 docs:` Documentación
- `💄 style:` Cambios de estilo/UI
- `♻️ refactor:` Refactorización de código
- `⚡ perf:` Mejoras de rendimiento
- `✅ test:` Agregar tests

## 🎯 Resultado Final

Una vez completado, tendrás:
- ✅ Código fuente en GitHub
- ✅ Despliegue automático configurado
- ✅ URL pública para compartir tu juego
- ✅ Actualizaciones automáticas con cada push

## 🆘 Solución de Problemas

### Error: "repository not found"
- Verifica que la URL del repositorio sea correcta
- Asegúrate de tener permisos de escritura

### Error de autenticación
- Usa token personal en lugar de contraseña
- Configura SSH keys para mayor seguridad

### Build falla en GitHub Actions
- Revisa los logs en la pestaña **Actions**
- Verifica que todas las dependencias estén en `package.json`

---

**¡Tu juego STOP estará listo para compartir con el mundo! 🌍🎮**