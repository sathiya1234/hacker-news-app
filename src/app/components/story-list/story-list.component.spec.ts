import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoryListComponent } from './story-list.component';
import { HackerNewsService } from '../../services/hacker-news.service';
import { of, throwError } from 'rxjs';
import { Story } from '../../models/story.model';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('StoryListComponent', () => {
  let component: StoryListComponent;
  let fixture: ComponentFixture<StoryListComponent>;
  let hackerNewsServiceSpy: jasmine.SpyObj<HackerNewsService>;

  const mockStories: Story[] = [
    { id: 1, title: 'Story 1', url: 'https://example.com/1' },
    { id: 2, title: 'Story 2', url: 'https://example.com/2' }
  ];

  beforeEach(async () => {
    hackerNewsServiceSpy = jasmine.createSpyObj('HackerNewsService', ['getNewestStories']);

    await TestBed.configureTestingModule({
      declarations: [StoryListComponent],
      providers: [
        { provide: HackerNewsService, useValue: hackerNewsServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // Ignore unknown HTML elements if any
    }).compileComponents();

    fixture = TestBed.createComponent(StoryListComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load stories on init', () => {
    const response = { stories: mockStories, totalCount: 2 };
    hackerNewsServiceSpy.getNewestStories.and.returnValue(of(response));

    component.ngOnInit();

    expect(component.isLoading).toBeFalse();
    expect(component.stories.length).toBe(2);
    expect(component.totalCount).toBe(2);
    expect(component.totalPages).toBe(1);
    expect(hackerNewsServiceSpy.getNewestStories).toHaveBeenCalledWith(1, 10, '');
  });

  it('should handle error on loadStories', () => {
    hackerNewsServiceSpy.getNewestStories.and.returnValue(throwError(() => new Error('Failed')));

    component.loadStories();

    expect(component.isLoading).toBeFalse();
    expect(component.stories.length).toBe(0);
  });

  it('should reset to page 1 on search', () => {
    const response = { stories: mockStories, totalCount: 2 };
    hackerNewsServiceSpy.getNewestStories.and.returnValue(of(response));

    component.currentPage = 5;
    component.searchTerm = 'Angular';

    component.onSearch();

    expect(component.currentPage).toBe(1);
    expect(hackerNewsServiceSpy.getNewestStories).toHaveBeenCalledWith(1, 10, 'Angular');
  });

  it('should clear search term and reset to page 1', () => {
    const response = { stories: mockStories, totalCount: 2 };
    hackerNewsServiceSpy.getNewestStories.and.returnValue(of(response));

    component.searchTerm = 'React';
    component.clearSearch();

    expect(component.searchTerm).toBe('');
    expect(component.currentPage).toBe(1);
  });

  it('should go to next page when not on last page', () => {
    const response = { stories: mockStories, totalCount: 20 };
    hackerNewsServiceSpy.getNewestStories.and.returnValue(of(response));

    component.currentPage = 1;
    component.pageSize = 10;
    component.totalPages = 2;

    component.nextPage();

    expect(component.currentPage).toBe(2);
  });

  it('should go to previous page when not on first page', () => {
    const response = { stories: mockStories, totalCount: 20 };
    hackerNewsServiceSpy.getNewestStories.and.returnValue(of(response));

    component.currentPage = 2;
    component.prevPage();

    expect(component.currentPage).toBe(1);
  });

  it('getDomain should return hostname from URL', () => {
    const domain = component.getDomain('https://www.google.com/page');
    expect(domain).toBe('google.com');
  });

  it('getDomain should return input if invalid URL', () => {
    const domain = component.getDomain('not-a-url');
    expect(domain).toBe('not-a-url');
  });
});
