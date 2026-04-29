import { Routes } from '@angular/router';
import { ShortenerComponent } from './components/shortener/shortener.component';
import { StatsComponent } from './components/stats/stats.component';

export const routes: Routes = [
  { path: '', component: ShortenerComponent },
  { path: 'stats', component: StatsComponent },
  { path: '**', redirectTo: '' }
];
