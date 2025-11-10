import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../models/models.model';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.page.html',
  styleUrls: ['./order-tracking.page.scss'],
})
export class OrderTrackingPage implements OnInit {
  order: Order | null = null;

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.firestoreService.getOrder(id).subscribe(order => {
        this.order = order;
      });
    }
  }
}
