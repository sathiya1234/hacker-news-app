import { Component, OnInit } from '@angular/core';
import { HackerNewsService } from '../../services/hacker-news.service';
import { Story } from '../../models/story.model';

@Component({
  selector: 'app-story-list',
  standalone: false,
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.css']
})
export class StoryListComponent implements OnInit {
  stories: Story[] = [];
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 0;
  searchTerm = '';
  isLoading = false;

  constructor(private hackerNewsService: HackerNewsService) {}

  ngOnInit(): void {
    this.loadStories();
  }

  loadStories(): void {
    this.isLoading = true;
    this.hackerNewsService.getNewestStories(this.currentPage, this.pageSize, this.searchTerm)
      .subscribe({
        next: (response) => {
          this.stories = response.stories;
          this.totalCount = response.totalCount;
          this.totalPages = Math.ceil(this.totalCount / this.pageSize);
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          // Handle error (show toast/message)
        }
      });
  }

  onSearch(): void {
    this.currentPage = 1; // Reset to first page when searching
    this.loadStories();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.onSearch();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadStories();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadStories();
    }
  }

  getDomain(url: string): string {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  }
}