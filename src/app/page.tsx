"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Users, Share, Trophy, Target, Star } from 'lucide-react'

const translations = {
  es: {
    title: "Stop",
    subtitle: "El juego de palabras más divertido",
    description: "Compite con amigos y demuestra tu vocabulario en el clásico juego de Stop. Piensa rápido, escribe palabras que empiecen con la letra dada y sé el primero en completar todas las categorías.",
    playNow: "Jugar Ahora",
    playWithFriends: "Jugar con Amigos",
    shareWhatsApp: "Compartir en WhatsApp",
    gameCategories: "Categorías del Juego",
    categories: {
      country: "País",
      animal: "Animal", 
      name: "Nombre",
      food: "Comida",
      color: "Color",
      object: "Objeto",
    },
    whyPlay: "¿Por qué jugar Stop?",
    features: {
      multiplayer: { title: "Multijugador", description: "Juega con hasta 8 amigos simultáneamente" },
      categories: { title: "Múltiples Categorías", description: "Más de 10 categorías para desafiar tu mente" },
      scoring: { title: "Sistema de Puntuación", description: "Puntuación justa con validación automática" },
      free: { title: "Completamente Gratuito", description: "Sin anuncios, sin compras, solo diversión" },
    },
    howToPlay: "¿Cómo Jugar?",
    steps: [
      "Se genera una letra aleatoria",
      "Escribe palabras que empiecen con esa letra", 
      "Completa todas las categorías",
      "¡Presiona STOP cuando termines!",
    ],
    footer: "© 2023 Stop Game. Todos los derechos reservados.",
  },
  en: {
    title: "Stop",
    subtitle: "The most fun word game",
    description: "Compete with friends and show your vocabulary in the classic Stop game. Think fast, write words that start with the given letter and be the first to complete all categories.",
    playNow: "Play Now",
    playWithFriends: "Play with Friends", 
    shareWhatsApp: "Share on WhatsApp",
    gameCategories: "Game Categories",
    categories: { country: "Country", animal: "Animal", name: "Name", food: "Food", color: "Color", object: "Object" },
    whyPlay: "Why play Stop?",
    features: {
      multiplayer: { title: "Multiplayer", description: "Play with up to 8 friends simultaneously" },
      categories: { title: "Multiple Categories", description: "More than 10 categories to challenge your mind" },
      scoring: { title: "Scoring System", description: "Fair scoring with automatic validation" },
      free: { title: "Completely Free", description: "No ads, no purchases, just fun" },
    },
    howToPlay: "How to Play?",
    steps: ["A random letter is generated", "Write words that start with that letter", "Complete all categories", "Press STOP when you finish!"],
    footer: "© 2023 Stop Game. All rights reserved.",
  }
}

export default function StopGameLanding() {
  const [language, setLanguage] = useState<keyof typeof translations>("es")
  const t = translations[language]

  const categories = [t.categories.country, t.categories.animal, t.categories.name, t.categories.food, t.categories.color, t.categories.object]
  const features = [
    { icon: Users, title: t.features.multiplayer.title, description: t.features.multiplayer.description },
    { icon: Target, title: t.features.categories.title, description: t.features.categories.description },
    { icon: Trophy, title: t.features.scoring.title, description: t.features.scoring.description },
    { icon: Star, title: t.features.free.title, description: t.features.free.description },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-red-600 to-red-700">
      <header className="flex items-center justify-between p-4 md:p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden">
            <img src="/logo.jpg" alt="Stop Logo" className="w-8 h-8 object-contain" />
          </div>
          <span className="text-white font-bold text-xl">Stop</span>
        </div>
        <Select value={language} onValueChange={(value: keyof typeof translations) => setLanguage(value)}>
          <SelectTrigger className="w-32 bg-red-400/50 border-red-300 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="es">Español</SelectItem>
            <SelectItem value="en">English</SelectItem>
          </SelectContent>
        </Select>
      </header>

      <section className="text-center px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-white/10 rounded-3xl flex items-center justify-center mb-6 backdrop-blur-sm overflow-hidden p-2">
              <img src="/logo.jpg" alt="Stop Game Logo" className="w-28 h-28 object-contain rounded-2xl" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">{t.title}</h1>
          <h2 className="text-xl md:text-2xl text-red-100 mb-8">{t.subtitle}</h2>
          <p className="text-lg text-red-50 max-w-2xl mx-auto mb-12 leading-relaxed">{t.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 px-8 py-4 rounded-full text-lg font-semibold min-w-48">
              <Play className="w-5 h-5 mr-2" />{t.playNow}
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-red-300 text-white hover:bg-red-400/20 px-8 py-4 rounded-full text-lg font-semibold min-w-48 bg-transparent">
              <Users className="w-5 h-5 mr-2" />{t.playWithFriends}
            </Button>
            <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold min-w-48">
              <Share className="w-5 h-5 mr-2" />{t.shareWhatsApp}
            </Button>
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-12">{t.gameCategories}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <Button key={index} variant="outline" size="lg" className="border-2 border-red-300/50 bg-red-400/20 text-white hover:bg-red-400/30 py-6 rounded-2xl text-lg font-semibold backdrop-blur-sm">
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">{t.whyPlay}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-red-400/20 border-red-300/30 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-400/30 rounded-full flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                  <p className="text-red-100 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">{t.howToPlay}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold text-2xl">{index + 1}</span>
                </div>
                <p className="text-white text-lg font-medium leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="text-center py-8 px-4">
        <p className="text-red-200 text-sm">{t.footer}</p>
      </footer>
    </div>
  )
}
