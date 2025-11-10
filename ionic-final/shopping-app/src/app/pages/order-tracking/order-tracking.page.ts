import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Declaración simple para TypeScript
declare var google: any;

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.page.html',
  styleUrls: ['./order-tracking.page.scss'],
  standalone: false
})
export class OrderTrackingPage implements OnInit {
  @ViewChild('map', { static: false }) mapElement!: ElementRef;

  order: any;
  map: any;  // Cambiar a 'any'
  deliveryMarker: any;  // Cambiar a 'any'
  customerMarker: any;  // Cambiar a 'any'

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.loadOrder();
  }

  ionViewDidEnter() {
    if (this.order) {
      this.initMap();
    }
  }

  loadOrder() {
    // Tu lógica para cargar la orden
    this.order = {
      id: '12345678',
      status: 'En camino',
      total: 45.50,
      deliveryAddress: {
        street: 'Calle 123',
        city: 'Bogotá',
        lat: 4.6097,
        lng: -74.0817
      },
      deliveryPerson: {
        name: 'Juan Pérez',
        currentLat: 4.6150,
        currentLng: -74.0750
      }
    };
  }

  async initMap(): Promise<void> {
    try {
      // Remover los type assertions (as google.maps.MapsLibrary)
      const { Map } = await google.maps.importLibrary("maps");
      const { Marker } = await google.maps.importLibrary("marker");

      const customerLocation = {
        lat: this.order.deliveryAddress.lat,
        lng: this.order.deliveryAddress.lng
      };

      const deliveryLocation = {
        lat: this.order.deliveryPerson.currentLat,
        lng: this.order.deliveryPerson.currentLng
      };

      // Crear el mapa
      this.map = new Map(this.mapElement.nativeElement, {
        center: customerLocation,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      });

      // Marcador del cliente (destino)
      this.customerMarker = new Marker({
        position: customerLocation,
        map: this.map,
        title: 'Dirección de entrega',
      });

      // Marcador del repartidor
      this.deliveryMarker = new Marker({
        position: deliveryLocation,
        map: this.map,
        title: `Repartidor: ${this.order.deliveryPerson.name}`,
      });

      // Ajustar el zoom para mostrar ambos marcadores
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(customerLocation);
      bounds.extend(deliveryLocation);
      this.map.fitBounds(bounds, { padding: 50 });

      // Opcional: Dibujar ruta
      await this.drawRoute(deliveryLocation, customerLocation);

    } catch (error) {
      console.error('Error al inicializar el mapa:', error);
    }
  }

  async drawRoute(origin: any, destination: any): Promise<void> {
    try {
      // Remover el type assertion (as google.maps.RoutesLibrary)
      const { DirectionsService, DirectionsRenderer } =
        await google.maps.importLibrary("routes");

      const directionsService = new DirectionsService();
      const directionsRenderer = new DirectionsRenderer({
        map: this.map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#4285F4',
          strokeWeight: 4
        }
      });

      directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
      }, (response: any, status: any) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(response);
        } else {
          console.error('Error al calcular la ruta:', status);
        }
      });
    } catch (error) {
      console.error('Error al dibujar la ruta:', error);
    }
  }

  // Opcional: Método para actualizar la ubicación del repartidor en tiempo real
  updateDeliveryLocation(newLat: number, newLng: number) {
    if (this.deliveryMarker) {
      const newPosition = { lat: newLat, lng: newLng };
      this.deliveryMarker.setPosition(newPosition);

      const customerLocation = {
        lat: this.order.deliveryAddress.lat,
        lng: this.order.deliveryAddress.lng
      };
      this.drawRoute(newPosition, customerLocation);
    }
  }
}
