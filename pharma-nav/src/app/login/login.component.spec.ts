import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service';
import { Admin } from '../admin';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environment';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        AngularFireModule.initializeApp(environment.firebase), // Use environment.firebaseConfig
        AngularFireAuthModule 
      ],
      providers: [AuthService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should call authService.login_admin when onSubmit is called', () => {
    spyOn(authService, 'login_admin');
    const email = 'test@example.com';
    const password = 'password123';
    component.admin.email = email;
    component.admin.password = password;
    const event = new Event('submit');
    component.onSubmit(event);
    expect(authService.login_admin).toHaveBeenCalledWith(email, password);
  });
});
