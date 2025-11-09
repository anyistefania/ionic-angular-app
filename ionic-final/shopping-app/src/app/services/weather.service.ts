import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  city: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  // API Key de OpenWeatherMap (puedes usar una gratuita)
  // Para producción, esta key debe estar en variables de entorno
  private apiKey = 'demo'; // Reemplazar con API key real
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient) {}

  // Obtener clima por ciudad
  getWeatherByCity(city: string): Observable<WeatherData | null> {
    const url = `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric&lang=es`;

    return this.http.get<any>(url).pipe(
      map(response => this.transformWeatherData(response)),
      catchError(error => {
        console.error('Error obteniendo clima:', error);
        return of(null);
      })
    );
  }

  // Obtener clima por coordenadas
  getWeatherByCoordinates(lat: number, lon: number): Observable<WeatherData | null> {
    const url = `${this.apiUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=es`;

    return this.http.get<any>(url).pipe(
      map(response => this.transformWeatherData(response)),
      catchError(error => {
        console.error('Error obteniendo clima:', error);
        return of(null);
      })
    );
  }

  // Transformar datos de la API a nuestro formato
  private transformWeatherData(response: any): WeatherData {
    return {
      temperature: Math.round(response.main.temp),
      description: response.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`,
      humidity: response.main.humidity,
      windSpeed: response.wind.speed,
      city: response.name
    };
  }

  // Obtener datos de clima simulados (para desarrollo sin API key)
  getMockWeatherData(city: string = 'Bogotá'): WeatherData {
    return {
      temperature: 18,
      description: 'Parcialmente nublado',
      icon: 'https://openweathermap.org/img/wn/02d@2x.png',
      humidity: 75,
      windSpeed: 3.5,
      city: city
    };
  }

  // Verificar si el clima es apropiado para delivery
  isGoodDeliveryWeather(weather: WeatherData): { suitable: boolean; message: string } {
    // Condiciones ideales para delivery
    if (weather.temperature < 0) {
      return {
        suitable: false,
        message: 'Temperatura muy baja. Tiempos de entrega pueden variar.'
      };
    }

    if (weather.temperature > 35) {
      return {
        suitable: false,
        message: 'Temperatura muy alta. Tiempos de entrega pueden variar.'
      };
    }

    if (weather.windSpeed > 20) {
      return {
        suitable: false,
        message: 'Vientos fuertes. Entregas pueden retrasarse.'
      };
    }

    if (weather.description.toLowerCase().includes('lluvia fuerte') ||
        weather.description.toLowerCase().includes('tormenta')) {
      return {
        suitable: false,
        message: 'Mal clima. Entregas pueden retrasarse.'
      };
    }

    return {
      suitable: true,
      message: 'Condiciones ideales para entrega.'
    };
  }
}
