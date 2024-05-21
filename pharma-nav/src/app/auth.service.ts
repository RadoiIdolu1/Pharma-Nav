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
        this.authStatus.next(true);
      } else {
        this.authStatus.next(false);
      }
    });
  }

  register(email: string, password: string): Promise<void> {
    return this.fireauth.createUserWithEmailAndPassword(email, password).then(res => {
      console.log('User registered successfully');
    }).catch(err => {
      console.error('Error registering user: ', err);
      throw err;
    });
  }

  updateEmail(oldEmail: string, newEmail: string): Promise<void> {
    return this.fireauth.fetchSignInMethodsForEmail(oldEmail).then(methods => {
      if (methods.length > 0) {
        return this.fireauth.currentUser.then(user => {
          if (user) {
            return user.updateEmail(newEmail).then(() => {
              console.log('Email updated successfully');
            });
          } else {
            return Promise.reject('No authenticated user found');
          }
        });
      } else {
        return Promise.reject('User not found or email mismatch');
      }
    }).catch(err => {
      console.error('Error updating email: ', err);
      throw err;
    });
  }

  

  deleteUser(email: string): Promise<void> {
    return this.fireauth.fetchSignInMethodsForEmail(email).then(methods => {
      if (methods.length > 0) {
        return this.fireauth.currentUser.then(user => {
          if (user && user.email === email) {
            return user.delete().then(() => {
              console.log('User deleted successfully');
            });
          } else {
            return Promise.reject('No authenticated user found or email mismatch');
          }
        });
      } else {
        return Promise.reject('User not found or email mismatch');
      }
    }).catch(err => {
      console.error('Error deleting user: ', err);
      throw err;
    });
  }

  login_admin(email: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(email, password).then(res => {
      localStorage.setItem('token', 'true');
      if (email.endsWith('@pharmacy.com')) {
        localStorage.setItem('role', 'pharmacy');
        this.router.navigate(['pharmacy_dashboard']);
      } else {
        localStorage.setItem('role', 'admin');
        this.router.navigate(['admin_dashboard']);
      }
    }, err => {
      alert(err.message);
      this.router.navigate(['/login']);
    });
  }

  logout() {
    this.fireauth.signOut().then(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      this.router.navigate(['/home']);
    }, err => {
      alert(err.message);
    });
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('token') === 'true';
  }

  isAdmin(): boolean {
    return this.isAuthenticated() && localStorage.getItem('role') === 'admin';
  }

  isPharmacy(): boolean {
    return this.isAuthenticated() && localStorage.getItem('role') === 'pharmacy';
  }
}
