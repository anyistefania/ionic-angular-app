import { Injectable } from '@angular/core';
import { Address } from '../models/models.model';

declare let google: any;

export interface MapLocation {
  lat: number;
  lng: number;
}

export interface RouteInfo {
  distance: number; // en kilómetros
  duration: number; // en minutos
  polyline?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MapsService {
  private googleMapsLoaded = false;
  private apiKey = 'YOUR_GOOGLE_MAPS_API_KEY'; // Reemplazar con API key real

  // Ubicación de la tienda (fábrica de pizza)
  private storeLocation: MapLocation = {
    lat: 4.6097, // Bogotá, Colombia (ejemplo)
    lng: -74.0817
  };

  constructor() {}

  // Cargar Google Maps API
  loadGoogleMaps(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.googleMapsLoaded) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places,geometry`;
      script.onload = () => {
        this.googleMapsLoaded = true;
        resolve();
      };
      script.onerror = () => {
        reject(new Error('Error al cargar Google Maps'));
      };
      document.head.appendChild(script);
    });
  }

  // Inicializar mapa
  async initMap(elementId: string, center: MapLocation, zoom: number = 13): Promise<any> {
    await this.loadGoogleMaps();

    const mapElement = document.getElementById(elementId);
    if (!mapElement) {
      throw new Error('Elemento del mapa no encontrado');
    }

    const map = new google.maps.Map(mapElement, {
      center: center,
      zoom: zoom,
      styles: this.getMapStyles()
    });

    return map;
  }

  // Crear marcador
  createMarker(
    map: any,
    position: MapLocation,
    title: string,
    icon?: string
  ): any {
    const markerOptions: any = {
      position: position,
      map: map,
      title: title,
      animation: google.maps.Animation.DROP
    };

    if (icon) {
      markerOptions.icon = icon;
    }

    return new google.maps.Marker(markerOptions);
  }

  // Calcular ruta entre dos puntos
  async calculateRoute(origin: MapLocation, destination: MapLocation): Promise<RouteInfo | null> {
    await this.loadGoogleMaps();

    return new Promise((resolve) => {
      const directionsService = new google.maps.DirectionsService();

      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING
        },
        (result: any, status: any) => {
          if (status === google.maps.DirectionsStatus.OK) {
            const route = result.routes[0].legs[0];
            const routeInfo: RouteInfo = {
              distance: route.distance.value / 1000, // convertir a km
              duration: route.duration.value / 60, // convertir a minutos
              polyline: result.routes[0].overview_polyline
            };
            resolve(routeInfo);
          } else {
            console.error('Error calculando ruta:', status);
            resolve(null);
          }
        }
      );
    });
  }

  // Mostrar ruta en el mapa
  async displayRoute(
    map: any,
    origin: MapLocation,
    destination: MapLocation
  ): Promise<RouteInfo | null> {
    await this.loadGoogleMaps();

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      map: map,
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: '#FF6B35',
        strokeWeight: 4
      }
    });

    return new Promise((resolve) => {
      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING
        },
        (result: any, status: any) => {
          if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);

            const route = result.routes[0].legs[0];
            const routeInfo: RouteInfo = {
              distance: route.distance.value / 1000,
              duration: route.duration.value / 60
            };
            resolve(routeInfo);
          } else {
            console.error('Error mostrando ruta:', status);
            resolve(null);
          }
        }
      );
    });
  }

  // Calcular distancia entre dos puntos (usando fórmula de Haversine)
  calculateDistance(point1: MapLocation, point2: MapLocation): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.toRad(point2.lat - point1.lat);
    const dLon = this.toRad(point2.lng - point1.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(point1.lat)) *
      Math.cos(this.toRad(point2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 100) / 100; // Redondear a 2 decimales
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Geocodificar dirección (convertir dirección a coordenadas)
  async geocodeAddress(address: Address): Promise<MapLocation | null> {
    await this.loadGoogleMaps();

    const geocoder = new google.maps.Geocoder();
    const addressString = `${address.street}, ${address.city}, ${address.state}, ${address.country}`;

    return new Promise((resolve) => {
      geocoder.geocode({ address: addressString }, (results: any[], status: any) => {
        if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng()
          });
        } else {
          console.error('Error geocodificando:', status);
          resolve(null);
        }
      });
    });
  }

  // Geocodificar coordenadas a dirección
  async reverseGeocode(location: MapLocation): Promise<Address | null> {
    await this.loadGoogleMaps();

    const geocoder = new google.maps.Geocoder();

    return new Promise((resolve) => {
      geocoder.geocode({ location: location }, (results: any[], status: any) => {
        if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
          const result = results[0];
          const address = this.parseGoogleAddress(result);
          resolve(address);
        } else {
          console.error('Error en geocodificación inversa:', status);
          resolve(null);
        }
      });
    });
  }

  // Parsear dirección de Google Maps
  private parseGoogleAddress(result: any): Address {
    const components = result.address_components;
    const address: Address = {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    };

    for (const component of components) {
      const types = component.types;

      if (types.includes('street_number') || types.includes('route')) {
        address.street += component.long_name + ' ';
      }
      if (types.includes('locality')) {
        address.city = component.long_name;
      }
      if (types.includes('administrative_area_level_1')) {
        address.state = component.long_name;
      }
      if (types.includes('postal_code')) {
        address.zipCode = component.long_name;
      }
      if (types.includes('country')) {
        address.country = component.long_name;
      }
    }

    address.street = address.street.trim();
    return address;
  }

  // Obtener ubicación de la tienda
  getStoreLocation(): MapLocation {
    return this.storeLocation;
  }

  // Establecer ubicación de la tienda
  setStoreLocation(location: MapLocation): void {
    this.storeLocation = location;
  }

  // Calcular costo de delivery basado en distancia
  calculateDeliveryFee(distance: number, baseFee: number = 2, perKmFee: number = 0.5): number {
    const fee = baseFee + (distance * perKmFee);
    return Math.round(fee * 100) / 100;
  }

  // Verificar si está dentro del radio de delivery
  isWithinDeliveryRadius(destination: MapLocation, maxRadius: number = 10): boolean {
    const distance = this.calculateDistance(this.storeLocation, destination);
    return distance <= maxRadius;
  }

  // Estilos personalizados del mapa
  private getMapStyles(): any[] {
    return [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'transit',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ];
  }

  // Obtener ubicación actual del usuario
  getCurrentLocation(): Promise<MapLocation> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalización no soportada'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }
}
