using System;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;

class Program
{
    static async Task Main(string[] args)
    {
        Console.OutputEncoding = System.Text.Encoding.UTF8;
        Console.WriteLine("══════════════════════════════════════════════════════════");
        Console.WriteLine("🌍  Weather Concierge — Elevated Day Planner");
        Console.WriteLine("══════════════════════════════════════════════════════════");
        Console.Write("📍 Enter city name: ");
        string city_name = Console.ReadLine();

        Console.Write("📅 Enter date (YYYY-MM-DD) within the next 16 days: ");
        string selectedDate = Console.ReadLine();

        string city_lat_api = "https://geocoding-api.open-meteo.com/v1/search?name="
            + Uri.EscapeDataString(city_name) + "&count=1&language=en&format=json";

        using (HttpClient client = new HttpClient())
        {
            try
            {
                HttpResponseMessage city_api_response = await client.GetAsync(city_lat_api);
                city_api_response.EnsureSuccessStatusCode();
                string city_api_body = await city_api_response.Content.ReadAsStringAsync();

                var geoResult = JsonConvert.DeserializeObject<GeocodingResponse>(city_api_body);

                if (geoResult?.results != null && geoResult.results.Length > 0)
                {
                    double latitude = geoResult.results[0].latitude;
                    double longitude = geoResult.results[0].longitude;
                    string locationName = BuildLocationName(geoResult.results[0]);

                    Console.WriteLine("\n📌 Location: " + locationName);
                    Console.WriteLine("📍 Coordinates: Latitude " + latitude + ", Longitude " + longitude);

                    string apiUrl = "https://api.open-meteo.com/v1/forecast?latitude=" + latitude
                        + "&longitude=" + longitude
                        + "&daily=weather_code,temperature_2m_max,temperature_2m_min,rain_sum,precipitation_sum,sunrise,sunset"
                        + "&forecast_days=16&timezone=auto";

                    HttpResponseMessage response = await client.GetAsync(apiUrl);
                    response.EnsureSuccessStatusCode();

                    string responseBody = await response.Content.ReadAsStringAsync();
                    var result = JsonConvert.DeserializeObject<WeatherResponse>(responseBody);

                    if (result?.daily != null && result.daily.time != null)
                    {
                        int dayIndex = IndexOf(result.daily.time, selectedDate);
                        if (dayIndex == -1)
                        {
                            Console.WriteLine("\n⚠️ Date not found in forecast range. Please enter a valid date within the next 16 days.");
                            return;
                        }

                        float maxTemp = SafeGet(result.daily.temperature_2m_max, dayIndex);
                        float minTemp = SafeGet(result.daily.temperature_2m_min, dayIndex);
                        float rain = SafeGet(result.daily.rain_sum, dayIndex);
                        float precipitation = SafeGet(result.daily.precipitation_sum, dayIndex);
                        int weatherCode = SafeGetInt(result.daily.weather_code, dayIndex);
                        string sunrise = SafeGet(result.daily.sunrise, dayIndex);
                        string sunset = SafeGet(result.daily.sunset, dayIndex);

                        Console.WriteLine("\n══════════════════════════════════════════════════════════");
                        Console.WriteLine("📊 Forecast for " + selectedDate + " — " + locationName);
                        Console.WriteLine("══════════════════════════════════════════════════════════");
                        Console.WriteLine("🌡️  Max: " + FormatTemp(maxTemp) + "   Min: " + FormatTemp(minTemp));
                        Console.WriteLine("🌧️  Rain: " + FormatNumber(rain) + " mm   Precipitation: " + FormatNumber(precipitation) + " mm");
                        Console.WriteLine("🔢 Weather Code: " + weatherCode);
                        Console.WriteLine("🌅 Sunrise: " + sunrise + "   🌇 Sunset: " + sunset);

                        Console.WriteLine("\n────────  Curated Day Plan & Suggestions  ────────");
                        string dayPlan = BuildDayPlan(maxTemp, minTemp, rain, weatherCode, sunrise, sunset);
                        Console.WriteLine(dayPlan);

                        Console.WriteLine("\n────────  Outfit, Pack & Playlist  ────────");
                        string outfit = BuildOutfitSuggestion(maxTemp, rain, weatherCode);
                        Console.WriteLine(outfit);

                        Console.WriteLine("\n────────  Photo Spots & Mini-Challenge  ────────");
                        string creative = BuildCreativeExtras(weatherCode, maxTemp, selectedDate, locationName);
                        Console.WriteLine(creative);

                        Console.WriteLine("\n════════ Have a brilliant day! ✨ ════════");
                    }
                    else
                    {
                        Console.WriteLine("\n⚠️ Daily forecast data not found.");
                    }
                }
                else
                {
                    Console.WriteLine("\n❌ City not found.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("\n🚨 Error calling API: " + ex.Message);
            }
        }
    }

    // Build a readable location name if available
    static string BuildLocationName(GeocodingResult r)
    {
        string name = string.Empty;
        try
        {
            if (!string.IsNullOrEmpty(r.name)) name = r.name;
            if (!string.IsNullOrEmpty(r.admin1)) name = name + (name.Length > 0 ? ", " : "") + r.admin1;
            if (!string.IsNullOrEmpty(r.country)) name = name + (name.Length > 0 ? ", " : "") + r.country;
            if (string.IsNullOrEmpty(name)) name = "Unnamed location";
        }
        catch
        {
            name = "Location";
        }
        return name;
    }

    // Day plan builder: morning / afternoon / evening options
    static string BuildDayPlan(float maxTemp, float minTemp, float rain, int code, string sunrise, string sunset)
    {
        string morning = "";
        string afternoon = "";
        string evening = "";

        bool heavyRain = rain > 5.0f;
        bool warm = (!float.IsNaN(maxTemp) && maxTemp >= 25f);
        bool chilly = (!float.IsNaN(minTemp) && minTemp < 12f);
        bool clear = (code == 0);

        if (heavyRain)
        {
            morning = "☕ Slow morning: local café or museum visit with a good pastry.";
            afternoon = "📚 Creative afternoon: visit an exhibition, indoor market, or coworking café.";
            evening = "🎬 Cozy evening: movie night or a cooking experiment at home.";
        }
        else if (clear && warm)
        {
            morning = "🌅 Morning: sunrise walk or beach jog; bring sunglasses.";
            afternoon = "🏖️ Afternoon: beach, rooftop lunch, or an outdoor sport.";
            evening = "🍹 Evening: sunset drinks at a terrace or a short golden-hour photo walk.";
        }
        else if (clear)
        {
            morning = "🚶 Morning: scenic walk or city photography while light.";
            afternoon = "☕ Afternoon: café hopping or a relaxed bike ride.";
            evening = "🌠 Evening: stroll along a bright promenade or live acoustic gig.";
        }
        else if (code >= 1 && code <= 3)
        {
            morning = "🌤️ Morning: relaxed hike or farmers market visit.";
            afternoon = "📷 Afternoon: search for soft-light photo spots; try a new café.";
            evening = "🕯️ Evening: small restaurant with a cozy ambience.";
        }
        else if (code >= 45 && code <= 48)
        {
            morning = "🌫️ Morning: gentle yoga or journaling at a calm café.";
            afternoon = "📖 Afternoon: art gallery or a bookshop crawl.";
            evening = "🍲 Evening: try a slow-cooked dish or a warming stew.";
        }
        else if (code >= 80)
        {
            morning = "⚠️ Morning: check local advisories; keep indoor options.";
            afternoon = "🔒 Afternoon: indoor activities, hobby projects, or online classes.";
            evening = "🕯️ Evening: board games, baking, or a warm bath and playlist.";
        }
        else
        {
            morning = "🌈 Morning: flexible — short walk or a relaxed start.";
            afternoon = "🛍️ Afternoon: visit local shops or a covered market.";
            evening = "🌃 Evening: choose between a cultural spot or a cosy dinner.";
        }

        string daylight = "Daylight: " + FormatDaylight(sunrise, sunset);

        return string.Format("{0}\n\nMorning: {1}\nAfternoon: {2}\nEvening: {3}\n\n{4}",
            GetVibeShort(code, rain, maxTemp), morning, afternoon, evening, daylight);
    }

    // Outfit, accessory and pack suggestions
    static string BuildOutfitSuggestion(float maxTemp, float rain, int code)
    {
        string outfit = "";
        string accessories = "";
        string pack = "";
        bool heavyRain = rain > 5.0f;
        bool warm = (!float.IsNaN(maxTemp) && maxTemp >= 25f);
        bool hot = (!float.IsNaN(maxTemp) && maxTemp >= 30f);
        bool chilly = (!float.IsNaN(maxTemp) && maxTemp < 12f);

        if (hot)
        {
            outfit = "Outfit: Lightweight T-shirt, breathable shorts or linen pants.";
            accessories = "Accessories: Sunglasses, wide-brim hat, SPF 50+ sunscreen.";
        }
        else if (warm)
        {
            outfit = "Outfit: Short-sleeve shirt or blouse with light trousers.";
            accessories = "Accessories: Sunglasses, light scarf (for sun or breeze).";
        }
        else if (chilly)
        {
            outfit = "Outfit: Layered look — thermal base, sweater, and a jacket.";
            accessories = "Accessories: Scarf, gloves if you tend to get cold.";
        }
        else
        {
            outfit = "Outfit: Smart-casual layers — shirt and a light jacket or cardigan.";
            accessories = "Accessories: Comfortable shoes and a small foldable umbrella.";
        }

        if (heavyRain || (code >= 51 && code <= 67) || (code >= 80))
        {
            pack = "Packing: Waterproof jacket, compact umbrella, water-resistant bag, quick-dry towel.";
        }
        else
        {
            pack = "Packing: Reusable water bottle, phone power bank, sunglasses, small first-aid kit.";
        }

        string playlist = SuggestPlaylist(code, maxTemp, rain);

        return string.Format("{0}\n{1}\n\n{2}\n\nPlaylist vibe: {3}", outfit, accessories, pack, playlist);
    }

    // Creative extras: photo spots suggestion and a mini-challenge
    static string BuildCreativeExtras(int code, float maxTemp, string date, string locationName)
    {
        string photoTip = "";
        if (code == 0)
        {
            photoTip = "Photo tip: Golden-hour shots near water or open plazas; look for reflections or shadow patterns.";
        }
        else if (code >= 45 && code <= 48)
        {
            photoTip = "Photo tip: Fog and mist add mood; focus on silhouettes and soft backgrounds.";
        }
        else if (code >= 80)
        {
            photoTip = "Photo tip: Dramatic skies—capture textured clouds and contrasting light near buildings.";
        }
        else
        {
            photoTip = "Photo tip: Street scenes and candid portraits work well; try shallow depth of field for subject focus.";
        }

        string miniChallenge = BuildMiniChallenge(code, maxTemp, date);

        string localIdea = "Local discovery: Search for a small independent café or a local artisan shop and try one new thing.";

        return string.Format("{0}\n\nMini-challenge: {1}\n\n{2}", photoTip, miniChallenge, localIdea);
    }

    static string BuildMiniChallenge(int code, float temp, string date)
    {
        // Random-seeming but deterministic mini-challenge — derive seed from date string
        int seed = 0;
        if (!string.IsNullOrEmpty(date))
        {
            for (int i = 0; i < date.Length; i++) seed += date[i];
        }
        seed = seed % 5;

        string[] challenges = new string[]
        {
            "Talk to a local and learn one tip about the neighborhood; reward: a new favourite spot.",
            "Try a 10-minute photography sprint: 10 frames, one subject, different angles.",
            "Buy a snack you've never tried before and rate it out of 10.",
            "Find a small green patch or park and spend 15 minutes mindful breathing.",
            "Write a 6-line micro-poem about the sky today and share it with a friend."
        };

        string challenge = challenges[seed];

        // Suggest small safety note for stormy conditions
        if (code >= 80) challenge = "Storm-safe challenge: Build a 20-minute cozy station (tea, playlist, journal) and reflect on a past trip.";

        return challenge;
    }

    // Playlist suggestion (text only)
    static string SuggestPlaylist(int code, float temp, float rain)
    {
        if (rain > 5.0f) return "Cozy Acoustic — mellow indie, warm vocals";
        if (code == 0 && temp >= 25f) return "Sunshine Hits — upbeat, beachy, feel-good pop";
        if (code == 0) return "Golden Hour — gentle indie & acoustic";
        if (code >= 80) return "Stormy Classics — dramatic instrumental and ambient";
        return "Chillout Mix — soft electronic and lo-fi beats";
    }

    // Short vibe summary used at top of the day plan
    static string GetVibeShort(int code, float rain, float maxTemp)
    {
        if (code == 0 && maxTemp >= 25f) return "Vibe: ☀️ Radiant & energetic — perfect for getting out and moving.";
        if (rain > 5.0f) return "Vibe: 🌧️ Cozy & introspective — ideal for slow, creative pursuits.";
        if (code >= 80) return "Vibe: ⛈️ Stormy & dramatic — pick safe, indoor options.";
        return "Vibe: 🌤️ Balanced & adaptable — good day to explore thoughtfully.";
    }

    // Helpers and safety formatting
    static int IndexOf(string[] arr, string value)
    {
        if (arr == null) return -1;
        for (int i = 0; i < arr.Length; i++)
        {
            if (string.Equals(arr[i], value, StringComparison.OrdinalIgnoreCase)) return i;
        }
        return -1;
    }

    static float SafeGet(float[] arr, int idx)
    {
        if (arr == null || idx < 0 || idx >= arr.Length) return float.NaN;
        return arr[idx];
    }

    static int SafeGetInt(int[] arr, int idx)
    {
        if (arr == null || idx < 0 || idx >= arr.Length) return -1;
        return arr[idx];
    }

    static string SafeGet(string[] arr, int idx)
    {
        if (arr == null || idx < 0 || idx >= arr.Length) return string.Empty;
        return arr[idx];
    }

    static string FormatTemp(float t)
    {
        if (float.IsNaN(t)) return "N/A";
        return string.Format("{0:0.#}°C", t);
    }

    static string FormatNumber(float v)
    {
        if (float.IsNaN(v)) return "N/A";
        return string.Format("{0:0.#}", v);
    }

    static string FormatDaylight(string sunrise, string sunset)
    {
        try
        {
            DateTime sr = DateTime.Parse(sunrise);
            DateTime ss = DateTime.Parse(sunset);
            TimeSpan diff = ss - sr;
            if (diff.TotalSeconds < 0) return "N/A";
            return string.Format("{0}h {1}m (from {2} to {3})", (int)diff.TotalHours, diff.Minutes, sr.ToString("HH:mm"), ss.ToString("HH:mm"));
        }
        catch
        {
            return "N/A";
        }
    }
}

// Geocoding response classes (include admin1 and country for nicer display if present)
public class GeocodingResponse
{
    public GeocodingResult[] results { get; set; }
}

public class GeocodingResult
{
    public double latitude { get; set; }
    public double longitude { get; set; }
    public string name { get; set; }
    public string country { get; set; }
    public string admin1 { get; set; }
}

public class DailyWeather
{
    public string[] time { get; set; }
    public float[] temperature_2m_max { get; set; }
    public float[] temperature_2m_min { get; set; }
    public float[] rain_sum { get; set; }
    public float[] precipitation_sum { get; set; }
    public int[] weather_code { get; set; }
    public string[] sunrise { get; set; }
    public string[] sunset { get; set; }
}

public class WeatherResponse
{
    public string timezone { get; set; }
    public DailyWeather daily { get; set; }
}