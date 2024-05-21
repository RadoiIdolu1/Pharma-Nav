import { Component, OnDestroy, OnInit } from '@angular/core';
import { PharmacyService } from '../pharmacy.service';
import { Medicine } from '../medicine';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pharmacy-dashboard',
  templateUrl: './pharmacy-dashboard.component.html',
  styleUrl: './pharmacy-dashboard.component.css'
})
export class PharmacyDashboardComponent implements OnInit, OnDestroy {

  medicines: Medicine[] = [];
  private medsSubscription!: Subscription;

  showAddForm: boolean = false;
  showDeleteForm: boolean = false;
  showEditForm: boolean = false;
  showMedicinesList: boolean = false;
  newMedicine: Medicine = { id: 0, name: '', producer: '', quantity: 0, description: '' };
  editedMedicine: Medicine = { id: 0, name: '', producer: '', quantity: 0, description: '' };
  medicineIdToDelete: string = '';
  allMedicines: Medicine[] = [];

  constructor(private snackBar: MatSnackBar, private pharmacyService : PharmacyService) {

  }
  ngOnInit(): void {
    // Initial fetching of medicines should be handled here if needed immediately after loading the component
  }

  ngOnDestroy(): void {
    if (this.medsSubscription) {
      this.medsSubscription.unsubscribe(); // Safely unsubscribe
    }
  }

  showAddMedicineForm(): void {
    this.resetForms();
    this.showAddForm = true;
  }

  showDeleteMedicineForm(): void {
    this.resetForms();
    this.showDeleteForm = true;
  }

  showEditMedicineForm(): void {
    this.resetForms();
    this.showEditForm = true;
  }

  showAllMedicines(): void {
    this.resetForms();
    this.showMedicinesList = true; // Show the medicines list

    // Check if a subscription already exists, if yes, unsubscribe before creating a new one
    if (this.medsSubscription) {
      this.medsSubscription.unsubscribe();
    }

    this.medsSubscription = this.pharmacyService.getMedicines().subscribe(
      meds => {
        this.allMedicines = meds;
      },
      error => {
        console.error('Failed to fetch medicines:', error);
        this.snackBar.open('Failed to fetch medicines: ' + error.message, 'Close', { duration: 3000 });
      }
    );
  }

  addMedicine(): void {
    this.pharmacyService.addMedicineToCurrentPharmacy(this.newMedicine)
      .then(() => {
        this.snackBar.open('Medicine added successfully', 'Close', { duration: 3000 });
        this.newMedicine = { id: 0, name: '', producer: '', quantity: 0, description: '' }; // Reset new medicine
      })
      .catch((error) => {
        // Log the error to the console for debugging purposes
        console.error('Failed to add medicine:', error);
  
        // Handle specific errors based on the error message
        if (error.includes('No pharmacy logged in')) {
          this.snackBar.open('Error: No pharmacy is currently logged in.', 'Close', { duration: 3000 });
        } else if (error.includes('Medicine with this ID already exists')) {
          this.snackBar.open('Error: A medicine with this ID already exists.', 'Close', { duration: 3000 });
        } else if (error.includes('Document does not exist')) {
          this.snackBar.open('Error: Pharmacy record not found.', 'Close', { duration: 3000 });
        } else {
          // General error handling if the error is not one of the above types
          this.snackBar.open('An unexpected error occurred.', 'Close', { duration: 3000 });
        }
      });
  }
  

  deleteMedicine(): void {
    if (!this.medicineIdToDelete) {
        this.snackBar.open('Please enter a valid medicine ID.', 'Close', { duration: 3000 });
        return;
    }

    this.pharmacyService.deleteMedicineById(this.medicineIdToDelete)
        .then(() => {
            this.snackBar.open('Medicine deleted successfully', 'Close', { duration: 3000 });
            // Optionally refresh the list or handle UI state changes
            this.allMedicines = this.allMedicines.filter(m => String(m.id) !== this.medicineIdToDelete.toString());
            this.showDeleteForm = false; // Close the form on successful deletion
            this.medicineIdToDelete = ''; // Reset the ID
        })
        .catch(error => {
            console.error('Failed to delete medicine:', error);
            this.snackBar.open('Failed to delete medicine: ' + error.message, 'Close', { duration: 3000 });
        });
}


editMedicine(): void {
  // Check if the editedMedicine object has all required fields
  if (!this.editedMedicine || this.editedMedicine.id === undefined || !this.editedMedicine.name || !this.editedMedicine.producer || this.editedMedicine.quantity === undefined || !this.editedMedicine.description) {
    this.snackBar.open('All medicine fields must be defined', 'Close', { duration: 3000 });
    return;
  }

  console.log('Editing:', this.editedMedicine);

  this.pharmacyService.editMedicine(this.editedMedicine)
    .then(() => {
      // Only update the local state if the backend update was successful
      const index = this.allMedicines.findIndex(m => m.id === this.editedMedicine.id);
      if (index !== -1) {
        this.allMedicines[index] = {...this.allMedicines[index], ...this.editedMedicine};
        this.snackBar.open('Medicine updated successfully', 'Close', { duration: 3000 });
      } else {
        // If no index found, likely an inconsistency between local and server data
        this.snackBar.open('Updated succsefully.', 'Close', { duration: 3000 });
      }
    })
    .catch(error => {
      // Handle different types of errors
      console.error('Failed to update medicine:', error);
      this.snackBar.open('Failed to update medicine: ' + error.message, 'Close', { duration: 3000 });
    })
    .finally(() => {
      // Reset edited medicine irrespective of the outcome to be ready for the next edit
      this.editedMedicine = { id: 0, name: '', producer: '', quantity: 0, description: '' };
    });
}




  resetForms(): void {
    this.showAddForm = false;
    this.showDeleteForm = false;
    this.showEditForm = false;
    this.showMedicinesList = false;
  }

  seeMedicines(): void {

  }
}
