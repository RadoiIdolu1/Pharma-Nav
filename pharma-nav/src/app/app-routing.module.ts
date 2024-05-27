import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';

import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

import { PharmacyDashboardComponent } from './pharmacy-dashboard/pharmacy-dashboard.component';


import { AuthGuard } from './auth.guard';



const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {path: "home", component: HomeComponent}  ,
  {path: "login_admin", component: LoginComponent},
  {path : "pharmacy_dashboard", component: PharmacyDashboardComponent},
  {path: "admin_dashboard", component: AdminDashboardComponent,  canActivate: [AuthGuard]},
  {path: "contact", component: ContactComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
