import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Story } from '../models/story.model';

@Injectable({
  providedIn: 'root'
})
export class HackerNewsService {
  private apiUrl = 'https://localhost:7221/api/HackerNews';

  constructor(private http: HttpClient) { }

  getNewestStories(page: number, pageSize: number): Observable<{ stories: Story[], totalCount: number }> {
    return this.http.get<{ stories: Story[], totalCount: number }>(`${this.apiUrl}/GetNewestStories?page=${page}&pageSize=${pageSize}`);
  }

  searchStories(term: string): Observable<Story[]> {
    return this.http.get<Story[]>(`${this.apiUrl}/SearchStories?term=${term}`);
  }
}
