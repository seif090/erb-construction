import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {
  protected http = inject(HttpClient);
  protected apiUrl = environment.apiUrl;

  protected get<T>(endpoint: string, params?: any): Observable<ApiResponse<T>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return this.http.get<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`, { params: httpParams }).pipe(
      catchError(this.handleError)
    );
  }

  protected post<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`, data).pipe(
      catchError(this.handleError)
    );
  }

  protected patch<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`, data).pipe(
      catchError(this.handleError)
    );
  }

  protected delete<T>(endpoint: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
