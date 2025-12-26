import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Item,
  ChatRequest,
  ChatResponse,
  RepairBooking
} from '../models/item.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  // Health check
  healthCheck(): Observable<any> {
    return this.http.get(`${this.apiUrl.replace('/api', '')}/health`);
  }

  // Items API
  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/items`, {
      headers: this.getHeaders()
    });
  }

  getItem(id: string): Observable<Item> {
    return this.http.get<Item>(`${this.apiUrl}/items/${id}`, {
      headers: this.getHeaders()
    });
  }

  createItem(item: Partial<Item>): Observable<Item> {
    return this.http.post<Item>(`${this.apiUrl}/items`, item, {
      headers: this.getHeaders()
    });
  }

  updateItem(id: string, item: Partial<Item>): Observable<Item> {
    return this.http.put<Item>(`${this.apiUrl}/items/${id}`, item, {
      headers: this.getHeaders()
    });
  }

  deleteItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/items/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Repairs API
  getRepairs(): Observable<RepairBooking[]> {
    return this.http.get<RepairBooking[]>(`${this.apiUrl}/repairs`, {
      headers: this.getHeaders()
    });
  }

  createRepair(repair: Partial<RepairBooking>): Observable<RepairBooking> {
    return this.http.post<RepairBooking>(`${this.apiUrl}/repairs`, repair, {
      headers: this.getHeaders()
    });
  }

  // AI Chat API
  sendChatMessage(request: ChatRequest): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.apiUrl}/chat/query`, request, {
      headers: this.getHeaders()
    });
  }

  getChatCapabilities(): Observable<any> {
    return this.http.get(`${this.apiUrl}/chat/capabilities`, {
      headers: this.getHeaders()
    });
  }
}
