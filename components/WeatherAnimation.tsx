'use client'

import { motion } from 'framer-motion'
import { Sun, Cloud, CloudRain, Zap, Snowflake } from 'lucide-react'

interface WeatherAnimationProps {
  weatherCode: number
  className?: string
}

export default function WeatherAnimation({ weatherCode, className = '' }: WeatherAnimationProps) {
  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="w-8 h-8 text-yellow-500" />
    if (code >= 1 && code <= 3) return <Cloud className="w-8 h-8 text-gray-500" />
    if (code >= 45 && code <= 48) return <Cloud className="w-8 h-8 text-gray-400" />
    if (code >= 51 && code <= 67) return <CloudRain className="w-8 h-8 text-blue-500" />
    if (code >= 80) return <Zap className="w-8 h-8 text-purple-500" />
    if (code >= 71 && code <= 77) return <Snowflake className="w-8 h-8 text-blue-300" />
    return <Cloud className="w-8 h-8 text-gray-500" />
  }

  const getAnimationVariants = (code: number) => {
    if (code === 0) {
      return {
        animate: { 
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        },
        transition: { 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }
      }
    }
    
    if (code >= 51 && code <= 67) {
      return {
        animate: { 
          y: [0, -5, 0],
          opacity: [0.7, 1, 0.7]
        },
        transition: { 
          duration: 1.5, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }
      }
    }
    
    if (code >= 80) {
      return {
        animate: { 
          rotate: [0, 5, -5, 0],
          scale: [1, 1.05, 1]
        },
        transition: { 
          duration: 0.8, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }
      }
    }
    
    return {
      animate: { 
        y: [0, -3, 0],
        opacity: [0.8, 1, 0.8]
      },
      transition: { 
        duration: 3, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }
    }
  }

  const variants = getAnimationVariants(weatherCode)

  return (
    <div className={`relative ${className}`}>
      <motion.div
        {...variants}
        className="relative"
      >
        {getWeatherIcon(weatherCode)}
      </motion.div>
      
      {/* Particle effects for different weather conditions */}
      {weatherCode >= 51 && weatherCode <= 67 && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              style={{
                left: `${20 + i * 10}%`,
                top: `${10 + i * 5}%`,
              }}
              animate={{
                y: [0, 20],
                opacity: [1, 0]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeIn"
              }}
            />
          ))}
        </div>
      )}
      
      {weatherCode >= 80 && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-400 rounded-full"
              style={{
                left: `${30 + i * 20}%`,
                top: `${20 + i * 10}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
