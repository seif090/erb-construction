import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'auth/login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'clients', loadComponent: () => import('./features/crm/clients-list/clients-list.component').then(m => m.ClientsListComponent) },
      { path: 'projects', loadComponent: () => import('./features/projects/projects-list/projects-list.component').then(m => m.ProjectsListComponent) },
      { path: 'units', loadComponent: () => import('./features/units/units-list/units-list.component').then(m => m.UnitsListComponent) },
      { path: 'contractors', loadComponent: () => import('./features/contractors/contractors-list/contractors-list.component').then(m => m.ContractorsListComponent) },
      { path: 'inventory', loadComponent: () => import('./features/inventory/inventory-list/inventory-list.component').then(m => m.InventoryListComponent) },
      { path: 'contracts', loadComponent: () => import('./features/contracts/contracts-list/contracts-list.component').then(m => m.ContractsListComponent) },
      { path: 'accounting', loadComponent: () => import('./features/accounting/accounting/accounting.component').then(m => m.AccountingComponent) }
    ]
  },
  { path: '**', redirectTo: '/auth/login' }
];
