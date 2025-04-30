import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Story } from '../models/story.model';

interface StoryResponse {
  stories: Story[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class HackerNewsService {
  private apiUrl = 'https://localhost:7221/api/HackerNews';

  constructor(private http: HttpClient) { }

  getNewestStories(
    page: number, 
    pageSize: number, 
    searchTerm?: string
  ): Observable<StoryResponse> {
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(searchTerm && { searchTerm })
    };

    return this.http.get<StoryResponse>(`${this.apiUrl}/GetNewestStories`, { params });
  }
}