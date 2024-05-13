import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private router: Router){ }

  navigateTo(page: string): void {
    this.router.navigate(['/' + page]);
  }

  login(): void {
    console.log('Login clicked')
  }

}