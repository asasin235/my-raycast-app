import { getPreferenceValues } from "@raycast/api";

export type WeatherData = {
  temp: number;
  description: string;
  heatIndex?: number;
  humidity?: number;
  pressure?: number;
  rainProbability?: number;
};

export async function getWeatherData(): Promise<WeatherData | null> {
  const { latitude, longitude } = getPreferenceValues<{ latitude: string; longitude: string }>();

  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=apparent_temperature,relative_humidity_2m,surface_pressure,precipitation_probability`
    );
    const data: any = await res.json();
    const temp = data.current_weather.temperature;
    const code = data.current_weather.weathercode;
    // Find the current hour's apparent temperature, humidity, pressure, and precipitation probability
    let heatIndex: number | undefined = undefined;
    let humidity: number | undefined = undefined;
    let pressure: number | undefined = undefined;
    let rainProbability: number | undefined = undefined;
    if (data.hourly && data.hourly.time) {
      const now = new Date();
      const currentHour = now.toISOString().slice(0, 13); // e.g., '2024-06-07T14'
      const idx = data.hourly.time.findIndex((t: string) => t.startsWith(currentHour));
      if (idx !== -1) {
        if (data.hourly.apparent_temperature) heatIndex = data.hourly.apparent_temperature[idx];
        if (data.hourly.relative_humidity_2m) humidity = data.hourly.relative_humidity_2m[idx];
        if (data.hourly.surface_pressure) pressure = data.hourly.surface_pressure[idx];
        if (data.hourly.precipitation_probability) rainProbability = data.hourly.precipitation_probability[idx];
      }
    }
    // Simple mapping for weather code
    const codeMap: Record<number, string> = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Drizzle",
      55: "Dense drizzle",
      56: "Freezing drizzle",
      57: "Dense freezing drizzle",
      61: "Slight rain",
      63: "Rain",
      65: "Heavy rain",
      66: "Freezing rain",
      67: "Heavy freezing rain",
      71: "Slight snow fall",
      73: "Snow fall",
      75: "Heavy snow fall",
      77: "Snow grains",
      80: "Slight rain showers",
      81: "Rain showers",
      82: "Violent rain showers",
      85: "Slight snow showers",
      86: "Heavy snow showers",
      95: "Thunderstorm",
      96: "Thunderstorm with hail",
      99: "Thunderstorm with heavy hail",
    };
    return { temp, description: codeMap[code] || "Unknown", heatIndex, humidity, pressure, rainProbability };
  } catch (e) {
    return null;
  }
}

export function getHumidityDescription(humidity?: number): { label: string; sunSafety: string; advice: string } {
  if (humidity === undefined) {
    return { label: "Unknown", sunSafety: "No data available.", advice: "No environmental advice available." };
  }
  if (humidity >= 80) {
    return {
      label: "Very Very Humid",
      sunSafety: "High humidity increases the risk of heat exhaustion. Avoid strenuous activity in the sun and stay hydrated!",
      advice: "Wear light, breathable clothing. Take frequent breaks indoors or in the shade. Drink water regularly. Consider using a fan or air conditioning if indoors.",
    };
  } else if (humidity >= 60) {
    return {
      label: "Very Humid",
      sunSafety: "It may feel sticky and uncomfortable. Take breaks in the shade and drink plenty of water.",
      advice: "Wear loose, light-colored clothing. Avoid heavy meals and caffeine. Use a damp cloth to cool your skin if needed.",
    };
  } else if (humidity >= 40) {
    return {
      label: "Okayish Humid",
      sunSafety: "Comfortable for most people, but still use sunscreen if you are outside for long.",
      advice: "Stay hydrated and use sunscreen. Enjoy outdoor activities, but be mindful of sun exposure during peak hours.",
    };
  } else if (humidity >= 20) {
    return {
      label: "Not Humid",
      sunSafety: "Low humidity, but sun exposure can still be harmful. Use sunscreen and stay hydrated.",
      advice: "Moisturize your skin to prevent dryness. Wear sunglasses and a hat to protect from UV rays.",
    };
  } else {
    return {
      label: "Very Dry",
      sunSafety: "Very dry air. Moisturize your skin and protect yourself from sunburn.",
      advice: "Use a humidifier indoors if possible. Apply lip balm and hand cream. Limit time outdoors if you have respiratory issues.",
    };
  }
} 