// home.component.ts
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PharmacyService } from '../pharmacy.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  searchTerm: string = '';
  isLoading: boolean = false; // Tracks loading state

  constructor(
    private pharmacyService: PharmacyService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  searchPharmacies(event: Event): void {
  //s  event.stopPropagation(); // Prevent event bubbling
    if (this.searchTerm.trim()) {
      this.isLoading = true; // Start loading
      this.pharmacyService.searchPharmaciesByMedicineName(this.searchTerm)
        .subscribe({
          next: (pharmacies) => {
            if (pharmacies.length > 0) {
              localStorage.setItem('searchedPharmacies', JSON.stringify(pharmacies));
             
            
             
            } else {
              this.snackBar.open('No pharmacies found.', 'Close', { duration: 3000 });
              this.isLoading = false; // Stop loading
            }
          },
          error: (error) => {
            this.snackBar.open(error.message, 'Close', { duration: 3000 });
            this.isLoading = false; // Stop loading on error
          }
        });
    } else {
      this.snackBar.open('Please enter a medicine name to search.', 'Close', { duration: 3000 });
      this.isLoading = false; // Stop loading if search term is empty
    }
    
    setTimeout(() => {
      if(localStorage.getItem('searchedPharmacies') !== ''){
        this.isLoading = false; // Stop loading
        this.snackBar.open('Search complete.', 'Close', { duration: 3000 });

        this.router.navigate(['/pharmacyes_show']); // Navigate to the pharmacyes-show component
        console.log("sunt apelat in home ??");
      }
      console.log('2 seconds have passed');
  }, 2000)

 
   
 
  }
}
