import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, Users, FolderOpen, Building2, HardHat, FileText, Package, Calculator, ChevronLeft, ChevronRight } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() isOpen = true;

  readonly LayoutDashboard = LayoutDashboard;
  readonly Users = Users;
  readonly FolderOpen = FolderOpen;
  readonly Building2 = Building2;
  readonly HardHat = HardHat;
  readonly FileText = FileText;
  readonly Package = Package;
  readonly Calculator = Calculator;

  menuItems = [
    { icon: this.LayoutDashboard, label: 'لوحة القيادة / Dashboard', route: '/dashboard' },
    { icon: this.Users, label: 'العملاء / CRM', route: '/clients' },
    { icon: this.FolderOpen, label: 'المشاريع / Projects', route: '/projects' },
    { icon: this.Building2, label: 'العقارات / Real Estate', route: '/units' },
    { icon: this.HardHat, label: 'المقاولين / Contractors', route: '/contractors' },
    { icon: this.FileText, label: 'العقود / Contracts', route: '/contracts' },
    { icon: this.Package, label: 'المخازن / Inventory', route: '/inventory' },
    { icon: this.Calculator, label: 'الحسابات / Accounting', route: '/accounting' },
  ];
}
