import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { StoryListComponent } from './story-list.component';
import { HackerNewsService } from '../../services/hacker-news.service';
import { Story } from '../../models/story.model';

describe('StoryListComponent', () => {
  let component: StoryListComponent;
  let fixture: ComponentFixture<StoryListComponent>;
  let hackerNewsServiceSpy: jasmine.SpyObj<HackerNewsService>;

  const mockStories: Story[] = [
    { id: 1, title: 'Story 1', url: 'https://example.com/1'},
    { id: 2, title: 'Story 2', url: 'https://example.com/2'}
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('HackerNewsService', ['getNewestStories', 'searchStories']);

    await TestBed.configureTestingModule({
      declarations: [StoryListComponent],
      providers: [
        { provide: HackerNewsService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StoryListComponent);
    component = fixture.componentInstance;
    hackerNewsServiceSpy = TestBed.inject(HackerNewsService) as jasmine.SpyObj<HackerNewsService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call loadStories on init', () => {
      spyOn(component, 'loadStories');
      component.ngOnInit();
      expect(component.loadStories).toHaveBeenCalled();
    });
  });

  describe('loadStories', () => {
    it('should load stories and set properties on success', fakeAsync(() => {
      hackerNewsServiceSpy.getNewestStories.and.returnValue(of({ stories: mockStories, totalCount: 20 }));

      component.loadStories();
      tick();

      expect(component.isLoading).toBeFalse();
      expect(component.stories).toEqual(mockStories);
      expect(component.totalCount).toBe(20);
      expect(component.totalPages).toBe(2); // 20 / 10
    }));

    it('should set isLoading to false on error', fakeAsync(() => {
      hackerNewsServiceSpy.getNewestStories.and.returnValue(throwError(() => new Error('Error')));

      component.loadStories();
      tick();

      expect(component.isLoading).toBeFalse();
    }));
  });

  describe('search', () => {
    it('should not search if searchTerm is empty', () => {
      component.searchTerm = '  ';
      component.search();
      expect(hackerNewsServiceSpy.searchStories).not.toHaveBeenCalled();
    });

    it('should search and update stories on success', fakeAsync(() => {
      component.searchTerm = 'Angular';
      hackerNewsServiceSpy.searchStories.and.returnValue(of(mockStories));

      component.search();
      tick();

      expect(component.isSearching).toBeTrue();
      expect(component.isLoading).toBeFalse();
      expect(component.stories).toEqual(mockStories);
    }));

    it('should set isLoading to false on search error', fakeAsync(() => {
      component.searchTerm = 'Angular';
      hackerNewsServiceSpy.searchStories.and.returnValue(throwError(() => new Error('Search Error')));

      component.search();
      tick();

      expect(component.isLoading).toBeFalse();
    }));
  });

  describe('clearSearch', () => {
    it('should clear searchTerm, isSearching and reload stories', () => {
      spyOn(component, 'loadStories');

      component.searchTerm = 'something';
      component.isSearching = true;
      component.clearSearch();

      expect(component.searchTerm).toBe('');
      expect(component.isSearching).toBeFalse();
      expect(component.loadStories).toHaveBeenCalled();
    });
  });

  describe('nextPage', () => {
    it('should increment currentPage and loadStories if not last page', () => {
      spyOn(component, 'loadStories');
      component.currentPage = 1;
      component.totalPages = 3;

      component.nextPage();

      expect(component.currentPage).toBe(2);
      expect(component.loadStories).toHaveBeenCalled();
    });

    it('should not go to nextPage if on last page', () => {
      spyOn(component, 'loadStories');
      component.currentPage = 3;
      component.totalPages = 3;

      component.nextPage();

      expect(component.currentPage).toBe(3);
      expect(component.loadStories).not.toHaveBeenCalled();
    });
  });

  describe('prevPage', () => {
    it('should decrement currentPage and loadStories if not on first page', () => {
      spyOn(component, 'loadStories');
      component.currentPage = 2;

      component.prevPage();

      expect(component.currentPage).toBe(1);
      expect(component.loadStories).toHaveBeenCalled();
    });

    it('should not go to prevPage if already on first page', () => {
      spyOn(component, 'loadStories');
      component.currentPage = 1;

      component.prevPage();

      expect(component.currentPage).toBe(1);
      expect(component.loadStories).not.toHaveBeenCalled();
    });
  });

  describe('getDomain', () => {
    it('should extract domain from valid url', () => {
      const url = 'https://www.example.com/page';
      expect(component.getDomain(url)).toBe('example.com');
    });

    it('should return input if url is invalid', () => {
      const url = 'invalid-url';
      expect(component.getDomain(url)).toBe('invalid-url');
    });
  });
});
