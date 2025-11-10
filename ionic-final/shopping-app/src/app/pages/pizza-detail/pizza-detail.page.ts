import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pizza } from '../../models/models.model';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-pizza-detail',
  templateUrl: './pizza-detail.page.html',
  styleUrls: ['./pizza-detail.page.scss'],
   standalone:false
})
export class PizzaDetailPage implements OnInit {
  pizza: Pizza | null = null;

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.firestoreService.getPizza(id).subscribe(pizza => {
        this.pizza = pizza;
      });
    }
  }
}
