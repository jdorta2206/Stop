import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { AuthModal } from "@/components/auth/AuthModal";
import { UserAccount } from "@/components/auth/UserAccount";
import FriendsInvite from "@/components/social/FriendsInvite";

type LanguageOption = 'es' | 'en' | 'fr' | 'pt';

export default function HomePage() {
  const [language, setLanguage] = useState<LanguageOption>('es');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  
  // Contenido traducible
  const content = {
    es: {
      title: "Stop",
      subtitle: "El juego de palabras más divertido",
      description: "Compite con amigos y demuestra tu vocabulario en el clásico juego de Stop. Piensa rápido, escribe palabras que empiecen con la letra dada y sé el primero en completar todas las categorías.",
      playNow: "Jugar Ahora",
      privateRoom: "🎮 Sala Privada con Chat de Voz",
      shareWhatsApp: "Compartir en WhatsApp",
      shareFacebook: "Compartir en Facebook",
      categories: "Categorías del Juego",
      categoryList: ["Lugar", "Animal", "Nombre", "Comida", "Color", "Objeto"],
      whyPlay: "¿Por qué jugar Stop?",
      reasons: [
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
      howToSteps: [
        "Se genera una letra aleatoria",
        "Escribe palabras que empiecen con esa letra",
        "Completa todas las categorías",
        "¡Presiona STOP cuando termines!"
      ],
      footer: "© 2023 Stop Game. Todos los derechos reservados.",
      signIn: "Iniciar Sesión"
    },
    en: {
      title: "Stop",
      subtitle: "The most fun word game",
      description: "Compete with friends and show your vocabulary in the classic Stop game. Think fast, write words starting with the given letter, and be the first to complete all categories.",
      playNow: "Play Now",
      privateRoom: "🎮 Private Room with Voice Chat",
      shareWhatsApp: "Share on WhatsApp",
      shareFacebook: "Share on Facebook",
      categories: "Game Categories",
      categoryList: ["Place", "Animal", "Name", "Food", "Color", "Object"],
      whyPlay: "Why play Stop?",
      reasons: [
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
      howToSteps: [
        "A random letter is generated",
        "Write words starting with that letter",
        "Complete all categories",
        "Press STOP when you finish!"
      ],
      footer: "© 2023 Stop Game. All rights reserved.",
      signIn: "Sign In"
    },
    fr: {
      title: "Stop",
      subtitle: "Le jeu de mots le plus amusant",
      description: "Rivalisez avec des amis et montrez votre vocabulaire dans le jeu classique Stop. Réfléchissez vite, écrivez des mots commençant par la lettre donnée et soyez le premier à compléter toutes les catégories.",
      playNow: "Jouer Maintenant",
      privateRoom: "🎮 Salon Privé avec Chat Vocal",
      shareWhatsApp: "Partager sur WhatsApp",
      shareFacebook: "Partager sur Facebook",
      categories: "Catégories de Jeu",
      categoryList: ["Lieu", "Animal", "Prénom", "Nourriture", "Couleur", "Objet"],
      whyPlay: "Pourquoi jouer à Stop?",
      reasons: [
        {
          title: "Multijoueur",
          desc: "Jouez avec jusqu'à 8 amis simultanément"
        },
        {
          title: "Catégories Multiples",
          desc: "Plus de 10 catégories pour défier votre esprit"
        },
        {
          title: "Système de Score",
          desc: "Notation équitable avec validation automatique"
        },
        {
          title: "Totalement Gratuit",
          desc: "Pas de publicités, pas d'achats, juste du plaisir"
        }
      ],
      howToPlay: "Comment Jouer?",
      howToSteps: [
        "Une lettre aléatoire est générée",
        "Écrivez des mots commençant par cette lettre",
        "Complétez toutes les catégories",
        "Appuyez sur STOP quand vous avez terminé!"
      ],
      footer: "© 2023 Stop Game. Tous droits réservés.",
      signIn: "Se Connecter"
    },
    pt: {
      title: "Stop",
      subtitle: "O jogo de palavras mais divertido",
      description: "Compita com amigos e mostre seu vocabulário no clássico jogo Stop. Pense rápido, escreva palavras começando com a letra dada e seja o primeiro a completar todas as categorias.",
      playNow: "Jogar Agora",
      privateRoom: "🎮 Sala Privada com Chat de Voz",
      shareWhatsApp: "Compartilhar no WhatsApp",
      shareFacebook: "Compartilhar no Facebook",
      categories: "Categorias do Jogo",
      categoryList: ["Lugar", "Animal", "Nome", "Comida", "Cor", "Objeto"],
      whyPlay: "Por que jogar Stop?",
      reasons: [
        {
          title: "Multijogador",
          desc: "Jogue com até 8 amigos simultaneamente"
        },
        {
          title: "Múltiplas Categorias",
          desc: "Mais de 10 categorias para desafiar sua mente"
        },
        {
          title: "Sistema de Pontuação",
          desc: "Pontuação justa com validação automática"
        },
        {
          title: "Completamente Gratuito",
          desc: "Sem anúncios, sem compras, apenas diversão"
        }
      ],
      howToPlay: "Como Jogar?",
      howToSteps: [
        "Uma letra aleatória é gerada",
        "Escreva palavras começando com essa letra",
        "Complete todas as categorias",
        "Pressione STOP quando terminar!"
      ],
      footer: "© 2023 Stop Game. Todos os direitos reservados.",
      signIn: "Entrar"
    }
  };

  const t = content[language];

  // Función para compartir en WhatsApp
  const shareOnWhatsApp = () => {
    const text = language === 'es' 
      ? "¡Ven a jugar Stop conmigo! 🎮 El juego de palabras más divertido. Compite y demuestra tu vocabulario 🧠"
      : "Come play Stop with me! 🎮 The most fun word game. Compete and show your vocabulary 🧠";
    const url = window.location.href;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + "\n" + url)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Función para compartir en Facebook
  const shareOnFacebook = () => {
    const url = window.location.href;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-red-600">
      {/* Header con selector de idioma y autenticación */}
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 flex items-center justify-center">
            <img src="/assets/stop-logo.png" alt="STOP Game Logo" className="w-full h-full object-contain rounded-full" />
          </div>
          <h1 className="text-2xl font-bold text-white">Stop</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-red-700/50 rounded-full p-1">
            <button
              onClick={() => setLanguage('es')}
              className={`px-2 py-1 rounded-full text-xs sm:text-sm transition-all ${
                language === 'es' ? 'bg-white text-red-600' : 'text-white'
              }`}
            >
              ES
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded-full text-xs sm:text-sm transition-all ${
                language === 'en' ? 'bg-white text-red-600' : 'text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('fr')}
              className={`px-2 py-1 rounded-full text-xs sm:text-sm transition-all ${
                language === 'fr' ? 'bg-white text-red-600' : 'text-white'
              }`}
            >
              FR
            </button>
            <button
              onClick={() => setLanguage('pt')}
              className={`px-2 py-1 rounded-full text-xs sm:text-sm transition-all ${
                language === 'pt' ? 'bg-white text-red-600' : 'text-white'
              }`}
            >
              PT
            </button>
          </div>
          
          {isAuthenticated ? (
            <UserAccount />
          ) : (
            <Button 
              variant="outline" 
              onClick={() => setAuthModalOpen(true)}
              className="bg-white/10 text-white hover:bg-white/20 border-white/20"
            >
              {content[language].signIn}
            </Button>
          )}
        </div>
      </header>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Hero Section */}
      <section className="py-12 px-4 text-center">
        <div className="w-32 h-32 rounded-full flex items-center justify-center shadow-lg mx-auto mb-6 border-4 border-white overflow-hidden">
          <img src="/assets/publiclogo.png" alt="STOP Game Logo" className="w-full h-full object-contain" />
        </div>
        
        <h1 className="text-6xl font-bold text-white mt-6 mb-4">{t.title}</h1>
        <p className="text-2xl text-white mb-4">{t.subtitle}</p>
        <p className="text-white/90 max-w-2xl mx-auto mb-8">
          {t.description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link to="/play">
            <Button className="bg-white text-red-600 hover:bg-white/90 py-6 px-8 text-lg rounded-full">
              {t.playNow}
            </Button>
          </Link>
          {isAuthenticated ? (
            <Link to="/private">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-6 px-8 text-lg rounded-full shadow-lg">
                {t.privateRoom}
              </Button>
            </Link>
          ) : (
            <Button 
              onClick={() => setAuthModalOpen(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-6 px-8 text-lg rounded-full shadow-lg"
            >
              {t.privateRoom}
            </Button>
          )}
          {isAuthenticated && (
            <Link to="/leaderboard">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white py-6 px-8 text-lg rounded-full shadow-lg flex items-center gap-3">
                <span className="text-2xl">🏆</span>
                <span>Ranking</span>
              </Button>
            </Link>
          )}
          <FriendsInvite language={language} />
          <Button 
            onClick={shareOnWhatsApp}
            className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full flex items-center justify-center"
            title={t.shareWhatsApp}
          >
            <svg 
              viewBox="0 0 24 24" 
              width="32" 
              height="32" 
              fill="currentColor"
              className="text-white"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
            </svg>
          </Button>
          
          <Button 
            onClick={shareOnFacebook}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full flex items-center justify-center"
            title={t.shareFacebook}
          >
            <svg 
              viewBox="0 0 24 24" 
              width="32" 
              height="32" 
              fill="currentColor"
              className="text-white"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </Button>
        </div>
      </section>

      {/* Categorías */}
      <section className="py-16 px-4">
        <h2 className="text-4xl font-bold text-white text-center mb-8">{t.categories}</h2>
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
          {t.reasons.map((reason, index) => (
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
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                  </svg>
                )}
                {index === 3 && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                )}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{reason.title}</h3>
              <p className="text-white/80">{reason.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cómo jugar */}
      <section className="py-16 px-4">
        <h2 className="text-4xl font-bold text-white text-center mb-12">{t.howToPlay}</h2>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between gap-6">
          {t.howToSteps.map((step, index) => (
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