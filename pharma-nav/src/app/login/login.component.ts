import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Admin } from '../admin';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {

  admin: Admin = { email: '', password: '' };

  constructor(private authService: AuthService) {}

  onSubmit(event: Event) {
    event.preventDefault(); // Prevent the default form submission behavior

    this.authService.login_admin(this.admin.email, this.admin.password);
  }

}