import { Injectable } from '@angular/core';
import { Order, PaymentInfo } from '../models/models.model';

declare let paypal: any;

export interface PayPalConfig {
  clientId: string;
  currency: string;
  env: 'sandbox' | 'production';
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private paypalConfig: PayPalConfig = {
    clientId: 'AZSr6dXWyGX4Q_yAqpNjHA_dsrFWAUPfQvpj4JlDeZql5blp2y9Zt_MYMZj8oqMS-6jLMEUFDj6ijgi_', // Reemplazar con Client ID real
    currency: 'USD',
    env: 'sandbox' // Cambiar a 'production' para producción
  };

  private paypalLoaded = false;

  constructor() {}

  // Cargar script de PayPal
  loadPayPalScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.paypalLoaded) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${this.paypalConfig.clientId}&currency=${this.paypalConfig.currency}`;
      script.onload = () => {
        this.paypalLoaded = true;
        resolve();
      };
      script.onerror = () => {
        reject(new Error('Error al cargar PayPal SDK'));
      };
      document.body.appendChild(script);
    });
  }

  // Renderizar botón de PayPal
  async renderPayPalButton(
    elementId: string,
    order: Order,
    onSuccess: (paymentInfo: PaymentInfo) => void,
    onError: (error: any) => void
  ): Promise<void> {
    try {
      await this.loadPayPalScript();

      const paypalButtonContainer = document.getElementById(elementId);
      if (!paypalButtonContainer) {
        throw new Error('Elemento de PayPal no encontrado');
      }

      // Limpiar contenedor
      paypalButtonContainer.innerHTML = '';

      if (typeof paypal === 'undefined') {
        throw new Error('PayPal SDK no cargado');
      }

      paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: order.total.toFixed(2),
                currency_code: this.paypalConfig.currency
              },
              description: `Orden #${order.id || 'Nueva'} - MakePizza`
            }]
          });
        },
        onApprove: async (data: any, actions: any) => {
          const orderData = await actions.order.capture();

          const paymentInfo: PaymentInfo = {
            method: 'paypal',
            transactionId: orderData.id,
            status: 'completed',
            amount: order.total,
            currency: this.paypalConfig.currency,
            paidAt: new Date()
          };

          onSuccess(paymentInfo);
        },
        onError: (err: any) => {
          console.error('Error en PayPal:', err);
          onError(err);
        },
        onCancel: () => {
          onError(new Error('Pago cancelado por el usuario'));
        }
      }).render(`#${elementId}`);

    } catch (error) {
      console.error('Error renderizando botón PayPal:', error);
      onError(error);
    }
  }

  // Procesar pago con tarjeta (simulado)
  async processCardPayment(
    cardNumber: string,
    expiryDate: string,
    cvv: string,
    amount: number
  ): Promise<PaymentInfo> {
    // En producción, esto debe integrar un procesador de pagos real
    // Por ahora simulamos el proceso

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Validación básica de número de tarjeta (Luhn algorithm simplificado)
        const isValid = this.validateCardNumber(cardNumber);

        if (isValid) {
          const paymentInfo: PaymentInfo = {
            method: 'card',
            transactionId: `TXN-${Date.now()}`,
            status: 'completed',
            amount: amount,
            currency: 'USD',
            paidAt: new Date()
          };
          resolve(paymentInfo);
        } else {
          reject(new Error('Número de tarjeta inválido'));
        }
      }, 2000); // Simular latencia de red
    });
  }

  // Validar número de tarjeta (algoritmo de Luhn simplificado)
  private validateCardNumber(cardNumber: string): boolean {
    // Eliminar espacios y guiones
    const cleaned = cardNumber.replace(/[\s-]/g, '');

    // Verificar que solo contiene números
    if (!/^\d+$/.test(cleaned)) {
      return false;
    }

    // Verificar longitud (13-19 dígitos)
    if (cleaned.length < 13 || cleaned.length > 19) {
      return false;
    }

    // Algoritmo de Luhn
    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return (sum % 10) === 0;
  }

  // Formatear número de tarjeta
  formatCardNumber(cardNumber: string): string {
    const cleaned = cardNumber.replace(/[\s-]/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  }

  // Obtener tipo de tarjeta
  getCardType(cardNumber: string): string {
    const cleaned = cardNumber.replace(/[\s-]/g, '');

    if (/^4/.test(cleaned)) return 'Visa';
    if (/^5[1-5]/.test(cleaned)) return 'Mastercard';
    if (/^3[47]/.test(cleaned)) return 'American Express';
    if (/^6(?:011|5)/.test(cleaned)) return 'Discover';

    return 'Desconocida';
  }

  // Verificar estado de pago
  async verifyPayment(transactionId: string): Promise<boolean> {
    // En producción, esto consultaría la API de PayPal o el procesador de pagos
    // Por ahora retornamos true para simular verificación exitosa
    return new Promise(resolve => {
      setTimeout(() => resolve(true), 1000);
    });
  }

  // Crear pago simulado para desarrollo
  createMockPayment(amount: number): PaymentInfo {
    return {
      method: 'paypal',
      transactionId: `MOCK-${Date.now()}`,
      status: 'completed',
      amount: amount,
      currency: 'USD',
      paidAt: new Date()
    };
  }
}
