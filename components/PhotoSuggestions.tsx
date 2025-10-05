'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, MapPin, Clock, Lightbulb, Target } from 'lucide-react'

interface PhotoSuggestionsProps {
  photoTip: string
  weatherCode: number
  temperature: number
  location: string
  lat?: number
  lng?: number
}

interface PhotoSpot {
  name: string
  description: string
  bestTime: string
  tags: string[]
  icon: string
  lat?: number
  lng?: number
}

export default function PhotoSuggestions({ photoTip, weatherCode, temperature, location, lat, lng }: PhotoSuggestionsProps) {
  // If coordinates are available, we will fetch a few real nearby POIs using Overpass API
  // This is a light query for cafés, viewpoints, and museums
  // We keep a fallback to generated spots if the network fails
  const [nearby, setNearby] = useState<PhotoSpot[] | null>(null)

  useEffect(() => {
    async function fetchPOI() {
      if (lat == null || lng == null) return
      try {
        const radius = 2000 // 2km
        const query = `[
          out:json
        ];(
          node["tourism"="museum"](around:${radius},${lat},${lng});
          node["tourism"="viewpoint"](around:${radius},${lat},${lng});
          node["amenity"="cafe"](around:${radius},${lat},${lng});
        );out 6;`;
        const res = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ data: query }).toString()
        })
        if (!res.ok) throw new Error('Overpass API error')
        const data = await res.json()
        const elements = Array.isArray(data.elements) ? data.elements : []
        const mapped: PhotoSpot[] = elements.slice(0, 8).map((el: any) => {
          const latEl = el.lat ?? el.center?.lat
          const lonEl = el.lon ?? el.center?.lon
          const primary = el.tags?.name || el.tags?.brand || el.tags?.operator
          const category = el.tags?.tourism || el.tags?.amenity || el.tags?.leisure || 'Spot'
          return {
            name: primary ? `${primary}` : `${category}`,
            description: el.tags?.description || `Notable ${category} nearby` ,
            bestTime: 'Any Time',
            tags: [category, 'Nearby'],
            icon: el.tags?.amenity === 'cafe' ? '☕' : (el.tags?.tourism === 'viewpoint' ? '🌄' : (el.tags?.tourism === 'museum' ? '🏛️' : '📍')),
            lat: latEl,
            lng: lonEl
          }
        })
        if (mapped.length) setNearby(mapped)
      } catch {
        // ignore, we'll fallback
      }
    }
    fetchPOI()
  }, [lat, lng])
  const generatePhotoSpots = (): PhotoSpot[] => {
    const spots: PhotoSpot[] = []
    
    if (weatherCode === 0) {
      // Clear sky - outdoor spots
      spots.push(
        {
          name: "Golden Hour Rooftop",
          description: "Perfect for dramatic silhouettes and warm lighting",
          bestTime: "Sunrise/Sunset",
          difficulty: "Easy",
          tags: ["Architecture", "Golden Hour", "City Views"],
          icon: "🌅"
        },
        {
          name: "Water Reflections",
          description: "Capture mirror-like reflections in lakes or fountains",
          bestTime: "Early Morning",
          difficulty: "Medium",
          tags: ["Water", "Reflections", "Nature"],
          icon: "💧"
        },
        {
          name: "Street Art Walls",
          description: "Vibrant murals and graffiti for colorful shots",
          bestTime: "Afternoon",
          difficulty: "Easy",
          tags: ["Street Art", "Colorful", "Urban"],
          icon: "🎨"
        }
      )
    } else if (weatherCode >= 51 && weatherCode <= 67) {
      // Rainy - indoor/covered spots
      spots.push(
        {
          name: "Cozy Café Windows",
          description: "Capture the warm glow from inside looking out",
          bestTime: "Any Time",
          difficulty: "Easy",
          tags: ["Indoor", "Cozy", "Atmosphere"],
          icon: "☕"
        },
        {
          name: "Covered Markets",
          description: "Vibrant colors and textures under shelter",
          bestTime: "Morning",
          difficulty: "Easy",
          tags: ["Indoor", "Colorful", "Local Life"],
          icon: "🏪"
        },
        {
          name: "Museum Interiors",
          description: "Architectural details and art installations",
          bestTime: "Afternoon",
          difficulty: "Medium",
          tags: ["Architecture", "Art", "Indoor"],
          icon: "🏛️"
        }
      )
    } else if (weatherCode >= 80) {
      // Stormy - dramatic spots
      spots.push(
        {
          name: "Stormy Skies",
          description: "Capture dramatic cloud formations and lightning",
          bestTime: "During Storm",
          difficulty: "Hard",
          tags: ["Dramatic", "Weather", "Sky"],
          icon: "⛈️"
        },
        {
          name: "Urban Contrasts",
          description: "Dark buildings against stormy backgrounds",
          bestTime: "Evening",
          difficulty: "Medium",
          tags: ["Architecture", "Dramatic", "Urban"],
          icon: "🏙️"
        }
      )
    } else {
      // Cloudy - balanced spots
      spots.push(
        {
          name: "Soft Light Portraits",
          description: "Perfect diffused lighting for people photography",
          bestTime: "Midday",
          difficulty: "Easy",
          tags: ["Portraits", "Soft Light", "People"],
          icon: "👤"
        },
        {
          name: "Nature Details",
          description: "Close-up shots of plants and textures",
          bestTime: "Morning",
          difficulty: "Easy",
          tags: ["Nature", "Macro", "Textures"],
          icon: "🌿"
        }
      )
    }
    
    return spots
  }

  const photoSpots = nearby ?? generatePhotoSpots()

  // difficulty labels removed per UX request

  const getWeatherTips = () => {
    if (weatherCode === 0) {
      return [
        "Use the golden hour for warm, flattering light",
        "Look for interesting shadows and contrasts",
        "Try shooting into the sun for creative silhouettes"
      ]
    } else if (weatherCode >= 51 && weatherCode <= 67) {
      return [
        "Capture rain drops on windows for artistic shots",
        "Use reflections in puddles for unique perspectives",
        "Look for colorful umbrellas and rain gear"
      ]
    } else if (weatherCode >= 80) {
      return [
        "Be safe - shoot from covered areas",
        "Use long exposures to capture lightning",
        "Look for dramatic cloud formations"
      ]
    } else {
      return [
        "Cloudy skies provide perfect diffused light",
        "Great for portrait photography",
        "Look for interesting textures and patterns"
      ]
    }
  }

  const tips = getWeatherTips()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
    >
      <div className="flex items-center space-x-3 mb-6">
        <Camera className="w-6 h-6 text-purple-500" />
        <h3 className="text-xl font-bold text-gray-800">Photo Opportunities</h3>
      </div>

      {/* Main Photo Tip */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
        <div className="flex items-start space-x-3">
          <Lightbulb className="w-5 h-5 text-purple-500 mt-1" />
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Pro Tip</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{photoTip}</p>
          </div>
        </div>
      </div>

      {/* Photo Spots */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <MapPin className="w-4 h-4" />
          <span>Recommended Spots in {location}</span>
        </h4>
        <div className="space-y-3">
          {photoSpots.map((spot, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{spot.icon}</span>
                  <div>
                    <h5 className="font-semibold text-gray-800">{spot.name}</h5>
                    <p className="text-sm text-gray-600 mb-2">{spot.description}</p>
                    <div className="flex items-center space-x-2 flex-wrap">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{spot.bestTime}</span>
                      {spot.lat && spot.lng && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.name)}&query_place_id=&query_coordinate=${spot.lat},${spot.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          View on Maps
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                {spot.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Photography Tips */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <Target className="w-4 h-4" />
          <span>Photography Tips</span>
        </h4>
        <div className="space-y-2">
          {tips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-600">{tip}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
