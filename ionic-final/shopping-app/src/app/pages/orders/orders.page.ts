import { Component, OnInit } from '@angular/core';
import { Order } from '../../models/models.model';
import { FirestoreService } from '../../services/firestore.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  orders: Order[] = [];

  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.firestoreService.getUserOrders(user.uid).subscribe(orders => {
        this.orders = orders;
      });
    }
  }
}
