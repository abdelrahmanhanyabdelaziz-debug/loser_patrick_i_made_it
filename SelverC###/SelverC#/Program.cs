using System;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;

class Program
{
    static async Task Main(string[] args)
    {
        Console.Write("Enter city name: ");
        string city_name = Console.ReadLine();

        string city_lat_api = $"https://geocoding-api.open-meteo.com/v1/search?name={city_name}&count=1&language=en&format=json";

        using (HttpClient client = new HttpClient())
        {
            try
            {
                // Get latitude and longitude from geocoding API
                HttpResponseMessage city_api_response = await client.GetAsync(city_lat_api);
                city_api_response.EnsureSuccessStatusCode();
                string city_api_body = await city_api_response.Content.ReadAsStringAsync();

                var geoResult = JsonConvert.DeserializeObject<GeocodingResponse>(city_api_body);

                if (geoResult?.results != null && geoResult.results.Length > 0)
                {
                    double latitude = geoResult.results[0].latitude;
                    double longitude = geoResult.results[0].longitude;

                    Console.WriteLine($"Latitude: {latitude}, Longitude: {longitude}");

                    // Build weather API URL with found coordinates (no current)
                    string apiUrl = $"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,rain_sum,precipitation_sum,sunrise,sunset&forecast_days=16&timezone=auto";

                    HttpResponseMessage response = await client.GetAsync(apiUrl);
                    response.EnsureSuccessStatusCode();

                    string responseBody = await response.Content.ReadAsStringAsync();

                    var result = JsonConvert.DeserializeObject<WeatherResponse>(responseBody);

                    if (result?.daily != null && result.daily.time != null)
                    {
                        Console.WriteLine("16-day forecast:");
                        for (int i = 0; i < result.daily.time.Length; i++)
                        {
                            Console.WriteLine($"Date: {result.daily.time[i]}");
                            Console.WriteLine($"  Max Temp: {result.daily.temperature_2m_max[i]}°C");
                            Console.WriteLine($"  Min Temp: {result.daily.temperature_2m_min[i]}°C");
                            Console.WriteLine($"  Rain: {result.daily.rain_sum[i]} mm");
                            Console.WriteLine($"  Precipitation: {result.daily.precipitation_sum[i]} mm");
                            Console.WriteLine($"  Weather Code: {result.daily.weather_code[i]}");
                            Console.WriteLine($"  Sunrise: {result.daily.sunrise[i]}");
                            Console.WriteLine($"  Sunset: {result.daily.sunset[i]}");
                            Console.WriteLine();
                        }
                    }
                    else
                    {
                        Console.WriteLine("Daily forecast data not found.");
                    }
                }
                else
                {
                    Console.WriteLine("City not found.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error calling API: " + ex.Message);
            }
        }
    }
}

public class GeocodingResponse
{
    public GeocodingResult[] results { get; set; }
}

public class GeocodingResult
{
    public double latitude { get; set; }
    public double longitude { get; set; }
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