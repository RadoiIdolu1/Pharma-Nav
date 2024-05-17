import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private fireauth: AngularFireAuth, private router: Router) {
    this.fireauth.authState.subscribe(user => {
      if (user) {
        this.authStatus.next(true); // User is authenticated
      } else {
        this.authStatus.next(false); // User is not authenticated
      }
    });
  }

  // login method
  login_admin(email: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(email, password).then(res => {
      localStorage.setItem('token', 'true');
      this.router.navigate(['admin_dashboard']);
    }, err => {
      alert(err.message);
      this.router.navigate(['/login']);
    });
  }

  // logout method
  logout() {
    this.fireauth.signOut().then(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/home']); // Assuming home is your main page
    }, err => {
      alert(err.message);
    });
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return localStorage.getItem('token') === 'true';
  }
}
