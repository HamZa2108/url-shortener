import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ApiService, ShortenResponse } from '../../services/api.service';

@Component({
  selector: 'app-shortener',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './shortener.component.html'
})
export class ShortenerComponent {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);

  form = this.fb.nonNullable.group({
    url: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]]
  });

  result = signal<ShortenResponse | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  copied = signal(false);

  submit(): void {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);
    this.api.shorten(this.form.controls.url.value).subscribe({
      next: (res) => {
        this.result.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.errors?.url ?? 'Something went wrong. Try again.');
        this.loading.set(false);
      }
    });
  }

  copy(): void {
    const r = this.result();
    if (!r) return;
    navigator.clipboard.writeText(r.shortUrl).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }

  reset(): void {
    this.form.reset({ url: '' });
    this.result.set(null);
    this.error.set(null);
  }
}
