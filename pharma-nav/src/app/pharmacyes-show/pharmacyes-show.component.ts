import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Pharmacy } from '../pharmacy'; // Ensure this import is correct

@Component({
  selector: 'app-pharmacyes-show',
  templateUrl: './pharmacyes-show.component.html',
  styleUrls: ['./pharmacyes-show.component.css']
})
export class PharmacyesShowComponent implements OnInit, OnDestroy {
  pharmacies: Pharmacy[] = [];
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    const data = localStorage.getItem('searchedPharmacies');
    if (data) {
      this.pharmacies = JSON.parse(data);
    } else {
      console.error('No pharmacies found in localStorage.');
    }
    // Example of adding a subscription (if you have any)
    // this.subscriptions.push(someObservable.subscribe());
  }

  ngOnDestroy(): void {
    console.log('PharmacyesShowComponent destroyed');
    localStorage.setItem('searchedPharmacies', '');
    this.subscriptions.forEach(sub => sub.unsubscribe());
    
  }
}
