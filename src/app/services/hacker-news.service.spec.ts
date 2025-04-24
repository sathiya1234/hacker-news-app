/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HackerNewsService } from './hacker-news.service';
import { Story } from '../models/story.model';

describe('HackerNewsService', () => {
  let service: HackerNewsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HackerNewsService]
    });
    service = TestBed.inject(HackerNewsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no unmatched requests are outstanding
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getNewestStories', () => {
    it('should return newest stories with pagination', () => {
      const mockStories: Story[] = [
        { id: 1, title: 'Test Story 1', url: 'http://example.com/1' },
        { id: 2, title: 'Test Story 2', url: 'http://example.com/2' }
      ];

      service.getNewestStories(1, 2).subscribe(stories => {
        expect(stories.length).toBe(2);
        expect(stories).toEqual(mockStories);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/GetNewestStories?page=1&pageSize=2`);
      expect(req.request.method).toBe('GET');
      req.flush(mockStories);
    });

    it('should handle empty response', () => {
      service.getNewestStories(1, 10).subscribe(stories => {
        expect(stories.length).toBe(0);
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/GetNewestStories?page=1&pageSize=10`);
      req.flush([]);
    });

    it('should handle HTTP errors', () => {
      const errorMessage = '404 Not Found';
      
      service.getNewestStories(1, 10).subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/GetNewestStories?page=1&pageSize=10`);
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('searchStories', () => {
    it('should return matching stories for search term', () => {
      const mockStories: Story[] = [
        { id: 1, title: 'Angular is awesome', url: 'http://example.com/angular' },
        { id: 2, title: 'React is cool too', url: 'http://example.com/react' }
      ];
      const searchTerm = 'angular';

      service.searchStories(searchTerm).subscribe(stories => {
        expect(stories.length).toBe(1);
        expect(stories[0].title).toContain('Angular');
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/SearchStories?term=${searchTerm}`);
      expect(req.request.method).toBe('GET');
      req.flush([mockStories[0]]); // Only return the matching story
    });

    it('should return empty array for empty search term', () => {
      service.searchStories('').subscribe(stories => {
        expect(stories.length).toBe(0);
      });

      // No HTTP call should be made for empty search term
      httpMock.expectNone(`${service['apiUrl']}/SearchStories?term=`);
    });

    it('should handle HTTP errors during search', () => {
      const errorMessage = '500 Server Error';
      const searchTerm = 'test';
      
      service.searchStories(searchTerm).subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Server Error');
        }
      });

      const req = httpMock.expectOne(`${service['apiUrl']}/SearchStories?term=${searchTerm}`);
      req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
    });
  });
});
