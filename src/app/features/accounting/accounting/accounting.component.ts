import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { LucideAngularModule, Search, DollarSign, ArrowUpRight, ArrowDownLeft, FileText, MoreVertical, Plus, Filter, Calendar } from 'lucide-angular';

@Component({
  selector: 'app-accounting',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './accounting.component.html',
  styleUrl: './accounting.component.scss'
})
export class AccountingComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/accounting`;

  transactions = signal<any[]>([]);
  filteredTransactions = signal<any[]>([]);
  isLoading = signal(true);
  searchQuery = signal('');

  stats = signal({
    totalIncome: 1250000,
    totalExpenses: 850000,
    netProfit: 400000,
    pendingInvoices: 15
  });

  readonly Search = Search;
  readonly DollarSign = DollarSign;
  readonly ArrowUpRight = ArrowUpRight;
  readonly ArrowDownLeft = ArrowDownLeft;
  readonly FileText = FileText;
  readonly MoreVertical = MoreVertical;
  readonly Plus = Plus;
  readonly Filter = Filter;
  readonly Calendar = Calendar;

  ngOnInit() {
    this.fetchTransactions();
  }

  fetchTransactions() {
    this.isLoading.set(true);
    this.http.get<any>(this.apiUrl).subscribe({
      next: (res) => {
        if (res.success) {
          this.transactions.set(res.data);
          this.applyFilter();
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching transactions:', err);
        // Fallback mock data
        const mockData = [
          { id: '1', description: 'دفعة مقدمة - فيلا الياسمين', type: 'INCOME', category: 'Project Payment', amount: 50000, date: '2023-11-20', status: 'COMPLETED' },
          { id: '2', description: 'شراء مواد أسمنت', type: 'EXPENSE', category: 'Materials', amount: 12000, date: '2023-11-18', status: 'COMPLETED' },
          { id: '3', description: 'راتب مقاول السباكة', type: 'EXPENSE', category: 'Labor', amount: 8500, date: '2023-11-15', status: 'COMPLETED' },
          { id: '4', description: 'بيع وحدة سكنية - الرحاب', type: 'INCOME', category: 'Real Estate Sales', amount: 750000, date: '2023-11-10', status: 'COMPLETED' },
          { id: '5', description: 'فاتورة كهرباء المكتب', type: 'EXPENSE', category: 'Utilities', amount: 1200, date: '2023-11-05', status: 'COMPLETED' },
        ];
        this.transactions.set(mockData);
        this.applyFilter();
        this.isLoading.set(false);
      }
    });
  }

  applyFilter() {
    const query = this.searchQuery().toLowerCase();
    if (!query) {
      this.filteredTransactions.set(this.transactions());
      return;
    }
    const filtered = this.transactions().filter(t => 
      t.description.toLowerCase().includes(query) || 
      t.category.toLowerCase().includes(query)
    );
    this.filteredTransactions.set(filtered);
  }

  onSearchChange(event: any) {
    this.searchQuery.set(event.target.value);
    this.applyFilter();
  }

  getTypeClass(type: string) {
    return type === 'INCOME' ? 'text-success bg-success/10' : 'text-error bg-error/10';
  }
}
