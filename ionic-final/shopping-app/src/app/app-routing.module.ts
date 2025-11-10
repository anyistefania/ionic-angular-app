import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'pizzas',
    pathMatch: 'full'
  },
  // Rutas públicas
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule)
  },
  // Rutas protegidas - MakePizza
  {
    path: 'pizzas',
    loadChildren: () => import('./pages/pizzas/pizzas.module').then(m => m.PizzasPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'pizza/:id',
    loadChildren: () => import('./pages/pizza-detail/pizza-detail.module').then(m => m.PizzaDetailPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'custom-pizza',
    loadChildren: () => import('./pages/custom-pizza/custom-pizza.module').then(m => m.CustomPizzaPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'drinks',
    loadChildren: () => import('./pages/drinks/drinks.module').then(m => m.DrinksPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'cart',
    loadChildren: () => import('./pages/cart/cart.module').then(m => m.CartPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'checkout',
    loadChildren: () => import('./pages/checkout/checkout.module').then(m => m.CheckoutPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'orders',
    loadChildren: () => import('./pages/orders/orders.module').then(m => m.OrdersPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'order-tracking/:id',
    loadChildren: () => import('./pages/order-tracking/order-tracking.module').then(m => m.OrderTrackingPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule),
    canActivate: [AuthGuard]
  },
  // Rutas de administrador
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminPageModule),
    canActivate: [AuthGuard]
  },
  // Rutas legacy (compatibilidad)
  {
    path: 'products',
    redirectTo: 'pizzas',
    pathMatch: 'full'
  },
  {
    path: 'product-detail/:id',
    redirectTo: 'pizza/:id',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}