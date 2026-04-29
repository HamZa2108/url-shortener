import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ShortenResponse {
  shortCode: string;
  shortUrl: string;
  longUrl: string;
}

export interface StatsResponse {
  shortCode: string;
  longUrl: string;
  clickCount: number;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  shorten(url: string): Observable<ShortenResponse> {
    return this.http.post<ShortenResponse>(`${this.baseUrl}/api/shorten`, { url });
  }

  getStats(shortCode: string): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${this.baseUrl}/api/stats/${shortCode}`);
  }
}
