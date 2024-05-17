import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the specified page when navigateTo is called', () => {
    spyOn(router, 'navigate');
    const page = 'home';
    component.navigateTo(page);
    expect(router.navigate).toHaveBeenCalledWith(['/' + page]);
  });

  it('should log "Login clicked" to the console when login is called', () => {
    spyOn(console, 'log');
    component.login();
    expect(console.log).toHaveBeenCalledWith('Login clicked');
  });
});
