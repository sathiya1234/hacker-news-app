import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HackerNewsService } from './hacker-news.service';
import { Story } from '../models/story.model';

describe('HackerNewsService', () => {
  let service: HackerNewsService;
  let httpMock: HttpTestingController;

  const mockStories: Story[] = [
    { id: 1, title: 'Story 1', url: 'https://example.com/1'},
    { id: 2, title: 'Story 2', url: 'https://example.com/2'}
  ];

  const mockNewestStoriesResponse = {
    stories: mockStories,
    totalCount: 20
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HackerNewsService]
    });

    service = TestBed.inject(HackerNewsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getNewestStories', () => {
    it('should return the correct stories and total count', () => {
      service.getNewestStories(1, 10).subscribe(response => {
        expect(response.stories).toEqual(mockStories);
        expect(response.totalCount).toBe(20);
      });

      const req = httpMock.expectOne('https://localhost:7221/api/HackerNews/GetNewestStories?page=1&pageSize=10');
      expect(req.request.method).toBe('GET');
      req.flush(mockNewestStoriesResponse);
    });

    it('should handle error correctly', () => {
      const errorMessage = 'Failed to fetch stories';
      service.getNewestStories(1, 10).subscribe({
        next: () => fail('Expected an error, not stories'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        }
      });

      const req = httpMock.expectOne('https://localhost:7221/api/HackerNews/GetNewestStories?page=1&pageSize=10');
      expect(req.request.method).toBe('GET');
      req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('searchStories', () => {
    it('should return the correct stories for the search term', () => {
      const searchTerm = 'Angular';
      service.searchStories(searchTerm).subscribe(stories => {
        expect(stories).toEqual(mockStories);
      });

      const req = httpMock.expectOne(`https://localhost:7221/api/HackerNews/SearchStories?term=Angular`);
      expect(req.request.method).toBe('GET');
      req.flush(mockStories);
    });

    it('should handle error correctly', () => {
      const errorMessage = 'Failed to search stories';
      const searchTerm = 'Angular';
      service.searchStories(searchTerm).subscribe({
        next: () => fail('Expected an error, not stories'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        }
      });

      const req = httpMock.expectOne(`https://localhost:7221/api/HackerNews/SearchStories?term=Angular`);
      expect(req.request.method).toBe('GET');
      req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
    });
  });
});
