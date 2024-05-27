import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of, throwError } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PharmacyService } from '../pharmacy.service';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { Pharmacy } from '../pharmacy';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let pharmacyServiceSpy: jasmine.SpyObj<PharmacyService>;
  let firestoreSpy: jasmine.SpyObj<AngularFirestore>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    const pharmacyServiceMock = jasmine.createSpyObj('PharmacyService', ['addPharmacy', 'deletePharmacy', 'updatePharmacy']);
    const firestoreMock = jasmine.createSpyObj('AngularFirestore', ['collection']);
    const snackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);
    const collectionMock = {
      valueChanges: jasmine.createSpy('valueChanges').and.returnValue(of([]))
    };
    firestoreMock.collection.and.returnValue(collectionMock as any);

    await TestBed.configureTestingModule({
      declarations: [AdminDashboardComponent],
      imports: [
        NoopAnimationsModule,
        MatSnackBarModule,
        MatTableModule,
        BrowserDynamicTestingModule
      ],
      providers: [
        { provide: PharmacyService, useValue: pharmacyServiceMock },
        { provide: AngularFirestore, useValue: firestoreMock },
        { provide: MatSnackBar, useValue: snackBarMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    pharmacyServiceSpy = TestBed.inject(PharmacyService) as jasmine.SpyObj<PharmacyService>;
    firestoreSpy = TestBed.inject(AngularFirestore) as jasmine.SpyObj<AngularFirestore>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the add pharmacy form', () => {
    component.showAddForm();
    expect(component.showAddPharmacyForm).toBeTrue();
    expect(component.showRemovePharmacyForm).toBeFalse();
    expect(component.showEditPharmacyForm).toBeFalse();
    expect(component.showAllPharmaciesList).toBeFalse();
  });

  it('should show the remove pharmacy form', () => {
    component.showRemoveForm();
    expect(component.showAddPharmacyForm).toBeFalse();
    expect(component.showRemovePharmacyForm).toBeTrue();
    expect(component.showEditPharmacyForm).toBeFalse();
    expect(component.showAllPharmaciesList).toBeFalse();
  });

  it('should show the edit pharmacy form', () => {
    component.showEditForm();
    expect(component.showAddPharmacyForm).toBeFalse();
    expect(component.showRemovePharmacyForm).toBeFalse();
    expect(component.showEditPharmacyForm).toBeTrue();
    expect(component.showAllPharmaciesList).toBeFalse();
  });

  it('should show all pharmacies list', () => {
    component.showAllPharmacies();
    expect(component.showAddPharmacyForm).toBeFalse();
    expect(component.showRemovePharmacyForm).toBeFalse();
    expect(component.showEditPharmacyForm).toBeFalse();
    expect(component.showAllPharmaciesList).toBeTrue();
  });

  
  it('should handle error while removing a pharmacy', () => {
    const error = 'Error deleting pharmacy';
    pharmacyServiceSpy.deletePharmacy.and.returnValue(throwError(error));
    component.pharmacyIdToRemove = 1;
    component.removePharmacy();
    expect(snackBarSpy.open).toHaveBeenCalledWith(error, 'Close', { duration: 3000 });
  });

  

  it('should handle error while editing a pharmacy', () => {
    const error = 'Error updating pharmacy';
    pharmacyServiceSpy.updatePharmacy.and.returnValue(throwError(error));
    component.editedPharmacy = { id: 1, name: 'Test Pharmacy' } as Pharmacy;
    component.editPharmacy();
    expect(snackBarSpy.open).toHaveBeenCalledWith(error, 'Close', { duration: 3000 });
  });


  it('should reset all forms', () => {
    component.showAddForm();
    component.showRemoveForm();
    component.showEditForm();
    component.showAllPharmacies();
    component.resetForms();
    expect(component.showAddPharmacyForm).toBeFalse();
    expect(component.showRemovePharmacyForm).toBeFalse();
    expect(component.showEditPharmacyForm).toBeFalse();
    expect(component.showAllPharmaciesList).toBeFalse();
  });
});
