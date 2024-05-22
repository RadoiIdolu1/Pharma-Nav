import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
<<<<<<< Updated upstream
import { ContactComponent } from './contact/contact.component';
=======
import { PharmacyDashboardComponent } from './pharmacy-dashboard/pharmacy-dashboard.component';
import { AuthGuard } from './auth.guard';
import { ContactComponent } from './contact/contact.component';

>>>>>>> Stashed changes


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {path: "home", component: HomeComponent}  ,
  {path: "login_admin", component: LoginComponent},
<<<<<<< Updated upstream
  {path: "admin_dashboard", component: AdminDashboardComponent},
  {path: "contact-support", component: ContactComponent}
=======
  {path : "pharmacy_dashboard", component: PharmacyDashboardComponent},
  {path: "admin_dashboard", component: AdminDashboardComponent,  canActivate: [AuthGuard]},
  {path: "contact", component:ContactComponent}
>>>>>>> Stashed changes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
