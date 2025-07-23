"use client"
import { useRouter } from "next/navigation"
import { Play, Users, Share2, Trophy, Target, Star, MessageCircle } from 'lucide-react'
import { useLanguage } from "@/contexts/language-context"

const translations = {
  es: {
    title: "¡Juega Stop Online!",
    subtitle: "El juego de palabras más divertido para jugar con amigos",
    description: "¡Juega al clásico juego Stop, multilenguaje, contra la IA o amigos! Compite con tus amigos en el clásico juego de Stop.",
    playButton: "¡Jugar Ahora!",
    playWithFriends: "Jugar con Amigos",
    shareButton: "Compartir en WhatsApp",
    howToPlay: "Cómo Jugar",
    categories: "Categorías",
    features: "Características",
    multiplayerTitle: "Multijugador",
    multiplayerDesc: "Juega con amigos en tiempo real",
    fastTitle: "Rápido y Divertido",
    fastDesc: "Partidas dinámicas de 5 minutos",
    competitiveTitle: "Competitivo",
    competitiveDesc: "Sistema de puntuación justo",
    aiTitle: "Contra IA",
    aiDesc: "Practica contra inteligencia artificial",
    steps: [
      "Únete a una sala con tus amigos o juega contra la IA",
      "Espera a que se genere una letra aleatoria",
      "Completa todas las categorías con esa letra",
      "¡El primero en terminar dice STOP!",
      "Compara respuestas y gana puntos",
    ],
    categoryList: ["País", "Animal", "Nombre", "Apellido", "Color", "Comida", "Objeto", "Profesión"],
    readyToPlay: "¿Listo para jugar?",
    shareText: "¡Ven a jugar Stop conmigo! 🎮 El juego de palabras más divertido.",
  },
  en: {
    title: "Play Stop Online!",
    subtitle: "The most fun word game to play with friends",
    description: "Play the classic Stop game, multilingual, against AI or friends! Compete with your friends in the classic Stop game.",
    playButton: "Play Now!",
    playWithFriends: "Play with Friends",
    shareButton: "Share on WhatsApp",
    howToPlay: "How to Play",
    categories: "Categories",
    features: "Features",
    multiplayerTitle: "Multiplayer",
    multiplayerDesc: "Play with friends in real time",
    fastTitle: "Fast and Fun",
    fastDesc: "Dynamic 5-minute games",
    competitiveTitle: "Competitive",
    competitiveDesc: "Fair scoring system",
    aiTitle: "Against AI",
    aiDesc: "Practice against artificial intelligence",
    steps: [
      "Join a room with your friends or play against AI",
      "Wait for a random letter to be generated",
      "Complete all categories with that letter",
      "The first to finish says STOP!",
      "Compare answers and earn points",
    ],
    categoryList: ["Country", "Animal", "Name", "Surname", "Color", "Food", "Object", "Profession"],
    readyToPlay: "Ready to play?",
    shareText: "Come play Stop with me! 🎮 The most fun word game.",
  },
  fr: {
    title: "Jouez à Stop en ligne !",
    subtitle: "Le jeu de mots le plus amusant à jouer avec des amis",
    description: "Jouez au jeu classique Stop, multilingue, contre l'IA ou des amis !",
    playButton: "Jouer maintenant !",
    playWithFriends: "Jouer avec des amis",
    shareButton: "Partager sur WhatsApp",
    howToPlay: "Comment jouer",
    categories: "Catégories",
    features: "Fonctionnalités",
    multiplayerTitle: "Multijoueur",
    multiplayerDesc: "Jouez avec des amis en temps réel",
    fastTitle: "Rapide et amusant",
    fastDesc: "Parties dynamiques de 5 minutes",
    competitiveTitle: "Compétitif",
    competitiveDesc: "Système de notation équitable",
    aiTitle: "Contre l'IA",
    aiDesc: "Entraînez-vous contre l'intelligence artificielle",
    steps: [
      "Rejoignez une salle avec vos amis ou jouez contre l'IA",
      "Attendez qu'une lettre aléatoire soit générée",
      "Complétez toutes les catégories avec cette lettre",
      "Le premier à terminer dit STOP !",
      "Comparez les réponses et gagnez des points",
    ],
    categoryList: ["Pays", "Animal", "Prénom", "Nom", "Couleur", "Nourriture", "Objet", "Profession"],
    readyToPlay: "Prêt à jouer ?",
    shareText: "Venez jouer à Stop avec moi ! 🎮",
  },
  pt: {
    title: "Jogue Stop Online!",
    subtitle: "O jogo de palavras mais divertido para jogar com amigos",
    description: "Jogue o clássico jogo Stop, multilíngue, contra a IA ou amigos!",
    playButton: "Jogar Agora!",
    playWithFriends: "Jogar com Amigos",
    shareButton: "Compartilhar no WhatsApp",
    howToPlay: "Como Jogar",
    categories: "Categorias",
    features: "Características",
    multiplayerTitle: "Multijogador",
    multiplayerDesc: "Jogue com amigos em tempo real",
    fastTitle: "Rápido e Divertido",
    fastDesc: "Partidas dinâmicas de 5 minutos",
    competitiveTitle: "Competitivo",
    competitiveDesc: "Sistema de pontuação justo",
    aiTitle: "Contra IA",
    aiDesc: "Pratique contra inteligência artificial",
    steps: [
      "Entre em uma sala com seus amigos ou jogue contra a IA",
      "Aguarde uma letra aleatória ser gerada",
      "Complete todas as categorias com essa letra",
      "O primeiro a terminar diz STOP!",
      "Compare respostas e ganhe pontos",
    ],
    categoryList: ["País", "Animal", "Nome", "Sobrenome", "Cor", "Comida", "Objeto", "Profissão"],
    readyToPlay: "Pronto para jogar?",
    shareText: "Venha jogar Stop comigo! 🎮",
  },
}

export default function StopGameLanding() {
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = translations[language as keyof typeof translations] || translations.es

  const features = [
    { icon: Users, title: t.multiplayerTitle, description: t.multiplayerDesc },
    { icon: Target, title: t.fastTitle, description: t.fastDesc },
    { icon: Trophy, title: t.competitiveTitle, description: t.competitiveDesc },
    { icon: Star, title: t.aiTitle, description: t.aiDesc },
  ]

  const handlePlayNow = () => {
    const playerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const playerName = `Jugador_${Math.floor(Math.random() * 1000)}`
    router.push(`/challenge-setup/${playerId}?name=${encodeURIComponent(playerName)}`)
  }

  const handlePlayWithFriends = () => {
    router.push("/room/create")
  }

  const shareOnWhatsApp = () => {
    const text = t.shareText
    const url = window.location.href
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + "\n" + url)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-red-600 to-red-700">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden">
              <img src="/logo.png" alt="Stop Logo" className="w-8 h-8 object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-white">STOP</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex bg-white/20 rounded-full p-1">
              {['es', 'en', 'fr', 'pt'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang as any)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${language === lang ? "bg-white text-red-600" : "text-white"
                    }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Logo Principal */}
          <div className="mb-8">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl mx-auto mb-6 overflow-hidden p-2">
              <img src="/logo.png" alt="Stop Game Logo" className="w-28 h-28 object-contain rounded-2xl" />
            </div>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">{t.title}</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">{t.subtitle}</p>
          <p className="text-white/80 mb-12 max-w-3xl mx-auto">{t.description}</p>

          {/* Botones principales */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={handlePlayNow}
              className="bg-white text-red-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-red-50 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>{t.playButton}</span>
            </button>

            <button
              onClick={handlePlayWithFriends}
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all transform hover:scale-105 shadow-lg bg-transparent flex items-center justify-center space-x-2"
            >
              <Users className="w-5 h-5" />
              <span>{t.playWithFriends}</span>
            </button>

            <button
              onClick={shareOnWhatsApp}
              className="bg-green-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-green-600 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{t.shareButton}</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 text-center">
                <feature.icon className="w-12 h-12 text-white mb-4 mx-auto" />
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white/80">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Play Section */}
      <section className="bg-white/10 backdrop-blur-sm py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-12">{t.howToPlay}</h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {t.steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-white text-red-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-white/90 text-lg">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-12">{t.categories}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {t.categoryList.map((category, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center"
              >
                <span className="text-white font-semibold">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white mb-8">{t.readyToPlay}</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handlePlayNow}
              className="bg-white text-red-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-red-50 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>{t.playButton}</span>
            </button>
            <button
              onClick={shareOnWhatsApp}
              className="bg-green-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-green-600 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
            >
              <Share2 className="w-5 h-5" />
              <span>{t.shareButton}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/20 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/60">
            {language === "es" && "© 2024 Juego Stop. Todos los derechos reservados."}
            {language === "en" && "© 2024 Stop Game. All rights reserved."}
            {language === "fr" && "© 2024 Jeu Stop. Tous droits réservés."}
            {language === "pt" && "© 2024 Jogo Stop. Todos os direitos reservados."}
          </p>
        </div>
      </footer>
    </div>
  )
}