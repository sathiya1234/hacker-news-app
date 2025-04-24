import { Component, OnInit } from '@angular/core';
import { HackerNewsService } from '../../services/hacker-news.service'
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
  searchTerm = '';
  isSearching = false;

  constructor(private hackerNewsService: HackerNewsService) { }

  ngOnInit(): void {
    this.loadStories();
  }

  loadStories(): void {
    this.isSearching = false;
    this.hackerNewsService.getNewestStories(this.currentPage, this.pageSize)
      .subscribe(stories => this.stories = stories);
  }

  search(): void {
    if (!this.searchTerm.trim()) {
      this.loadStories();
      return;
    }

    this.isSearching = true;
    this.hackerNewsService.searchStories(this.searchTerm)
      .subscribe(stories => this.stories = stories);
  }

  nextPage(): void {
    if (this.isSearching) return;
    this.currentPage++;
    this.loadStories();
  }

  prevPage(): void {
    if (this.isSearching || this.currentPage <= 1) return;
    this.currentPage--;
    this.loadStories();
  }

  getDomain(url: string): string {
    if (!url) return '';
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      return domain;
    } catch {
      return url;
    }
  }
}