import { useState } from 'react';

export default function GameCategories() {
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  
  // Contenido traducible
  const content = {
    es: {
      categoriesTitle: "Categorías del Juego",
      categoryList: ["País", "Animal", "Nombre", "Comida", "Color", "Objeto"],
      whyPlay: "¿Por qué jugar Stop?",
      features: [
        {
          title: "Multijugador",
          desc: "Juega con hasta 8 amigos simultáneamente"
        },
        {
          title: "Múltiples Categorías",
          desc: "Más de 10 categorías para desafiar tu mente"
        },
        {
          title: "Sistema de Puntuación",
          desc: "Puntuación justa con validación automática"
        },
        {
          title: "Completamente Gratuito",
          desc: "Sin anuncios, sin compras, solo diversión"
        }
      ],
      howToPlay: "¿Cómo Jugar?",
      steps: [
        "Se genera una letra aleatoria",
        "Escribe palabras que empiecen con esa letra",
        "Completa todas las categorías",
        "¡Presiona STOP cuando termines!"
      ],
      footer: "© 2023 Stop Game. Todos los derechos reservados."
    },
    en: {
      categoriesTitle: "Game Categories",
      categoryList: ["Country", "Animal", "Name", "Food", "Color", "Object"],
      whyPlay: "Why play Stop?",
      features: [
        {
          title: "Multiplayer",
          desc: "Play with up to 8 friends simultaneously"
        },
        {
          title: "Multiple Categories",
          desc: "Over 10 categories to challenge your mind"
        },
        {
          title: "Scoring System",
          desc: "Fair scoring with automatic validation"
        },
        {
          title: "Completely Free",
          desc: "No ads, no purchases, just fun"
        }
      ],
      howToPlay: "How to Play?",
      steps: [
        "A random letter is generated",
        "Write words starting with that letter",
        "Complete all categories",
        "Press STOP when you finish!"
      ],
      footer: "© 2023 Stop Game. All rights reserved."
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-red-600">
      {/* Header con selector de idioma */}
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-red-600 font-bold text-xl">S</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Stop</h1>
        </div>
        
        <div className="bg-red-700/50 rounded-full p-1">
          <button
            onClick={() => setLanguage('es')}
            className={`px-3 py-1 rounded-full text-sm transition-all ${
              language === 'es' ? 'bg-white text-red-600' : 'text-white'
            }`}
          >
            Español
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 rounded-full text-sm transition-all ${
              language === 'en' ? 'bg-white text-red-600' : 'text-white'
            }`}
          >
            English
          </button>
        </div>
      </header>

      {/* Categorías */}
      <section className="py-10 px-4">
        <h2 className="text-4xl font-bold text-white text-center mb-8">{t.categoriesTitle}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {t.categoryList.map((category, index) => (
            <div 
              key={index} 
              className="bg-red-500/30 backdrop-blur-sm border border-red-400/30 rounded-xl p-6 flex items-center justify-center"
            >
              <span className="text-white text-xl font-medium">{category}</span>
            </div>
          ))}
        </div>
      </section>
      
      {/* Por qué jugar */}
      <section className="py-16 px-4 bg-red-700">
        <h2 className="text-4xl font-bold text-white text-center mb-12">{t.whyPlay}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {t.features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                {index === 0 && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                )}
                {index === 1 && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                )}
                {index === 2 && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M6 18.7V21a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2.3"></path>
                    <path d="M12 2a7 7 0 0 1 7 7c0 2.2-1.8 6.4-7 11.4-5.2-5-7-9.2-7-11.4a7 7 0 0 1 7-7z"></path>
                  </svg>
                )}
                {index === 3 && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                )}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-white/80">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cómo jugar */}
      <section className="py-16 px-4">
        <h2 className="text-4xl font-bold text-white text-center mb-12">{t.howToPlay}</h2>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between gap-6">
          {t.steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-red-600 font-bold text-2xl mb-4">
                {index + 1}
              </div>
              <p className="text-white text-lg">{step}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-red-800 py-8 text-center">
        <p className="text-white/60">{t.footer}</p>
      </footer>
    </div>
  );
}