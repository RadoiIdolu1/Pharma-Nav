import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Pharmacy } from '../pharmacy'; // Ensure this import is correct
import tt from '@tomtom-international/web-sdk-maps';

@Component({
  selector: 'app-pharmacyes-show',
  templateUrl: './pharmacyes-show.component.html',
  styleUrls: ['./pharmacyes-show.component.css']
})
export class PharmacyesShowComponent implements OnInit, OnDestroy {
  pharmacies: Pharmacy[] = [];
  selectedPharmacy: Pharmacy | null = null;

  logo : string = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReu_4IlhD_JloBZexbk-GaTDdXrs7HLb3lLg&s";

  private subscriptions: Subscription[] = [];

  showMap : boolean = false;


  ngOnInit(): void {
    const data = localStorage.getItem('searchedPharmacies');
    if (data) {
      this.pharmacies = JSON.parse(data);
    } else {
      console.error('No pharmacies found in localStorage.');
    }

  }

  ngOnDestroy(): void {
    console.log('PharmacyesShowComponent destroyed');
    localStorage.setItem('searchedPharmacies', '');
    this.subscriptions.forEach(sub => sub.unsubscribe());
    
  }

  reserve(id: any): void {
    console.log(id)
  }

  toggleMap(pharmacy?: Pharmacy): void {
    this.selectedPharmacy = pharmacy || null;
    if (pharmacy) {
      this.showMap = true;
      // Use Angular's change detection to wait until the view updates
      setTimeout(() => this.initMap(pharmacy.latitude, pharmacy.longitude, pharmacy.id), 0);
    } else {
      this.showMap = false;
    }
}


initMap(latitude: number, longitude: number, id: number): void {
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    console.error('Invalid latitude or longitude values:', latitude, longitude);
    return;
  }

  const mapId = `map-${id}`; // Ensure this element exists in the DOM
  const map = tt.map({
    key: '15cJaoNM8GWft0mMutIwuoiltGN8gAuO',
    container: mapId,
    center: [longitude, latitude],
    zoom: 15
  });
  map.on('load', () => {
    console.log('Map loaded successfully.');
  });
}

}
