import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LucideAngularModule, Wallet, TrendingUp, TrendingDown, DollarSign, Plus, ArrowUpRight, ArrowDownRight, Search, FileText, MoreVertical, Calendar } from 'lucide-angular';
import { AccountingService, Transaction, AccountingSummary } from '../../../../core/services/accounting.service';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';

@Component({
  selector: 'app-accounting',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule, MatDialogModule],
  templateUrl: './accounting.component.html',
  styleUrl: './accounting.component.scss'
})
export class AccountingComponent implements OnInit {
  private accountingService = inject(AccountingService);
  private dialog = inject(MatDialog);

  transactions = signal<Transaction[]>([]);
  filteredTransactions = signal<Transaction[]>([]);
  summary = signal<AccountingSummary | null>(null);
  isLoading = signal(true);
  searchQuery = signal('');

  readonly Wallet = Wallet;
  readonly TrendingUp = TrendingUp;
  readonly TrendingDown = TrendingDown;
  readonly DollarSign = DollarSign;
  readonly Plus = Plus;
  readonly ArrowUpRight = ArrowUpRight;
  readonly ArrowDownRight = ArrowDownRight;
  readonly Search = Search;
  readonly FileText = FileText;
  readonly MoreVertical = MoreVertical;
  readonly Calendar = Calendar;

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.isLoading.set(true);
    // Fetch summary
    this.accountingService.getSummary().subscribe({
      next: (res) => { if (res.success) this.summary.set(res.data); },
      error: () => {
        // Fallback mock summary
        this.summary.set({ totalIncome: 1250000, totalExpense: 450000, balance: 800000, monthlyIncome: 120000, monthlyExpense: 35000 });
      }
    });

    // Fetch transactions
    this.accountingService.getTransactions().subscribe({
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
        const mockData: Transaction[] = [
          { id: '1', type: 'INCOME', amount: 45000, description: 'دفعة عقد - مشروع فيلا الياسمين', category: 'Sales', date: new Date().toISOString(), createdAt: '' },
          { id: '2', type: 'EXPENSE', amount: 1200, description: 'شراء مواد سباكة - مخزن أ', category: 'Materials', date: new Date().toISOString(), createdAt: '' },
          { id: '3', type: 'INCOME', amount: 25000, description: 'قسط بيع وحدة 101', category: 'Real Estate', date: new Date().toISOString(), createdAt: '' },
          { id: '4', type: 'EXPENSE', amount: 3500, description: 'أجور عمال كهرباء', category: 'Labor', date: new Date().toISOString(), createdAt: '' },
        ];
        this.transactions.set(mockData);
        this.applyFilter();
        this.isLoading.set(false);
      }
    });
  }

  openTransactionForm(transaction?: Transaction) {
    const dialogRef = this.dialog.open(TransactionFormComponent, {
      width: '600px',
      data: { transaction },
      panelClass: 'glass-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchData();
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
}
