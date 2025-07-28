# 🎯 STOP Game - Juego de Palabras

Un emocionante juego de palabras donde los jugadores deben escribir palabras que comiencen con una letra específica en diferentes categorías. ¡Solo se aceptan palabras reales!

## 🚀 Características

### ✨ Funcionalidades Principales
- **🎮 Múltiples modos de juego:** Individual vs IA y Multijugador
- **🌍 Soporte multiidioma:** Español, Inglés, Francés, Portugués  
- **🎯 Sistema de validación:** Solo acepta palabras reales del diccionario
- **🏆 Ranking en tiempo real:** Sistema de puntuación y clasificación
- **👥 Salas privadas:** Juega con amigos usando códigos únicos
- **🔊 Efectos de sonido:** Experiencia inmersiva con audio
- **📱 Diseño responsivo:** Funciona en móviles, tablets y escritorio

### 📚 Categorías del Juego
- **🏙️ Lugar:** Países, ciudades, lugares famosos
- **🦁 Animal:** Todo tipo de animales y criaturas
- **👤 Nombre:** Nombres propios de personas
- **🍎 Comida:** Alimentos, bebidas y comestibles
- **🎨 Color:** Todos los colores y tonalidades
- **📦 Objeto:** Cosas, herramientas y objetos diversos

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Build Tool:** Vite
- **Authentication:** Firebase Auth
- **Database:** Firebase Firestore
- **Deployment:** Vercel/Netlify ready

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- pnpm (recomendado) o npm

### Pasos de instalación

```bash
# Clonar el repositorio
git clone https://github.com/TU-USUARIO/stop-game.git
cd stop-game

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm run dev

# Abrir http://localhost:5173 en tu navegador
```

### Construcción para producción

```bash
# Construir la aplicación
pnpm run build

# Previsualizar la construcción
pnpm run preview
```

## 🎮 Cómo Jugar

1. **🎯 Selecciona el modo:** Individual vs IA o Multijugador
2. **🌍 Elige idioma:** Español, Inglés, Francés o Portugués
3. **🎲 Gira la ruleta:** Obtén una letra aleatoria
4. **✏️ Completa categorías:** Escribe palabras que empiecen con esa letra
5. **⏰ ¡Rápido!:** Tienes tiempo limitado
6. **🏆 Gana puntos:** Solo las palabras reales del diccionario cuentan

### Sistema de Puntuación
- **10 puntos:** Palabra única (solo tú la escribiste)
- **5 puntos:** Palabra compartida (otros también la escribieron)
- **0 puntos:** Palabra inventada o que no empiece con la letra correcta

## 🔧 Configuración de Firebase

Para habilitar autenticación y ranking en tiempo real:

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilita Authentication y Firestore
3. Copia la configuración a `src/lib/firebase.ts`
4. Sigue la guía en `src/config/firebase-setup.md`

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── auth/            # Autenticación
│   ├── game/            # Lógica del juego
│   ├── social/          # Funciones sociales
│   └── ui/              # Componentes de UI (shadcn)
├── lib/                 # Utilidades y configuración
│   ├── auth.tsx         # Lógica de autenticación
│   ├── firebase.ts      # Configuración Firebase
│   ├── ranking.ts       # Sistema de ranking
│   ├── wordValidator.ts # Validación de palabras
│   └── soundEffects.ts  # Efectos de sonido
├── pages/               # Páginas de la aplicación
│   ├── Index.tsx        # Página principal
│   ├── GamePlay.tsx     # Página de juego
│   ├── Leaderboard.tsx  # Tabla de clasificación
│   └── PrivateRoom.tsx  # Salas privadas
└── hooks/               # Custom hooks
```

## 🌟 Características Técnicas

### Validación de Palabras
- Diccionario extenso con cientos de palabras reales
- Validación estricta que rechaza palabras inventadas
- Soporte para múltiples idiomas
- Verificación de letra inicial

### Rendimiento
- Carga rápida con Vite
- Componentes optimizados con React
- Lazy loading de recursos
- PWA ready (Progressive Web App)

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- shadcn/ui por los componentes de interfaz
- Firebase por la infraestructura backend
- React y Vite por el framework y herramientas de desarrollo

## 📞 Contacto

- **Desarrollador:** Tu Nombre
- **Email:** tu-email@ejemplo.com
- **GitHub:** [@tu-usuario](https://github.com/tu-usuario)

---

**¡Diviértete jugando STOP! 🎯🎮**

Un emocionante juego de palabras donde los jugadores deben escribir palabras que comiencen con una letra específica en diferentes categorías. ¡Solo se aceptan palabras reales!

## 🚀 Características

### ✨ Funcionalidades Principales
- **🎮 Múltiples modos de juego:** Individual vs IA y Multijugador
- **🌍 Soporte multiidioma:** Español, Inglés, Francés, Portugués  
- **🎯 Sistema de validación:** Solo acepta palabras reales del diccionario
- **🏆 Ranking en tiempo real:** Sistema de puntuación y clasificación
- **👥 Salas privadas:** Juega con amigos usando códigos únicos
- **🔊 Efectos de sonido:** Experiencia inmersiva con audio
- **📱 Diseño responsivo:** Funciona en móviles, tablets y escritorio

### 📚 Categorías del Juego
- **🏙️ Lugar:** Países, ciudades, lugares famosos
- **🦁 Animal:** Todo tipo de animales y criaturas
- **👤 Nombre:** Nombres propios de personas
- **🍎 Comida:** Alimentos, bebidas y comestibles
- **🎨 Color:** Todos los colores y tonalidades
- **📦 Objeto:** Cosas, herramientas y objetos diversos

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Build Tool:** Vite
- **Authentication:** Firebase Auth
- **Database:** Firebase Firestore
- **Deployment:** Vercel/Netlify ready

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- pnpm (recomendado) o npm

### Pasos de instalación

```bash
# Clonar el repositorio
git clone https://github.com/TU-USUARIO/stop-game.git
cd stop-game

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm run dev

# Abrir http://localhost:5173 en tu navegador
```

### Construcción para producción

```bash
# Construir la aplicación
pnpm run build

# Previsualizar la construcción
pnpm run preview
```
<<<<<<< HEAD
>>>>>>> 8405a82 (Actualización completa del juego STOP con nuevas funcionalidades)
=======

## 🎮 Cómo Jugar

1. **🎯 Selecciona el modo:** Individual vs IA o Multijugador
2. **🌍 Elige idioma:** Español, Inglés, Francés o Portugués
3. **🎲 Gira la ruleta:** Obtén una letra aleatoria
4. **✏️ Completa categorías:** Escribe palabras que empiecen con esa letra
5. **⏰ ¡Rápido!:** Tienes tiempo limitado
6. **🏆 Gana puntos:** Solo las palabras reales del diccionario cuentan

### Sistema de Puntuación
- **10 puntos:** Palabra única (solo tú la escribiste)
- **5 puntos:** Palabra compartida (otros también la escribieron)
- **0 puntos:** Palabra inventada o que no empiece con la letra correcta

## 🔧 Configuración de Firebase

Para habilitar autenticación y ranking en tiempo real:

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilita Authentication y Firestore
3. Copia la configuración a `src/lib/firebase.ts`
4. Sigue la guía en `src/config/firebase-setup.md`

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── auth/            # Autenticación
│   ├── game/            # Lógica del juego
│   ├── social/          # Funciones sociales
│   └── ui/              # Componentes de UI (shadcn)
├── lib/                 # Utilidades y configuración
│   ├── auth.tsx         # Lógica de autenticación
│   ├── firebase.ts      # Configuración Firebase
│   ├── ranking.ts       # Sistema de ranking
│   ├── wordValidator.ts # Validación de palabras
│   └── soundEffects.ts  # Efectos de sonido
├── pages/               # Páginas de la aplicación
│   ├── Index.tsx        # Página principal
│   ├── GamePlay.tsx     # Página de juego
│   ├── Leaderboard.tsx  # Tabla de clasificación
│   └── PrivateRoom.tsx  # Salas privadas
└── hooks/               # Custom hooks
```

## 🌟 Características Técnicas

### Validación de Palabras
- Diccionario extenso con cientos de palabras reales
- Validación estricta que rechaza palabras inventadas
- Soporte para múltiples idiomas
- Verificación de letra inicial

### Rendimiento
- Carga rápida con Vite
- Componentes optimizados con React
- Lazy loading de recursos
- PWA ready (Progressive Web App)

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- shadcn/ui por los componentes de interfaz
- Firebase por la infraestructura backend
- React y Vite por el framework y herramientas de desarrollo

## 📞 Contacto

- **Desarrollador:** Tu Nombre
- **Email:** tu-email@ejemplo.com
- **GitHub:** [@tu-usuario](https://github.com/tu-usuario)

---

**¡Diviértete jugando STOP! 🎯🎮**
>>>>>>> 48b3282 (Add mobile optimizations, PWA features and visual customizations for STOP game)
