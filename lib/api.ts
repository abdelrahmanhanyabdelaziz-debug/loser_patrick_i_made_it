interface GeocodingResult {
  latitude: number
  longitude: number
  name: string
  country: string
  admin1: string
}

interface GeocodingResponse {
  results: GeocodingResult[]
}

interface DailyWeather {
  time: string[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  rain_sum: number[]
  precipitation_sum: number[]
  weather_code: number[]
  sunrise: string[]
  sunset: string[]
}

interface WeatherResponse {
  timezone: string
  daily: DailyWeather
}

interface WeatherData {
  location: string
  coordinates: { lat: number; lng: number }
  date: string
  maxTemp: number
  minTemp: number
  rain: number
  precipitation: number
  weatherCode: number
  sunrise: string
  sunset: string
  dayPlan: {
    vibe: string
    morning: string
    afternoon: string
    evening: string
    daylight: string
  }
  outfit: {
    outfit: string
    accessories: string
    pack: string
    playlist: string
  }
  creative: {
    photoTip: string
    miniChallenge: string
    localIdea: string
  }
}

export async function getWeatherData(city: string, date: string): Promise<WeatherData> {
  // First, get coordinates for the city
  const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
  
  const geocodingResponse = await fetch(geocodingUrl)
  if (!geocodingResponse.ok) {
    throw new Error('Failed to fetch city coordinates')
  }
  
  const geocodingData: GeocodingResponse = await geocodingResponse.json()
  
  if (!geocodingData.results || geocodingData.results.length === 0) {
    throw new Error('City not found')
  }
  
  const { latitude, longitude, name, country, admin1 } = geocodingData.results[0]
  const locationName = buildLocationName({ name, country, admin1 })
  
  // Get weather forecast
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,rain_sum,precipitation_sum,sunrise,sunset&forecast_days=16&timezone=auto`
  
  const weatherResponse = await fetch(weatherUrl)
  if (!weatherResponse.ok) {
    throw new Error('Failed to fetch weather data')
  }
  
  const weatherData: WeatherResponse = await weatherResponse.json()
  
  if (!weatherData.daily || !weatherData.daily.time) {
    throw new Error('Weather data not available')
  }
  
  // Find the index for the selected date
  const dayIndex = weatherData.daily.time.indexOf(date)
  if (dayIndex === -1) {
    throw new Error('Date not found in forecast range')
  }
  
  // Extract weather data for the selected day
  const maxTemp = weatherData.daily.temperature_2m_max[dayIndex]
  const minTemp = weatherData.daily.temperature_2m_min[dayIndex]
  const rain = weatherData.daily.rain_sum[dayIndex]
  const precipitation = weatherData.daily.precipitation_sum[dayIndex]
  const weatherCode = weatherData.daily.weather_code[dayIndex]
  const sunrise = weatherData.daily.sunrise[dayIndex]
  const sunset = weatherData.daily.sunset[dayIndex]
  
  // Generate recommendations
  const dayPlan = buildDayPlan(maxTemp, minTemp, rain, weatherCode, sunrise, sunset)
  const outfit = buildOutfitSuggestion(maxTemp, rain, weatherCode)
  const creative = buildCreativeExtras(weatherCode, maxTemp, date, locationName)
  
  return {
    location: locationName,
    coordinates: { lat: latitude, lng: longitude },
    date,
    maxTemp,
    minTemp,
    rain,
    precipitation,
    weatherCode,
    sunrise,
    sunset,
    dayPlan,
    outfit,
    creative
  }
}

function buildLocationName(result: { name: string; country: string; admin1: string }): string {
  let name = ''
  if (result.name) name = result.name
  if (result.admin1) name += (name ? ', ' : '') + result.admin1
  if (result.country) name += (name ? ', ' : '') + result.country
  return name || 'Unknown location'
}

function buildDayPlan(maxTemp: number, minTemp: number, rain: number, code: number, sunrise: string, sunset: string) {
  const heavyRain = rain > 5.0
  const warm = maxTemp >= 25
  const chilly = minTemp < 12
  const clear = code === 0
  
  let morning = ''
  let afternoon = ''
  let evening = ''
  
  if (heavyRain) {
    morning = '☕ Slow morning: local café or museum visit with a good pastry.'
    afternoon = '📚 Creative afternoon: visit an exhibition, indoor market, or coworking café.'
    evening = '🎬 Cozy evening: movie night or a cooking experiment at home.'
  } else if (clear && warm) {
    morning = '🌅 Morning: sunrise walk or beach jog; bring sunglasses.'
    afternoon = '🏖️ Afternoon: beach, rooftop lunch, or an outdoor sport.'
    evening = '🍹 Evening: sunset drinks at a terrace or a short golden-hour photo walk.'
  } else if (clear) {
    morning = '🚶 Morning: scenic walk or city photography while light.'
    afternoon = '☕ Afternoon: café hopping or a relaxed bike ride.'
    evening = '🌠 Evening: stroll along a bright promenade or live acoustic gig.'
  } else if (code >= 1 && code <= 3) {
    morning = '🌤️ Morning: relaxed hike or farmers market visit.'
    afternoon = '📷 Afternoon: search for soft-light photo spots; try a new café.'
    evening = '🕯️ Evening: small restaurant with a cozy ambience.'
  } else if (code >= 45 && code <= 48) {
    morning = '🌫️ Morning: gentle yoga or journaling at a calm café.'
    afternoon = '📖 Afternoon: art gallery or a bookshop crawl.'
    evening = '🍲 Evening: try a slow-cooked dish or a warming stew.'
  } else if (code >= 80) {
    morning = '⚠️ Morning: check local advisories; keep indoor options.'
    afternoon = '🔒 Afternoon: indoor activities, hobby projects, or online classes.'
    evening = '🕯️ Evening: board games, baking, or a warm bath and playlist.'
  } else {
    morning = '🌈 Morning: flexible — short walk or a relaxed start.'
    afternoon = '🛍️ Afternoon: visit local shops or a covered market.'
    evening = '🌃 Evening: choose between a cultural spot or a cosy dinner.'
  }
  
  const daylight = `Daylight: ${formatDaylight(sunrise, sunset)}`
  const vibe = getVibeShort(code, rain, maxTemp)
  
  return {
    vibe,
    morning,
    afternoon,
    evening,
    daylight
  }
}

function buildOutfitSuggestion(maxTemp: number, rain: number, code: number) {
  const heavyRain = rain > 5.0
  const warm = maxTemp >= 25
  const hot = maxTemp >= 30
  const chilly = maxTemp < 12
  
  let outfit = ''
  let accessories = ''
  let pack = ''
  
  if (hot) {
    outfit = 'Outfit: Lightweight T-shirt, breathable shorts or linen pants.'
    accessories = 'Accessories: Sunglasses, wide-brim hat, SPF 50+ sunscreen.'
  } else if (warm) {
    outfit = 'Outfit: Short-sleeve shirt or blouse with light trousers.'
    accessories = 'Accessories: Sunglasses, light scarf (for sun or breeze).'
  } else if (chilly) {
    outfit = 'Outfit: Layered look — thermal base, sweater, and a jacket.'
    accessories = 'Accessories: Scarf, gloves if you tend to get cold.'
  } else {
    outfit = 'Outfit: Smart-casual layers — shirt and a light jacket or cardigan.'
    accessories = 'Accessories: Comfortable shoes and a small foldable umbrella.'
  }
  
  if (heavyRain || (code >= 51 && code <= 67) || (code >= 80)) {
    pack = 'Packing: Waterproof jacket, compact umbrella, water-resistant bag, quick-dry towel.'
  } else {
    pack = 'Packing: Reusable water bottle, phone power bank, sunglasses, small first-aid kit.'
  }
  
  const playlist = suggestPlaylist(code, maxTemp, rain)
  
  return {
    outfit,
    accessories,
    pack,
    playlist
  }
}

function buildCreativeExtras(code: number, maxTemp: number, date: string, locationName: string) {
  let photoTip = ''
  if (code === 0) {
    photoTip = 'Photo tip: Golden-hour shots near water or open plazas; look for reflections or shadow patterns.'
  } else if (code >= 45 && code <= 48) {
    photoTip = 'Photo tip: Fog and mist add mood; focus on silhouettes and soft backgrounds.'
  } else if (code >= 80) {
    photoTip = 'Photo tip: Dramatic skies—capture textured clouds and contrasting light near buildings.'
  } else {
    photoTip = 'Photo tip: Street scenes and candid portraits work well; try shallow depth of field for subject focus.'
  }
  
  const miniChallenge = buildMiniChallenge(code, maxTemp, date)
  const localIdea = 'Local discovery: Search for a small independent café or a local artisan shop and try one new thing.'
  
  return {
    photoTip,
    miniChallenge,
    localIdea
  }
}

function buildMiniChallenge(code: number, temp: number, date: string) {
  let seed = 0
  for (let i = 0; i < date.length; i++) {
    seed += date.charCodeAt(i)
  }
  seed = seed % 5
  
  const challenges = [
    "Talk to a local and learn one tip about the neighborhood; reward: a new favourite spot.",
    "Try a 10-minute photography sprint: 10 frames, one subject, different angles.",
    "Buy a snack you've never tried before and rate it out of 10.",
    "Find a small green patch or park and spend 15 minutes mindful breathing.",
    "Write a 6-line micro-poem about the sky today and share it with a friend."
  ]
  
  let challenge = challenges[seed]
  
  if (code >= 80) {
    challenge = "Storm-safe challenge: Build a 20-minute cozy station (tea, playlist, journal) and reflect on a past trip."
  }
  
  return challenge
}

function suggestPlaylist(code: number, temp: number, rain: number) {
  if (rain > 5.0) return 'Cozy Acoustic — mellow indie, warm vocals'
  if (code === 0 && temp >= 25) return 'Sunshine Hits — upbeat, beachy, feel-good pop'
  if (code === 0) return 'Golden Hour — gentle indie & acoustic'
  if (code >= 80) return 'Stormy Classics — dramatic instrumental and ambient'
  return 'Chillout Mix — soft electronic and lo-fi beats'
}

function getVibeShort(code: number, rain: number, maxTemp: number) {
  if (code === 0 && maxTemp >= 25) return 'Vibe: ☀️ Radiant & energetic — perfect for getting out and moving.'
  if (rain > 5.0) return 'Vibe: 🌧️ Cozy & introspective — ideal for slow, creative pursuits.'
  if (code >= 80) return 'Vibe: ⛈️ Stormy & dramatic — pick safe, indoor options.'
  return 'Vibe: 🌤️ Balanced & adaptable — good day to explore thoughtfully.'
}

function formatDaylight(sunrise: string, sunset: string) {
  try {
    const sr = new Date(sunrise)
    const ss = new Date(sunset)
    const diff = ss.getTime() - sr.getTime()
    if (diff < 0) return 'N/A'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${hours}h ${minutes}m (from ${sr.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} to ${ss.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })})`
  } catch {
    return 'N/A'
  }
}
