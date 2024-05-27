import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
    authGuard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  it('should return true if user is authenticated', () => {
    authService.isAuthenticated.and.returnValue(true);
    expect(authGuard.canActivate()).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled(); 
  });

  it('should return false and redirect to login page if user is not authenticated', () => {
    authService.isAuthenticated.and.returnValue(false);
    expect(authGuard.canActivate()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']); 
  });
});
