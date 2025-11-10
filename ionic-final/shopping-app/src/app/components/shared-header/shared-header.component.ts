import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { User } from '../../models/models.model';

@Component({
  selector: 'app-shared-header',
  templateUrl: './shared-header.component.html',
  styleUrls: ['./shared-header.component.scss'],
   standalone:false
})
export class SharedHeaderComponent implements OnInit {
  @Input() title: string = 'MakePizza';
  @Input() showBackButton: boolean = false;
  @Input() defaultHref: string = '/pizzas';
  @Input() showCart: boolean = true;
  @Input() showProfile: boolean = true;

  user: User | null = null;
  cartItemCount: number = 0;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    // Suscribirse a cambios del usuario en tiempo real
    this.authService.userData$.subscribe(userData => {
      this.user = userData;
    });

    // Suscribirse a cambios del carrito en tiempo real
    this.cartService.cart$.subscribe(() => {
      this.cartItemCount = this.cartService.getTotalItems();
    });
  }

  getUserPhoto(): string {
    return this.user?.photoURL || 'assets/default-avatar.png';
  }

  getUserInitials(): string {
    if (!this.user) return '?';
    const names = this.user.displayName.split(' ');
    if (names.length >= 2) {
      return names[0][0].toUpperCase() + names[1][0].toUpperCase();
    }
    return this.user.displayName[0]?.toUpperCase() || '?';
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
