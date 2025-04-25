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

  it('should fetch newest stories', () => {
    const mockStories = [{ id: 1, title: 'Test', url: 'http://test.com' }];
    
    service.getNewestStories(1, 10).subscribe(stories => {
      expect(stories.length).toBe(1);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/GetNewestStories?page=1&pageSize=10`);
    req.flush(mockStories);
  });
});
