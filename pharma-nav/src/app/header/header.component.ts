import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { PharmacyService } from '../pharmacy.service';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAdmin: boolean = false;
  isPharmacy: boolean = false;
  isLoggedIn: boolean = false;

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
    });
    this.pharmacyService.checkAuthentication();
  }

  navigateTo(page: string): void {
    this.router.navigate(['/' + page]);
    this.isAdmin = this.authService.isAdmin();
    this.isPharmacy = this.authService.isPharmacy();

  }

  logout(): void {
    this.authService.logout();
    this.pharmacyService.logout();  // Assuming you might also want a logout method here
    this.isAdmin = this.authService.isAdmin();
    this.isPharmacy = this.authService.isPharmacy();

  }
}
