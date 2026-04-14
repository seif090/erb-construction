import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Menu, Search, Bell, Moon, Sun, Settings } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  private authService = inject(AuthService);
  isDarkMode = false;

  readonly Menu = Menu;
  readonly Search = Search;
  readonly Bell = Bell;
  readonly Moon = Moon;
  readonly Sun = Sun;
  readonly Settings = Settings;

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  get currentUser() {
    return this.authService.currentUser();
  }

  logout() {
    this.authService.logout();
  }
}
