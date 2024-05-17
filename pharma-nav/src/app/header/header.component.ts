import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.authService.authStatus.subscribe((status: boolean) => {
      this.isLoggedIn = status;
    });
  }

  navigateTo(page: string): void {
    this.router.navigate(['/' + page]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']); // Redirect to home page after logout
  }
}
