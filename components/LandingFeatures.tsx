'use client'

import { motion } from 'framer-motion'
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  Music, 
  Camera, 
  Heart, 
  Sparkles, 
  MapPin, 
  Calendar,
  Coffee,
  Palette,
  Target,
  Zap
} from 'lucide-react'

export default function LandingFeatures() {
  const features = [
    {
      icon: <Sun className="w-8 h-8" />,
      title: "Smart Weather Analysis",
      description: "Get detailed forecasts with personalized recommendations",
      color: "from-yellow-400 to-orange-500",
      delay: 0.1
    },
    {
      icon: <Music className="w-8 h-8" />,
      title: "Weather-Based Playlists",
      description: "Music that matches your day's weather perfectly",
      color: "from-purple-400 to-pink-500",
      delay: 0.2
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Photo Opportunities",
      description: "Discover the best spots for weather-appropriate photography",
      color: "from-blue-400 to-cyan-500",
      delay: 0.3
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Personalized Activities",
      description: "Tailored suggestions for morning, afternoon, and evening",
      color: "from-red-400 to-pink-500",
      delay: 0.4
    },
    {
      icon: <Coffee className="w-8 h-8" />,
      title: "Local Discoveries",
      description: "Find hidden gems and local recommendations",
      color: "from-amber-400 to-yellow-500",
      delay: 0.5
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Daily Challenges",
      description: "Fun, weather-appropriate mini-challenges to enhance your day",
      color: "from-green-400 to-emerald-500",
      delay: 0.6
    }
  ]

  const stats = [
    { number: "16", label: "Day Forecast", icon: <Calendar className="w-6 h-6" /> },
    { number: "1000+", label: "Cities Worldwide", icon: <MapPin className="w-6 h-6" /> },
    { number: "24/7", label: "Real-time Data", icon: <Zap className="w-6 h-6" /> },
    { number: "∞", label: "Possibilities", icon: <Sparkles className="w-6 h-6" /> }
  ]

  return (
    <div className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Trusted by Weather Enthusiasts
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
                  <div className="text-blue-500">{stat.icon}</div>
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: feature.delay }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-6 text-white`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-3xl p-12 text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Plan Your Perfect Day?
            </h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust Weather Concierge to make every day extraordinary, 
              no matter the weather.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started Now
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
