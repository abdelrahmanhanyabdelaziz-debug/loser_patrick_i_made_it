'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react'

interface MusicPlayerProps {
  playlist: string
  weatherCode: number
  temperature: number
}

interface Track {
  title: string
  artist: string
  duration: string
  mood: string
  url: string
}

export default function MusicPlayer({ playlist, weatherCode, temperature }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [volume, setVolume] = useState(50)

  // Generate tracks based on weather and playlist vibe
  const generateTracks = (): Track[] => {
    const tracks: Track[] = []
    
    if (weatherCode === 0 && temperature >= 25) {
      // Sunny and warm - upbeat tracks
      tracks.push(
        { title: "Sunshine Days", artist: "Beach Vibes Collective", duration: "3:45", mood: "Upbeat", url: "/audio/sunshine-days.mp3" },
        { title: "Golden Hour", artist: "Summer Sounds", duration: "4:12", mood: "Energetic", url: "/audio/golden-hour.mp3" },
        { title: "Vitamin Sea", artist: "Ocean Waves", duration: "3:28", mood: "Happy", url: "/audio/vitamin-sea.mp3" },
        { title: "Beach House", artist: "Coastal Dreams", duration: "4:33", mood: "Chill", url: "/audio/beach-house.mp3" }
      )
    } else if (weatherCode >= 51 && weatherCode <= 67) {
      // Rainy - cozy tracks
      tracks.push(
        { title: "Rainy Day Blues", artist: "Cozy Corner", duration: "4:15", mood: "Melancholic", url: "/audio/rainy-day-blues.mp3" },
        { title: "Coffee Shop Vibes", artist: "Indie Folk", duration: "3:52", mood: "Warm", url: "/audio/coffee-shop-vibes.mp3" },
        { title: "Window Watching", artist: "Soft Sounds", duration: "4:08", mood: "Peaceful", url: "/audio/window-watching.mp3" },
        { title: "Thunder & Lightning", artist: "Storm Chasers", duration: "3:41", mood: "Dramatic", url: "/audio/thunder-lightning.mp3" }
      )
    } else if (weatherCode >= 80) {
      // Stormy - dramatic tracks
      tracks.push(
        { title: "Storm Symphony", artist: "Nature's Orchestra", duration: "5:22", mood: "Epic", url: "/audio/storm-symphony.mp3" },
        { title: "Thunder Road", artist: "Electric Storm", duration: "4:17", mood: "Intense", url: "/audio/thunder-road.mp3" },
        { title: "Lightning Strike", artist: "Power Surge", duration: "3:33", mood: "Electric", url: "/audio/lightning-strike.mp3" },
        { title: "After the Storm", artist: "Calm Waters", duration: "4:45", mood: "Serene", url: "/audio/after-the-storm.mp3" }
      )
    } else {
      // Default - balanced tracks
      tracks.push(
        { title: "Perfect Day", artist: "Weather Channel", duration: "3:58", mood: "Balanced", url: "/audio/perfect-day.mp3" },
        { title: "Cloud Watching", artist: "Sky Gazers", duration: "4:21", mood: "Relaxed", url: "/audio/cloud-watching.mp3" },
        { title: "Gentle Breeze", artist: "Wind Chimes", duration: "3:44", mood: "Soft", url: "/audio/gentle-breeze.mp3" },
        { title: "Nature's Rhythm", artist: "Earth Sounds", duration: "4:12", mood: "Natural", url: "/audio/natures-rhythm.mp3" }
      )
    }
    
    return tracks
  }

  const tracks = generateTracks()

  useEffect(() => {
    const audio = document.getElementById('weather-audio') as HTMLAudioElement | null
    if (audio) {
      audio.src = tracks[currentTrack].url
    }
    // Try to play on first user interaction
  }, [currentTrack, weatherCode, temperature])

  const nextTrack = () => {
    setCurrentTrack((prev) => {
      const next = (prev + 1) % tracks.length
      const audio = document.getElementById('weather-audio') as HTMLAudioElement | null
      if (audio) {
        audio.src = tracks[next].url
        if (isPlaying) audio.play().catch(() => {})
      }
      return next
    })
  }

  const prevTrack = () => {
    setCurrentTrack((prev) => {
      const next = (prev - 1 + tracks.length) % tracks.length
      const audio = document.getElementById('weather-audio') as HTMLAudioElement | null
      if (audio) {
        audio.src = tracks[next].url
        if (isPlaying) audio.play().catch(() => {})
      }
      return next
    })
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    const audio = document.getElementById('weather-audio') as HTMLAudioElement | null
    if (!audio) return
    if (!isPlaying) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
    >
      <div className="flex items-center space-x-3 mb-6">
        <Music className="w-6 h-6 text-green-500" />
        <h3 className="text-xl font-bold text-gray-800">Weather Playlist</h3>
        <div className="ml-auto">
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {playlist}
          </span>
        </div>
      </div>

      {/* Hidden audio element */}
      <audio id="weather-audio" src={tracks[currentTrack].url} preload="auto" />

      {/* Current Track */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 3, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center"
          >
            <Music className="w-8 h-8 text-white" />
          </motion.div>
          
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800">{tracks[currentTrack].title}</h4>
            <p className="text-gray-600 text-sm">{tracks[currentTrack].artist}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-gray-500">{tracks[currentTrack].duration}</span>
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                {tracks[currentTrack].mood}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: isPlaying ? "100%" : "0%" }}
            transition={{ duration: 3, ease: "linear" }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={prevTrack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <SkipBack className="w-5 h-5 text-gray-600" />
          </button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
            className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white shadow-lg"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
          </motion.button>
          
          <button
            onClick={nextTrack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <SkipForward className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <Volume2 className="w-4 h-4 text-gray-500" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-20"
          />
          <span className="text-xs text-gray-500 w-8">{volume}%</span>
        </div>
      </div>

      {/* Track List */}
      <div className="mt-6 space-y-2">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Upcoming Tracks</h4>
        {tracks.slice(1).map((track, index) => (
          <motion.div
            key={index}
            whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
            className="flex items-center justify-between p-2 rounded-lg cursor-pointer"
            onClick={() => setCurrentTrack(index + 1)}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-xs text-gray-500">{index + 2}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{track.title}</p>
                <p className="text-xs text-gray-500">{track.artist}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {track.mood}
              </span>
              <span className="text-xs text-gray-500">{track.duration}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
