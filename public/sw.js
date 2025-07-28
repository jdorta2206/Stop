// Service Worker para funcionalidad offline
const CACHE_NAME = 'stop-game-v1';
const OFFLINE_URL = '/offline.html';

// Recursos esenciales para cachear
const ESSENTIAL_RESOURCES = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/images/favicon.jpg',
  '/assets/publiclogo.png'
];

// Recursos del juego para cachear
const GAME_RESOURCES = [
  '/gameplay',
  '/private-room',
  '/leaderboard',
  '/categories'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Install');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching essential resources');
        return cache.addAll(ESSENTIAL_RESOURCES);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activar Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activate');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Interceptar requests
self.addEventListener('fetch', (event) => {
  // Solo manejar requests GET
  if (event.request.method !== 'GET') return;

  // Estrategia Network First para páginas HTML
  if (event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Si la respuesta es exitosa, cachearla
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Si falla, buscar en cache
          return caches.match(event.request)
            .then((response) => {
              if (response) {
                return response;
              }
              // Si no está en cache, mostrar página offline
              return caches.match(OFFLINE_URL);
            });
        })
    );
    return;
  }

  // Estrategia Cache First para recursos estáticos
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        
        return fetch(event.request)
          .then((response) => {
            // No cachear si no es una respuesta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Cachear la respuesta
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
  );
});

// Manejar actualizaciones en segundo plano
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Sincronización en segundo plano para datos del juego
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-scores') {
    event.waitUntil(syncGameScores());
  }
});

// Función para sincronizar puntuaciones
async function syncGameScores() {
  try {
    // Obtener datos pendientes del IndexedDB
    const pendingScores = await getPendingScores();
    
    if (pendingScores.length > 0) {
      // Intentar enviar al servidor
      for (const score of pendingScores) {
        try {
          await fetch('/api/scores', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(score)
          });
          
          // Si es exitoso, remover de pending
          await removePendingScore(score.id);
        } catch (error) {
          console.log('Error syncing score:', error);
        }
      }
    }
  } catch (error) {
    console.log('Background sync failed:', error);
  }
}

// Funciones auxiliares para IndexedDB (simuladas)
async function getPendingScores() {
  // En una implementación real, esto consultaría IndexedDB
  return [];
}

async function removePendingScore(id) {
  // En una implementación real, esto removería del IndexedDB
  console.log('Removing pending score:', id);
}