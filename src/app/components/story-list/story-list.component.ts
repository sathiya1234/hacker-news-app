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
  totalCount = 0; // Total count of stories
  totalPages = 0; // Total number of pages
  searchTerm = '';
  isSearching = false;
  isLoading = false;

  constructor(private hackerNewsService: HackerNewsService) {}

  ngOnInit(): void {
    this.loadStories();
  }

  loadStories(): void {
    this.isLoading = true;
    this.hackerNewsService.getNewestStories(this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          this.stories = response.stories; // Updated to reflect StoryModel
          this.totalCount = response.totalCount;
          this.totalPages = Math.ceil(this.totalCount / this.pageSize); // Calculate total pages
          this.isLoading = false;
        },
        error: () => this.isLoading = false
      });
  }

  search(): void {
    if (!this.searchTerm.trim()) return;
    
    this.isSearching = true;
    this.isLoading = true;
    this.hackerNewsService.searchStories(this.searchTerm)
      .subscribe({
        next: (stories) => {
          this.stories = stories;
          this.isLoading = false;
        },
        error: () => this.isLoading = false
      });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.isSearching = false;
    this.loadStories();
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
