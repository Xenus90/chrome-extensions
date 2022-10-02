import { Weather, WeatherTempScale } from "./api.types";

const OPEN_WEATHER_API = 'c046d173e48f957a7fc8d10f7a49d7e8';

export async function fetchWeatherData(city: string, tempScale: WeatherTempScale): Promise<Weather> {
  const cityResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${OPEN_WEATHER_API}`);

  if (!cityResponse.ok) {
    throw new Error('City name isn\'t right');
  }

  const cityResponseJson = await cityResponse.json();
  const { lat, lon } = cityResponseJson[0];
  const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${tempScale}&appid=${OPEN_WEATHER_API}`);
  const weatherResponseJson = await weatherResponse.json();
  return weatherResponseJson;
}

export function fetchWeatherIcon(iconCode: string) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}
