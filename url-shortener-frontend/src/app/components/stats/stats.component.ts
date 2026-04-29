import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ApiService, StatsResponse } from '../../services/api.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './stats.component.html'
})
export class StatsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);

  form = this.fb.nonNullable.group({
    code: ['', Validators.required]
  });

  stats = signal<StatsResponse | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.form.controls.code.valueChanges.subscribe((value) => {
      if (value && value.includes('/')) {
        const cleaned = this.extractShortCode(value);
        if (cleaned && cleaned !== value) {
          this.form.controls.code.setValue(cleaned, { emitEvent: false });
        }
      }
    });
  }

  submit(): void {
    if (this.form.invalid || this.loading()) return;

    const code = this.extractShortCode(this.form.controls.code.value);

    if (!code) {
      this.error.set('Please enter a valid short URL or code.');
      this.stats.set(null);
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.stats.set(null);

    this.api.getStats(code).subscribe({
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

  private extractShortCode(input: string): string {
    if (!input) return '';

    let value = input.trim();

    value = value.split('?')[0].split('#')[0];

    value = value.replace(/\/+$/, '');

    if (value.includes('/')) {
      const segments = value.split('/').filter((s) => s.length > 0);
      value = segments[segments.length - 1] ?? '';
    }

    return value;
  }
}
