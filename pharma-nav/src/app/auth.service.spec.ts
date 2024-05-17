import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let fireauthStub: Partial<AngularFireAuth>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Create a mock AngularFireAuth
    fireauthStub = {
      signInWithEmailAndPassword: jasmine.createSpy('signInWithEmailAndPassword').and.returnValue(Promise.resolve({})),
      createUserWithEmailAndPassword: jasmine.createSpy('createUserWithEmailAndPassword').and.returnValue(Promise.resolve({})),
      signOut: jasmine.createSpy('signOut').and.returnValue(Promise.resolve()),
      sendPasswordResetEmail: jasmine.createSpy('sendPasswordResetEmail').and.returnValue(Promise.resolve())
    };

    // Create a spy for the Router
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // Configure the testing module
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: AngularFireAuth, useValue: fireauthStub },
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#login_admin', () => {
    it('should log in and navigate to admin_dashboard', async () => {
      await service.login_admin('test123@yahoo.com', 'test123');
      expect(fireauthStub.signInWithEmailAndPassword).toHaveBeenCalledWith('test123@yahoo.com', 'test123');
      expect(localStorage.getItem('token')).toBe('true');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['admin_dashboard']);
    });

    it('should alert error and navigate to login on failure', async () => {
      const errorMessage = 'Login failed';
      (fireauthStub.signInWithEmailAndPassword as jasmine.Spy).and.returnValue(Promise.reject({ message: errorMessage }));
      spyOn(window, 'alert');
      
      await service.login_admin('test@example.com', 'wrongpassword');
      expect(window.alert).toHaveBeenCalledWith(errorMessage);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
