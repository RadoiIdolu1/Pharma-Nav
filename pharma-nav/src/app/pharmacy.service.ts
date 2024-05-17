import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pharmacy } from './pharmacy';

import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PharmacyService {

  constructor(private firestore: AngularFirestore) { }

  // Function to check if the entered email exists in the pharmacies Firestore collection
  validatePharmacyEmail(email: string): Observable<boolean> {
    return this.firestore.collection('pharmacies', ref => ref.where('email', '==', email)).valueChanges()
      .pipe(
        map(pharmacies => pharmacies.length > 0) // Returns true if there is at least one pharmacy with the entered email
      );
  }

   // Method to get all pharmacies
   getAllPharmacies(): Observable<Pharmacy[]> {
    return this.firestore.collection<Pharmacy>('pharmacies').valueChanges();
  }

  getPharmacyById(pharmacyId: number): Observable<Pharmacy> {
    return this.firestore.doc<Pharmacy>(`pharmacies/${pharmacyId}`).valueChanges().pipe(
      map((pharmacy: Pharmacy | undefined) => {
        if (!pharmacy) {
          throw new Error(`Pharmacy with ID ${pharmacyId} not found`);
        }
        return pharmacy;
      })
    );
  }

  addPharmacy(pharmacy: Pharmacy): Promise<void> {
    return this.firestore.collection('pharmacies').doc(pharmacy.id.toString()).get().toPromise().then((doc) => {
      if (doc && doc.exists) {
        throw new Error(`Pharmacy with ID ${pharmacy.id} already exists`);
      } else {
        return this.firestore.collection('pharmacies').doc(pharmacy.id.toString()).set(pharmacy);
      }
    }).catch((error) => {
      return Promise.reject('Error occurred while adding pharmacy: ' + error);
    });
  }

  // Method to update an existing pharmacy
  updatePharmacy(pharmacy: Pharmacy): Observable<void> {
    return from(this.firestore.collection('pharmacies').doc(pharmacy.id.toString()).update(pharmacy).then(() => {}));
  }

  deletePharmacy(pharmacyId: number): Observable<void> {
    return new Observable<void>((observer) => {
      this.firestore.collection('pharmacies').doc(pharmacyId.toString()).ref.get().then((doc) => {
        if (!doc.exists) {
          observer.error(`Pharmacy with ID ${pharmacyId} does not exist`);
        } else {
          this.firestore.collection('pharmacies').doc(pharmacyId.toString()).delete().then(() => {
            observer.next();
            observer.complete();
          }).catch((error) => {
            observer.error('Error occurred while deleting pharmacy: ' + error);
          });
        }
      }).catch((error) => {
        observer.error('Error occurred while fetching pharmacy: ' + error);
      });
    });
  }
}
