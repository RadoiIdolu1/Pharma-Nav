import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Medicine } from '../medicine';
import { Pharmacy } from '../pharmacy'; // Import the Pharmacy interface
import { PharmacyService } from '../pharmacy.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar for displaying error messages

  


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  showAddPharmacyForm: boolean = false;
  showRemovePharmacyForm: boolean = false;
  showEditPharmacyForm: boolean = false;
  showAllPharmaciesList: boolean = false;
  isLoading: boolean = false; // Track loading state
  newPharmacy: Pharmacy = {} as Pharmacy; // Use Pharmacy interface and cast to Pharmacy
  editedPharmacy: Pharmacy = {} as Pharmacy; // Use Pharmacy interface and cast to Pharmacy
  pharmacyIdToRemove: number = 0;
  pharmacyIdToEdit: string = '';
  allPharmacies: MatTableDataSource<Pharmacy>;
  displayedColumns: string[] = ['id', 'name', 'email', 'latitude', 'longitude', 'meds'];

  constructor(private firestore: AngularFirestore, private pharmacyserv: PharmacyService, private snackBar : MatSnackBar) {
    
    this.allPharmacies = new MatTableDataSource<Pharmacy>([]);
  }

  showAddForm() {
    this.resetForms();
    this.showAddPharmacyForm = true;
  }

  showRemoveForm() {
    this.resetForms();
    this.showRemovePharmacyForm = true;
  }

  showEditForm() {
    this.resetForms();
    this.showEditPharmacyForm = true;
  }

  showAllPharmacies() {
    this.resetForms();
    this.showAllPharmaciesList = true;
    this.getAllPharmacies();
  }

  addPharmacy() {
    this.newPharmacy.meds = []  as Medicine [];
    
    this.pharmacyserv.addPharmacy(this.newPharmacy)
    .then(() => {
      console.log('Pharmacy added successfully!');
      this.newPharmacy = {} as Pharmacy; // Reset newPharmacy
    })
    .catch((error) => {
      console.error('Error adding pharmacy: ', error);
    });

  }

  removePharmacy() : void  {
    this.pharmacyserv.deletePharmacy(this.pharmacyIdToRemove)
      .subscribe(
        () => {
          this.snackBar.open('Pharmacy deleted successfully', 'Close', { duration: 3000 });
          // Optionally, perform any other actions after successful deletion
        },
        (error: string) => {
          this.snackBar.open(error, 'Close', { duration: 3000 });
          console.error('Error deleting pharmacy:', error);
        }
      );
  }

  editPharmacy() {
    this.firestore.doc('/pharmacies/' + this.pharmacyIdToEdit).update(this.editedPharmacy)
      .then(() => {
        console.log('Pharmacy updated successfully!');
        this.editedPharmacy = {} as Pharmacy; // Reset editedPharmacy
        this.pharmacyIdToEdit = '';
      })
      .catch((error) => {
        console.error('Error updating pharmacy: ', error);
      });
  }

  getAllPharmacies() {
    this.isLoading = true; // Set loading state to true before fetching data
    this.firestore.collection('pharmacies').valueChanges().subscribe(data => {
      this.allPharmacies = new MatTableDataSource<Pharmacy>(data as Pharmacy[]);
      this.isLoading = false; // Set loading state to false after data is fetched
    });
  }

  resetForms() {
    this.showAddPharmacyForm = false;
    this.showRemovePharmacyForm = false;
    this.showEditPharmacyForm = false;
    this.showAllPharmaciesList = false;
  }
}
