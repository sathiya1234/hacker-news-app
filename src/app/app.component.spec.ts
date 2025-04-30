import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms'; // ✅
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { StoryListComponent } from './components/story-list/story-list.component'; // adjust path as needed

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        StoryListComponent
      ],
      imports: [
        HttpClientTestingModule,
        FormsModule // ✅
      ]
    }).compileComponents();
  });

  it('should create the app component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the correct title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-story-list')).toBeTruthy();
  });
});
