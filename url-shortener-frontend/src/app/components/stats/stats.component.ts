import { Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ApiService, StatsResponse } from '../../services/api.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './stats.component.html'
})
export class StatsComponent {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);

  form = this.fb.nonNullable.group({
    code: ['', Validators.required]
  });

  stats = signal<StatsResponse | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  submit(): void {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);
    this.error.set(null);
    this.stats.set(null);
    this.api.getStats(this.form.controls.code.value.trim()).subscribe({
      next: (res) => {
        this.stats.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No link found for that short code.');
        this.loading.set(false);
      }
    });
  }
}
