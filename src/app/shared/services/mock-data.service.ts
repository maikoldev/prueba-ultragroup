import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class MockDataService {
  private http = inject(HttpClient);

  initializeMockData(): Promise<void> {
    return new Promise((resolve) => {
      const existingData = localStorage.getItem('hotels');
      if (existingData) {
        try {
          const parsed = JSON.parse(existingData);
          if (parsed.hotels && Array.isArray(parsed.hotels) && parsed.hotels.length > 0) {
            console.log('✅ Hotels already in localStorage. Skippping');
            resolve();
            return;
          }
        } catch (error) {
          console.warn('⚠️ Invalid data in localStorage, loading mock...');
          localStorage.removeItem('hotels');
        }
      }

      // Cargar hotels.json
      this.http.get('/assets/mock/hotels.json').subscribe({
        next: (data) => {
          localStorage.setItem('hotels', JSON.stringify(data));
          resolve();
        },
        error: () => {
          console.warn('No se pudo cargar hotels.json');
          resolve();
        },
      });
    });
  }
}
