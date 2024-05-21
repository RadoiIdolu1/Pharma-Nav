import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Medicine } from '../medicine';
import { Pharmacy } from '../pharmacy';
import { PharmacyService } from '../pharmacy.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  isLoading: boolean = false;
  newPharmacy: Pharmacy = {} as Pharmacy;
  editedPharmacy: Pharmacy = {} as Pharmacy;
  pharmacyIdToRemove: number = 0;
  pharmacyIdToEdit: string = '';
  allPharmacies: MatTableDataSource<Pharmacy>;
  displayedColumns: string[] = ['id', 'name', 'email', 'latitude', 'longitude', 'meds'];

  constructor(private firestore: AngularFirestore, private pharmacyService: PharmacyService, private snackBar: MatSnackBar) {
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
    this.newPharmacy.meds = [] as Medicine[];

    this.pharmacyService.addPharmacy(this.newPharmacy)
      .then(() => {
        console.log('Pharmacy added successfully!');
        this.newPharmacy = {} as Pharmacy;
        this.snackBar.open('Pharmacy added successfully', 'Close', { duration: 3000 });
      })
      .catch((error) => {
        console.error('Error adding pharmacy: ', error);
        this.snackBar.open('Error adding pharmacy: ' + error, 'Close', { duration: 3000 });
      });
  }

  removePharmacy() {
    this.pharmacyService.deletePharmacy(this.pharmacyIdToRemove)
      .subscribe(
        () => {
          this.snackBar.open('Pharmacy deleted successfully', 'Close', { duration: 3000 });
        },
        (error: string) => {
          this.snackBar.open(error, 'Close', { duration: 3000 });
          console.error('Error deleting pharmacy:', error);
        }
      );
  }

  editPharmacy() {
    this.pharmacyService.updatePharmacy(this.editedPharmacy)
      .subscribe(
        () => {
          this.snackBar.open('Pharmacy updated successfully', 'Close', { duration: 3000 });
          this.editedPharmacy = {} as Pharmacy;
          this.pharmacyIdToEdit = '';
        },
        (error: string) => {
          console.error('Error updating pharmacy:', error);
          this.snackBar.open(error, 'Close', { duration: 3000 });
        }
      );
  }

  getAllPharmacies() {
    this.isLoading = true;
    this.firestore.collection('pharmacies').valueChanges().subscribe(data => {
      this.allPharmacies = new MatTableDataSource<Pharmacy>(data as Pharmacy[]);
      this.isLoading = false;
    });
  }

  resetForms() {
    this.showAddPharmacyForm = false;
    this.showRemovePharmacyForm = false;
    this.showEditPharmacyForm = false;
    this.showAllPharmaciesList = false;
  }
}
