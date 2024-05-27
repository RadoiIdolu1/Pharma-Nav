import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service';
import { PharmacyService } from '../pharmacy.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let pharmacyService: jasmine.SpyObj<PharmacyService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login_admin']);
    const pharmacyServiceSpy = jasmine.createSpyObj('PharmacyService', ['login']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: PharmacyService, useValue: pharmacyServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    pharmacyService = TestBed.inject(PharmacyService) as jasmine.SpyObj<PharmacyService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login_admin method when admin email is provided', () => {
    const email = 'admin@example.com';
    component.admin.email = email;
    component.onSubmit(new Event('submit'));

    expect(authService.login_admin).toHaveBeenCalledWith(email, component.admin.password);
    expect(pharmacyService.login).not.toHaveBeenCalled();
  });

  it('should call login method when pharmacy email is provided', () => {
    const email = 'cacao@pharmacy.com';
    component.admin.email = email;
    component.onSubmit(new Event('submit'));

    expect(pharmacyService.login).toHaveBeenCalledWith(email, component.admin.password);
    expect(authService.login_admin).not.toHaveBeenCalled();
  });

  it('should prevent default form submission behavior', () => {
    const event = new Event('submit');
    const preventDefaultSpy = spyOn(event, 'preventDefault');

    component.onSubmit(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });
});
