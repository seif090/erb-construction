import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, Users, FolderOpen, Building2, HardHat, FileText, Package, Calculator, ChevronLeft, ChevronRight } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() isOpen = true;
  private authService = inject(AuthService);

  readonly LayoutDashboard = LayoutDashboard;
  readonly Users = Users;
  readonly FolderOpen = FolderOpen;
  readonly Building2 = Building2;
  readonly HardHat = HardHat;
  readonly FileText = FileText;
  readonly Package = Package;
  readonly Calculator = Calculator;

  private menuItems = [
    { icon: this.LayoutDashboard, label: 'لوحة القيادة / Dashboard', route: '/dashboard', roles: ['ADMIN', 'EMPLOYEE', 'CONTRACTOR', 'VIEWER'] },
    { icon: this.Users, label: 'العملاء / CRM', route: '/clients', roles: ['ADMIN', 'EMPLOYEE'] },
    { icon: this.FolderOpen, label: 'المشاريع / Projects', route: '/projects', roles: ['ADMIN', 'EMPLOYEE', 'CONTRACTOR'] },
    { icon: this.Building2, label: 'العقارات / Real Estate', route: '/units', roles: ['ADMIN', 'EMPLOYEE'] },
    { icon: this.HardHat, label: 'المقاولين / Contractors', route: '/contractors', roles: ['ADMIN', 'EMPLOYEE'] },
    { icon: this.FileText, label: 'العقود / Contracts', route: '/contracts', roles: ['ADMIN', 'EMPLOYEE'] },
    { icon: this.Package, label: 'المخازن / Inventory', route: '/inventory', roles: ['ADMIN', 'EMPLOYEE'] },
    { icon: this.Calculator, label: 'الحسابات / Accounting', route: '/accounting', roles: ['ADMIN', 'EMPLOYEE'] },
  ];

  get visibleMenuItems() {
    return this.menuItems.filter((item) => this.authService.hasRole(item.roles as any));
  }

  get currentUser() {
    return this.authService.currentUser();
  }
}
