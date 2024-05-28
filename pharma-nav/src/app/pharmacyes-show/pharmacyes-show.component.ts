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

  logo : string = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReu_4IlhD_JloBZexbk-GaTDdXrs7HLb3lLg&s";

  private subscriptions: Subscription[] = [];
https: any;

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

  reserve(id: any): void {
    console.log(id)
  }

  showLocation(latitude: any, longitude: any): void {
      console.log(latitude + longitude);
  }
}
