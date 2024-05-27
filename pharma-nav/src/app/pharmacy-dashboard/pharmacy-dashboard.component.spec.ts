import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PharmacyService } from '../pharmacy.service';
import { Medicine } from '../medicine';
import { PharmacyDashboardComponent } from './pharmacy-dashboard.component';
import { of } from 'rxjs';

describe('PharmacyDashboardComponent', () => {
  let component: PharmacyDashboardComponent;
  let fixture: ComponentFixture<PharmacyDashboardComponent>;
  let pharmacyServiceSpy: jasmine.SpyObj<PharmacyService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    const pharmacyServiceSpyObj = jasmine.createSpyObj('PharmacyService', ['getMedicines', 'addMedicineToCurrentPharmacy', 'deleteMedicineById', 'editMedicine']);
    const snackBarSpyObj = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      declarations: [PharmacyDashboardComponent],
      providers: [
        { provide: PharmacyService, useValue: pharmacyServiceSpyObj },
        { provide: MatSnackBar, useValue: snackBarSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PharmacyDashboardComponent);
    component = fixture.componentInstance;
    pharmacyServiceSpy = TestBed.inject(PharmacyService) as jasmine.SpyObj<PharmacyService>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call showAddMedicineForm and resetForms when showAddMedicineForm is called', () => {
    const resetFormsSpy = spyOn(component, 'resetForms');

    component.showAddMedicineForm();

    expect(component.showAddForm).toBeTrue();
    expect(resetFormsSpy).toHaveBeenCalled();
  });

  it('should call showDeleteMedicineForm and resetForms when showDeleteMedicineForm is called', () => {
    const resetFormsSpy = spyOn(component, 'resetForms');

    component.showDeleteMedicineForm();

    expect(component.showDeleteForm).toBeTrue();
    expect(resetFormsSpy).toHaveBeenCalled();
  });

  it('should call showEditMedicineForm and resetForms when showEditMedicineForm is called', () => {
    const resetFormsSpy = spyOn(component, 'resetForms');

    component.showEditMedicineForm();

    expect(component.showEditForm).toBeTrue();
    expect(resetFormsSpy).toHaveBeenCalled();
  });

  it('should call showAllMedicines and set allMedicines when showAllMedicines is called', () => {
    const mockMedicines: Medicine[] = [{ id: 1, name: 'Medicine 1', producer: 'Producer 1', quantity: 10, description: 'Description 1' }];
    pharmacyServiceSpy.getMedicines.and.returnValue(of(mockMedicines));

    component.showAllMedicines();

    expect(component.showMedicinesList).toBeTrue();
    expect(component.allMedicines).toEqual(mockMedicines);
  });

  
});
