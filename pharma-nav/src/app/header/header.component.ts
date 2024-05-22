import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

<<<<<<< Updated upstream
  constructor(private router: Router){ }
=======
  constructor(
    private router: Router, 
    private authService: AuthService, 
    private pharmacyService: PharmacyService
  ) {
    
  }

  ngOnInit() {
    // Initialize admin and pharmacy status
    this.isAdmin = this.authService.isAdmin();
    this.isPharmacy = this.authService.isPharmacy();

    // Subscribe to both AuthService and PharmacyService auth status updates
    combineLatest([
      this.authService.authStatus,
      this.pharmacyService.authStatus
    ]).pipe(
      map(([authStatus, pharmacyStatus]) => authStatus || pharmacyStatus)
    ).subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      this.isAdmin = this.authService.isAdmin();
    });
    this.pharmacyService.checkAuthentication();
  }
>>>>>>> Stashed changes

  navigateTo(page: string): void {
    this.router.navigate(['/' + page]);
    this.isAdmin = this.authService.isAdmin();
  }

<<<<<<< Updated upstream
  login(): void {
    console.log('Login clicked')
=======
  logout(): void {
  
    this.authService.logout();
    this.pharmacyService.logout();  // Assuming you might also want a logout method here
    this.isAdmin = this.authService.isAdmin();
>>>>>>> Stashed changes
  }

}