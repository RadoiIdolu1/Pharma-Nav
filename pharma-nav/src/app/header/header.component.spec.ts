import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth.service';
import { PharmacyService } from '../pharmacy.service';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let pharmacyService: jasmine.SpyObj<PharmacyService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAdmin', 'isPharmacy', 'logout'], {
      authStatus: new BehaviorSubject<boolean>(true)
    });
    const pharmacyServiceSpy = jasmine.createSpyObj('PharmacyService', ['checkAuthentication', 'logout'], {
      authStatus: new BehaviorSubject<boolean>(true)
    });
    
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: PharmacyService, useValue: pharmacyServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    pharmacyService = TestBed.inject(PharmacyService) as jasmine.SpyObj<PharmacyService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize isAdmin, isPharmacy, and isLoggedIn properties', () => {
    authService.isAdmin.and.returnValue(true);
    authService.isPharmacy.and.returnValue(false);
    authService.authStatus.next(true);

    component.ngOnInit();

    expect(component.isAdmin).toBeTrue();
    expect(component.isPharmacy).toBeFalse();
    expect(component.isLoggedIn).toBeTrue();
  });

  it('should navigate to specified page', () => {
    const navigateSpy = spyOn(component['router'], 'navigate');
    const page = 'dashboard';

    component.navigateTo(page);

    expect(navigateSpy).toHaveBeenCalledWith(['/' + page]);
  });


});
