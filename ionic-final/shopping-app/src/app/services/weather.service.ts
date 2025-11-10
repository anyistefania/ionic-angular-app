import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, retry, switchMap } from 'rxjs/operators';

export interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  city: string;
  feelsLike?: number;
  weatherCode?: number;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  // API gratuita de Open-Meteo (sin necesidad de API key)
  private readonly weatherApiUrl = 'https://api.open-meteo.com/v1/forecast';
  private readonly geocodingApiUrl = 'https://geocoding-api.open-meteo.com/v1/search';

  constructor(private http: HttpClient) {}

  // Obtener clima por ciudad (CORREGIDO)
  getWeatherByCity(city: string): Observable<WeatherData | null> {
    // Primero obtener coordenadas de la ciudad, luego el clima
    return this.getCityCoordinates(city).pipe(
      switchMap(coords => {
        if (!coords) {
          console.warn(`Ciudad "${city}" no encontrada`);
          return of(this.getMockWeatherData(city));
        }
        // Ahora sí obtener el clima con las coordenadas
        return this.getWeatherByCoordinates(coords.lat, coords.lon, coords.name);
      }),
      catchError(error => {
        console.error('Error obteniendo clima por ciudad:', error);
        return of(this.getMockWeatherData(city));
      })
    );
  }

  // Obtener coordenadas de una ciudad
  private getCityCoordinates(city: string): Observable<{lat: number, lon: number, name: string} | null> {
    const url = `${this.geocodingApiUrl}?name=${encodeURIComponent(city)}&count=1&language=es&format=json`;

    return this.http.get<any>(url).pipe(
      map(response => {
        if (response.results && response.results.length > 0) {
          const result = response.results[0];
          return {
            lat: result.latitude,
            lon: result.longitude,
            name: result.name
          };
        }
        return null;
      }),
      catchError(error => {
        console.error('Error obteniendo coordenadas:', error);
        return of(null);
      })
    );
  }

  // Obtener clima por coordenadas
  getWeatherByCoordinates(lat: number, lon: number, cityName?: string): Observable<WeatherData | null> {
    // Parámetros para Open-Meteo
    const params = [
      `latitude=${lat}`,
      `longitude=${lon}`,
      `current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`,
      `timezone=auto`,
      `temperature_unit=celsius`,
      `wind_speed_unit=kmh`
    ].join('&');

    const url = `${this.weatherApiUrl}?${params}`;

    return this.http.get<any>(url).pipe(
      retry(1),
      map(response => this.transformWeatherData(response, cityName)),
      catchError(error => this.handleError(error, cityName))
    );
  }

  // Transformar datos de Open-Meteo a nuestro formato
  private transformWeatherData(response: any, cityName?: string): WeatherData {
    const current = response.current;
    const weatherCode = current.weather_code;

    return {
      temperature: Math.round(current.temperature_2m),
      description: this.getWeatherDescription(weatherCode),
      icon: this.getWeatherIcon(weatherCode, this.isDaytime()),
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m * 10) / 10,
      city: cityName || 'Ubicación actual',
      feelsLike: Math.round(current.apparent_temperature),
      weatherCode: weatherCode
    };
  }

  // Convertir código WMO a descripción en español
  private getWeatherDescription(code: number): string {
    const descriptions: { [key: number]: string } = {
      0: 'Despejado',
      1: 'Mayormente despejado',
      2: 'Parcialmente nublado',
      3: 'Nublado',
      45: 'Niebla',
      48: 'Niebla con escarcha',
      51: 'Llovizna ligera',
      53: 'Llovizna moderada',
      55: 'Llovizna densa',
      56: 'Llovizna helada ligera',
      57: 'Llovizna helada densa',
      61: 'Lluvia ligera',
      63: 'Lluvia moderada',
      65: 'Lluvia fuerte',
      66: 'Lluvia helada ligera',
      67: 'Lluvia helada fuerte',
      71: 'Nevada ligera',
      73: 'Nevada moderada',
      75: 'Nevada fuerte',
      77: 'Granizo',
      80: 'Chubascos ligeros',
      81: 'Chubascos moderados',
      82: 'Chubascos violentos',
      85: 'Chubascos de nieve ligeros',
      86: 'Chubascos de nieve fuertes',
      95: 'Tormenta',
      96: 'Tormenta con granizo ligero',
      99: 'Tormenta con granizo fuerte'
    };

    return descriptions[code] || 'Desconocido';
  }

  // Obtener icono según código WMO
  private getWeatherIcon(code: number, isDay: boolean): string {
    // Mapeo de códigos WMO a iconos de OpenWeatherMap (compatibilidad visual)
    const dayIcons: { [key: number]: string } = {
      0: '01d', // Despejado
      1: '02d', // Mayormente despejado
      2: '03d', // Parcialmente nublado
      3: '04d', // Nublado
      45: '50d', // Niebla
      48: '50d', // Niebla con escarcha
      51: '09d', // Llovizna
      53: '09d',
      55: '09d',
      61: '10d', // Lluvia
      63: '10d',
      65: '10d',
      71: '13d', // Nieve
      73: '13d',
      75: '13d',
      77: '13d',
      80: '09d', // Chubascos
      81: '09d',
      82: '09d',
      95: '11d', // Tormenta
      96: '11d',
      99: '11d'
    };

    const nightIcons: { [key: number]: string } = {
      0: '01n',
      1: '02n',
      2: '03n',
      3: '04n',
      45: '50n',
      48: '50n',
      51: '09n',
      53: '09n',
      55: '09n',
      61: '10n',
      63: '10n',
      65: '10n',
      71: '13n',
      73: '13n',
      75: '13n',
      77: '13n',
      80: '09n',
      81: '09n',
      82: '09n',
      95: '11n',
      96: '11n',
      99: '11n'
    };

    const iconCode = isDay
      ? (dayIcons[code] || '02d')
      : (nightIcons[code] || '02n');

    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }

  // Determinar si es de día (simplificado)
  private isDaytime(): boolean {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 20;
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse, city?: string): Observable<WeatherData | null> {
    let errorMessage = 'Error desconocido';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 404:
          errorMessage = `Ciudad "${city}" no encontrada`;
          break;
        case 429:
          errorMessage = 'Demasiadas solicitudes. Intenta más tarde.';
          break;
        case 0:
          errorMessage = 'Sin conexión a internet';
          break;
        default:
          errorMessage = `Error del servidor: ${error.status}`;
      }
    }

    console.error('Error en WeatherService:', errorMessage);

    // Retornar datos simulados como fallback
    return of(city ? this.getMockWeatherData(city) : null);
  }

  // Datos simulados para desarrollo sin conexión
  getMockWeatherData(city: string = 'Bogotá'): WeatherData {
    return {
      temperature: 18,
      description: 'Parcialmente nublado',
      icon: 'https://openweathermap.org/img/wn/02d@2x.png',
      humidity: 75,
      windSpeed: 3.5,
      city: city,
      feelsLike: 17,
      weatherCode: 2
    };
  }

  // Verificar si el clima es apropiado para delivery
  isGoodDeliveryWeather(weather: WeatherData): { suitable: boolean; message: string } {
    // Temperatura extrema
    if (weather.temperature < 0) {
      return {
        suitable: false,
        message: '❄️ Temperatura muy baja. Tiempos de entrega pueden variar.'
      };
    }

    if (weather.temperature > 35) {
      return {
        suitable: false,
        message: '🌡️ Temperatura muy alta. Tiempos de entrega pueden variar.'
      };
    }

    // Viento fuerte
    if (weather.windSpeed > 30) {
      return {
        suitable: false,
        message: '💨 Vientos fuertes. Entregas pueden retrasarse.'
      };
    }

    // Códigos de clima adverso (Open-Meteo WMO)
    const badWeatherCodes = [
      65, 67, // Lluvia fuerte
      75, 77, // Nevada fuerte, granizo
      82, // Chubascos violentos
      95, 96, 99 // Tormentas
    ];

    if (weather.weatherCode && badWeatherCodes.includes(weather.weatherCode)) {
      return {
        suitable: false,
        message: '⛈️ Mal clima. Entregas pueden retrasarse.'
      };
    }

    // Lluvia moderada o nieve
    const moderateWeatherCodes = [63, 73, 81];
    if (weather.weatherCode && moderateWeatherCodes.includes(weather.weatherCode)) {
      return {
        suitable: true,
        message: '🌧️ Lluvia moderada. Entregas operando con precaución.'
      };
    }

    return {
      suitable: true,
      message: '✅ Condiciones ideales para entrega.'
    };
  }

  // Obtener clima por geolocalización del navegador
  getWeatherByGeolocation(): Observable<WeatherData | null> {
    return new Observable(observer => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          position => {
            this.getWeatherByCoordinates(
              position.coords.latitude,
              position.coords.longitude
            ).subscribe(
              data => {
                observer.next(data);
                observer.complete();
              },
              error => {
                observer.error(error);
              }
            );
          },
          error => {
            console.error('Error obteniendo geolocalización:', error);
            observer.next(this.getMockWeatherData());
            observer.complete();
          }
        );
      } else {
        console.warn('Geolocalización no disponible');
        observer.next(this.getMockWeatherData());
        observer.complete();
      }
    });
  }
}
