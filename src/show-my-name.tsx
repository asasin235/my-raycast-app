import { Detail, Color, ActionPanel, Action } from "@raycast/api";
import { useEffect, useState } from "react";
import { getWeatherData, WeatherData, getHumidityDescription } from "./weather";
import { getCurrentTime, getGreeting } from "./time";
import { getRandomQuote } from "./quotes";

const steveJobsPic = "steve-jobs.png"; // Use this if you add the file, otherwise fallback to a music logo

export default function Command() {
  const time = getCurrentTime();
  const greeting = getGreeting();
  const quote = getRandomQuote();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getWeatherData().then((data) => {
      setWeather(data);
      setLoading(false);
    });
  }, []);

  const humidityInfo = getHumidityDescription(weather?.humidity);

  const adviceMarkdown = `**☀️ Sun Safety:** ${humidityInfo.sunSafety}\n\n**🌱 Environmental Advice:** ${humidityInfo.advice}`;

  // Use markdown to introduce the music section
  const musicMarkdown = `\n---\n\n## 🎵 Start your day with music\n`;
  const travelMarkdown = `\n---\n\n## ✈️ Check your commute\n`;

  return (
    <Detail
      navigationTitle={greeting}
      isLoading={loading}
      markdown={`# ${greeting}\n\n${adviceMarkdown}\n\n${quote}${musicMarkdown}${travelMarkdown}`}
      actions={
        <ActionPanel>
          <ActionPanel.Section title="Music & Travel">
            <Action.OpenInBrowser
              title="Open Spotify"
              url="https://open.spotify.com/"
              icon={{ source: "Spotify Logo Green.png", tintColor: "#1DB954" }}
            />
            <Action.OpenInBrowser
              title="Open Apple Music"
              url="https://music.apple.com/"
              icon={{ source: "Apple Music Logo.webp", tintColor: "#FA233B" }}
            />
            <Action.OpenInBrowser
              title="Check Travel Time to IGI Airport T3"
              url="https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=IGI+Airport+T3+Delhi"
              icon={{ source: "🗺️" }}
            />
          </ActionPanel.Section>
        </ActionPanel>
      }
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label
            title="Current Time"
            text={{ value: time, color: Color.Orange }}
            icon={steveJobsPic}
          />
          <Detail.Metadata.Label
            title="Weather in New Delhi"
            text={weather ? `${weather.temp}°C, ${weather.description}` : loading ? "Loading..." : "Unavailable"}
            icon="🌤"
          />
          <Detail.Metadata.Label
            title="Heat Index"
            text={weather && weather.heatIndex !== undefined ? `${weather.heatIndex}°C` : loading ? "Loading..." : "Unavailable"}
            icon="🌡️"
          />
          <Detail.Metadata.Label
            title="Humidity"
            text={weather && weather.humidity !== undefined ? `${weather.humidity}% (${humidityInfo.label})` : loading ? "Loading..." : "Unavailable"}
            icon="💧"
          />
          <Detail.Metadata.Label
            title="Pressure"
            text={weather && weather.pressure !== undefined ? `${weather.pressure} hPa` : loading ? "Loading..." : "Unavailable"}
            icon="🧭"
          />
        </Detail.Metadata>
      }
    />
  );
}
