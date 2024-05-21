import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Admin } from '../admin';
import { Pharmacy } from '../pharmacy';
import { PharmacyService } from '../pharmacy.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {

  admin: Admin = { email: '', password: '' };

  pharmacy: Pharmacy = {
    name: '',
    email: '',
    latitude: 0,
    longitude: 0,
    meds: [],
    password: '',
    id: 0
  };

  constructor(private authService: AuthService, private PharmacyService: PharmacyService) {}

  onSubmit(event: Event) {
    event.preventDefault(); // Prevent the default form submission behavior
    if(this.admin.email.endsWith("@pharmacy.com")) {
      this.PharmacyService.login(this.admin.email, this.admin.password);
    } else {
      this.authService.login_admin(this.admin.email, this.admin.password);
    }
  }

}