import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HackerNewsService } from './hacker-news.service';

describe('HackerNewsService', () => {
  let service: HackerNewsService;
  let httpMock: HttpTestingController;

  const mockResponse = {
    stories: [
      { id: 1, title: 'Story 1', url: 'https://example.com/story1' },
      { id: 2, title: 'Story 2', url: 'https://example.com/story2' }
    ],
    totalCount: 2
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
    httpMock.verify(); // Ensure no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch newest stories without search term', () => {
    const page = 1;
    const pageSize = 10;

    service.getNewestStories(page, pageSize).subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(res.totalCount).toBe(2);
    });

    const req = httpMock.expectOne(
      (request) => request.url === 'https://localhost:7221/api/HackerNews/GetNewestStories'
    );

    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.params.get('pageSize')).toBe('10');
    expect(req.request.params.has('searchTerm')).toBeFalse();

    req.flush(mockResponse);
  });

  it('should fetch newest stories with search term', () => {
    const page = 2;
    const pageSize = 5;
    const searchTerm = 'angular';

    service.getNewestStories(page, pageSize, searchTerm).subscribe((res) => {
      expect(res.stories.length).toBe(2);
    });

    const req = httpMock.expectOne(
      (request) =>
        request.url === 'https://localhost:7221/api/HackerNews/GetNewestStories' &&
        request.params.get('searchTerm') === 'angular'
    );

    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('pageSize')).toBe('5');

    req.flush(mockResponse);
  });
});
