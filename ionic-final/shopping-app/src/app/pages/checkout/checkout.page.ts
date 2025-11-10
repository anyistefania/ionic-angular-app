import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { Order, Address, PaymentInfo, CartItem } from '../../models/models.model';
import { CartService } from '../../services/cart.service';
import { PaymentService } from '../../services/payment.service';
import { FirestoreService } from '../../services/firestore.service';
import { AuthService } from '../../services/auth.service';
import { MapsService } from '../../services/maps.service';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit, AfterViewInit {
  addressForm: FormGroup;
  cartItems: CartItem[] = [];
  subtotal: number = 0;
  deliveryFee: number = 0;
  total: number = 0;
  deliveryAddress: Address | null = null;
  weather: any = null;
  paymentMethod: 'paypal' | 'mock' = 'mock';

  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private paymentService: PaymentService,
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private mapsService: MapsService,
    private weatherService: WeatherService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    this.addressForm = this.formBuilder.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['Colombia', Validators.required]
    });
  }

  ngOnInit() {
    // Verificar que hay items en el carrito
    if (this.cartService.isEmpty()) {
      this.router.navigate(['/cart']);
      return;
    }

    this.cartItems = this.cartService.getCartItems();
    this.subtotal = this.cartService.getSubtotal();
    this.deliveryFee = this.cartService.getDeliveryFee();
    this.total = this.cartService.getTotal();
    this.deliveryAddress = this.cartService.getDeliveryAddress();

    // Prellenar formulario si ya hay dirección
    if (this.deliveryAddress) {
      this.addressForm.patchValue(this.deliveryAddress);
    }

    // Obtener clima
    this.weatherService.getWeatherByCity('Bogotá').subscribe(weather => {
      if (weather) {
        this.weather = weather;
      }
    });
  }

  ngAfterViewInit() {
    // Inicializar PayPal si se selecciona
    if (this.paymentMethod === 'paypal') {
      this.initPayPal();
    }
  }

  async calculateDelivery() {
    if (!this.addressForm.valid) {
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Calculando costo de envío...'
    });
    await loading.present();

    try {
      const address: Address = this.addressForm.value;

      // Geocodificar dirección
      const location = await this.mapsService.geocodeAddress(address);

      if (!location) {
        throw new Error('No se pudo geocodificar la dirección');
      }

      // Calcular distancia
      const storeLocation = this.mapsService.getStoreLocation();
      const distance = this.mapsService.calculateDistance(storeLocation, location);

      // Calcular costo de delivery
      const fee = this.mapsService.calculateDeliveryFee(distance, 2, 0.5);

      // Actualizar dirección con coordenadas
      address.latitude = location.lat;
      address.longitude = location.lng;

      // Guardar en carrito
      this.cartService.setDeliveryAddress(address);
      this.cartService.setDeliveryFee(fee);

      this.deliveryAddress = address;
      this.deliveryFee = fee;
      this.total = this.subtotal + fee;

      await loading.dismiss();
    } catch (error) {
      await loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo calcular el costo de envío. Verifica la dirección.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  changePaymentMethod(method: string | undefined) {
    if (method === 'paypal' || method === 'mock') {
      this.paymentMethod = method;
      if (method === 'paypal') {
        setTimeout(() => this.initPayPal(), 100);
      }
    }
  }

  async initPayPal() {
    if (!this.deliveryAddress) {
      return;
    }

    const order = this.createOrder();

    try {
      await this.paymentService.renderPayPalButton(
        'paypal-button-container',
        order,
        async (paymentInfo) => {
          await this.onPaymentSuccess(paymentInfo);
        },
        (error) => {
          this.onPaymentError(error);
        }
      );
    } catch (error) {
      console.error('Error inicializando PayPal:', error);
    }
  }

  async processMockPayment() {
    if (!this.deliveryAddress || !this.addressForm.valid) {
      const alert = await this.alertController.create({
        header: 'Información Incompleta',
        message: 'Por favor completa la dirección de entrega',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Procesando pago...'
    });
    await loading.present();

    // Simular procesamiento
    setTimeout(async () => {
      const paymentInfo = this.paymentService.createMockPayment(this.total);
      await this.onPaymentSuccess(paymentInfo);
      await loading.dismiss();
    }, 2000);
  }

  async onPaymentSuccess(paymentInfo: PaymentInfo) {
    const loading = await this.loadingController.create({
      message: 'Creando orden...'
    });
    await loading.present();

    try {
      const order = this.createOrder();
      order.payment = paymentInfo;
      order.status = 'paid';

      const result = await this.firestoreService.createOrder(order);

      await loading.dismiss();

      if (result.success) {
        // Limpiar carrito
        this.cartService.clearCart();

        // Mostrar confirmación
        const alert = await this.alertController.create({
          header: '¡Pedido Confirmado!',
          message: `Tu pedido #${result.id} ha sido confirmado. Tiempo estimado: 30-45 minutos`,
          buttons: [
            {
              text: 'Ver Seguimiento',
              handler: () => {
                this.router.navigate(['/order-tracking', result.id]);
              }
            }
          ]
        });
        await alert.present();
      }
    } catch (error) {
      await loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo crear la orden. Intenta nuevamente.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async onPaymentError(error: any) {
    const alert = await this.alertController.create({
      header: 'Error en el Pago',
      message: error.message || 'Hubo un error procesando el pago',
      buttons: ['OK']
    });
    await alert.present();
  }

  createOrder(): Order {
    const user = this.authService.getCurrentUser();
    const userData = this.authService.getUserData();

    return {
      userId: user?.uid || '',
      userName: userData?.displayName || '',
      userEmail: userData?.email || '',
      items: this.cartItems,
      deliveryAddress: this.deliveryAddress!,
      subtotal: this.subtotal,
      deliveryFee: this.deliveryFee,
      total: this.total,
      status: 'pending',
      createdAt: new Date()
    };
  }

  getItemName(item: CartItem): string {
    if (item.type === 'custom-pizza') {
      return 'Pizza Personalizada';
    } else if (item.type === 'predefined-pizza') {
      return (item.item as any).name;
    } else {
      return (item.item as any).name;
    }
  }
}
