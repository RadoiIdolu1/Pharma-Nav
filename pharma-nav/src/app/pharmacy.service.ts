import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { first, map } from 'rxjs/operators';
import { Pharmacy } from './pharmacy';
import { Router } from '@angular/router';
import { Medicine } from './medicine';

@Injectable({
  providedIn: 'root'
})
export class PharmacyService {
  
  authStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private fireauth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {
   
  }

  validatePharmacyEmail(email: string): Observable<boolean> {
    return this.firestore.collection('pharmacies', ref => ref.where('email', '==', email)).valueChanges()
      .pipe(
        map(pharmacies => pharmacies.length > 0)
      );
  }

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
    const password = generateStrongPassword();
    pharmacy.password = password;
    const content = `Email: ${pharmacy.email}\nPassword: ${password}`;
    const filename = `${pharmacy.email}_credentials.txt`;

    return this.firestore.collection('pharmacies').doc(pharmacy.id.toString()).get().toPromise().then((doc) => {
      if (doc && doc.exists) {
        throw new Error(`Pharmacy with ID ${pharmacy.id} already exists`);
      } else {
            downloadFile(content, filename);
            return this.firestore.collection('pharmacies').doc(pharmacy.id.toString()).set(pharmacy);
      }
    }).catch((error) => {
      return Promise.reject('Error occurred while adding pharmacy: ' + error);
    });
  }

  updatePharmacy(pharmacy: Pharmacy): Observable<void> {
    return new Observable<void>((observer) => {
      this.firestore.collection('pharmacies').doc(pharmacy.id.toString()).ref.get().then((doc) => {
        if (!doc.exists) {
          observer.error(`Pharmacy with ID ${pharmacy.id} does not exist`);
        } else {
          this.firestore.collection('pharmacies').doc(pharmacy.id.toString()).update(pharmacy).then(() => {
            observer.next();
            observer.complete();
          }).catch((error) => {
            observer.error('Error occurred while updating pharmacy: ' + error);
          });
        }
      }).catch((error) => {
        observer.error('Error occurred while fetching pharmacy: ' + error);
      });
    });
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

  login(email: string, password: string): void {
    this.firestore.collection('pharmacies', ref => ref.where('email', '==', email).where('password', '==', password))
      .get().pipe(
        first(),
        map(snapshot => {
          if (!snapshot.empty) {
            const pharmacyData = snapshot.docs[0].data();
            localStorage.setItem('token', 'true');
            localStorage.setItem('role', 'pharmacy');
            localStorage.setItem('pharmacyId', snapshot.docs[0].id);  // Store the pharmacy ID
            this.authStatus.next(true);
            this.router.navigate(['pharmacy_dashboard']);
          } else {
            alert('Invalid email or password');
            this.router.navigate(['/login']);
          }
        })
      ).subscribe();
  }

  logout(): void {
    // Clear the local storage data used for session management
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.authStatus.next(false); // Update the BehaviorSubject to reflect logged out status
  
    // Redirect to the login page
    this.router.navigate(['/home']);
  }
  

  isAuthenticated(): boolean {
    return localStorage.getItem('token') === 'true';
  }

  setAuthenticated(auth: boolean): void {
    this.authStatus.next(auth);
  }

   checkAuthentication(): void {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role === 'pharmacy') {
      this.setAuthenticated(true);
      this.router.navigate(['pharmacy_dashboard']);
    } else {
      this.router.navigate(['']);
    }
  }

  //MEDICINES

  addMedicineToCurrentPharmacy(medicine: Medicine): Promise<void> {
    const pharmacyId = localStorage.getItem('pharmacyId');
    if (!pharmacyId) {
      return Promise.reject('No pharmacy logged in.');
    }
    const pharmacyDocRef = this.firestore.collection('pharmacies').doc(pharmacyId);
  
    return this.firestore.firestore.runTransaction(transaction => {
      return transaction.get(pharmacyDocRef.ref).then(doc => {
        if (!doc.exists) {
          throw "Document does not exist!";
        }
        const pharmacy = doc.data() as Pharmacy;
        const existingMedicine = pharmacy.meds.find(m => m.id === medicine.id);
        if (existingMedicine) {
          throw 'Medicine with this ID already exists.';
        }
        const updatedMedicines = [...pharmacy.meds, medicine];
        transaction.update(pharmacyDocRef.ref, { meds: updatedMedicines });
      });
    })
    .then(() => console.log('Medicine added successfully'))
    .catch(error => Promise.reject('Failed to add medicine: ' + error));
  }


  deleteMedicineById(medicineId: string): Promise<void> {
    const pharmacyId = localStorage.getItem('pharmacyId');
    if (!pharmacyId) {
        return Promise.reject('No pharmacy logged in.');
    }
    // Convert the numeric medicineId to a string for consistent comparison.
    const medicineIdStr = medicineId.toString();
    const pharmacyDocRef = this.firestore.collection('pharmacies').doc(pharmacyId);

    return this.firestore.firestore.runTransaction(transaction => {
        return transaction.get(pharmacyDocRef.ref).then(doc => {
            if (!doc.exists) {
                throw new Error('Pharmacy record does not exist.');
            }

            
            const pharmacy = doc.data() as Pharmacy;
           

            const updatedMedicines = pharmacy.meds.filter(med => String(med.id) !== medicineId);
            
            if (pharmacy.meds.length === updatedMedicines.length) {
                throw new Error('Medicine with the specified ID does not exist.');
            }
            transaction.update(pharmacyDocRef.ref, { meds: updatedMedicines });
        });
    })
    .then(() => console.log('Medicine deleted successfully'))
    .catch(error => Promise.reject(new Error('Failed to delete medicine: ' + error.message)));
  }


  editMedicine(updatedMedicine: Medicine): Promise<void> {
    const pharmacyId = localStorage.getItem('pharmacyId');
    if (!pharmacyId) {
        return Promise.reject('No pharmacy is currently logged in.');
    }

    // Ensure the ID is treated as a string
    const medicineId = String(updatedMedicine.id);

    const pharmacyDocRef = this.firestore.collection('pharmacies').doc(pharmacyId);

    return this.firestore.firestore.runTransaction(async (transaction) => {
        const pharmacyDoc = await transaction.get(pharmacyDocRef.ref);
        if (!pharmacyDoc.exists) {
            throw new Error('Pharmacy not found.');
        }
        const pharmacy = pharmacyDoc.data() as Pharmacy;
        const medicines = pharmacy.meds;
        const medicineIndex = medicines.findIndex(med => String(med.id) === medicineId);

        if (medicineIndex === -1) {
            throw new Error('Medicine not found.');
        }

        // Construct a new array with the updated medicine
        const newMedicines = medicines.map(med => String(med.id) === medicineId ? { ...med, ...updatedMedicine } : med);

        // Update the specific medicine in the array
        transaction.update(pharmacyDocRef.ref, { meds: newMedicines });
    })
    .then(() => console.log('Medicine updated successfully'))
    .catch(error => Promise.reject(new Error('Failed to update medicine: ' + error.message)));
  }

  getMedicines(): Observable<Medicine[]> {
    const pharmacyId = localStorage.getItem('pharmacyId');
    if (!pharmacyId) {
      throw new Error('No pharmacy is currently logged in.');
    }
    return this.firestore.doc<Pharmacy>(`pharmacies/${pharmacyId}`).valueChanges().pipe(
      map(pharmacy => pharmacy ? pharmacy.meds : [])
    );
  }

  
  
}


function generateStrongPassword(): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  const passwordLength = 12;
  let password = "";
  for (let i = 0, n = charset.length; i < passwordLength; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  return password;
}

function downloadFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
function logout() {
  throw new Error('Function not implemented.');
}

