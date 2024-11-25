import dotenv from "dotenv";
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
  name: string;
  state: string;
  country: string;
}

// TODO: Define a class for the Weather object
// class Weather {
// city: string;
// date: string;
// temperature: number;
// wind: number;
// humidity: number;
// icon: string;
// iconDescription: string;
// constructor(
//   city: string,
//   date: string,
//   temperature: number,
//   wind: number,
//   humidity: number,
//   icon: string,
//   iconDescription: string
// ) {
//   this.city = city;
//   this.date = date;
//   this.temperature = temperature;
//   this.wind = wind;
//   this.humidity = humidity;
//   this.icon = icon;
//   this.iconDescription = iconDescription;
// }
// }
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  private cityName: string;
  constructor() {
    this.baseURL = process.env.API_BASE_URL || "";
    this.apiKey = process.env.API_KEY || "";
    this.cityName = "";
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    try {
      // console.log(this.baseURL);
      // console.log(this.apiKey);
      if (!this.baseURL || !this.apiKey) {
        throw new Error("Missing API URL or API Key");
      }
      const response = await fetch(
        `${this.baseURL}/geo/1.0/direct?q=${query}&appid=${this.apiKey}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch location data");
      }
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    // console.log(locationData);
    if (!locationData[0].name) {
      throw new Error("City not found");
    }
    const { lat, lon, city, state, country } = locationData[0];
    const coordinates: Coordinates = {
      lat,
      lon,
      name: city,
      state,
      country,
    };
    return coordinates;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    try {
      const response = await fetch(this.buildWeatherQuery(coordinates));
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }
  // TODO: Build parseCurrentWeather method
  private async parseCurrentWeather(response: any) {
    console.log(response);
    console.log(this.cityName);
    const currentWeather = response.list[0];
    const fiveDayForecast = [];
    for (let i = 1; i < response.list.length; i++) {
      fiveDayForecast.push(response.list[i]);
    }
    return { currentWeather, fiveDayForecast };
    // return await this.buildForecastArray(currentWeather, fiveDayForecast);
  }
  // TODO: Complete buildForecastArray method
  private async buildForecastArray(
    currentWeather: any,
    fiveDayForecast: any[]
  ) {
    console.log(currentWeather);
    console.log(fiveDayForecast);
    const forecast = [];
    forecast.push({
      city: this.cityName,
      date: currentWeather.dt_txt,
      icon: currentWeather.weather[0].icon,
      iconDescription: currentWeather.weather[0].description,
      tempF: currentWeather.main.temp,
      windSpeed: currentWeather.wind.speed,
      humidity: currentWeather.main.humidity,
    });
    for (let i = 1; i < fiveDayForecast.length; i += 8) {
      forecast.push({
        date: fiveDayForecast[i].dt_txt,
        icon: fiveDayForecast[i].weather[0].icon,
        iconDescription: fiveDayForecast[i].weather[0].description,
        tempF: fiveDayForecast[i].main.temp,
        windSpeed: fiveDayForecast[i].wind.speed,
        humidity: fiveDayForecast[i].main.humidity,
      });
    }
    return forecast;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const locationData = await this.fetchLocationData(city);
    console.log(locationData);
    const coordinates = this.destructureLocationData(locationData);
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = await this.parseCurrentWeather(weatherData);
    const forecast = await this.buildForecastArray(
      currentWeather.currentWeather,
      currentWeather.fiveDayForecast
    );
    console.log(forecast);
    return forecast;
  }
}

export default new WeatherService();
