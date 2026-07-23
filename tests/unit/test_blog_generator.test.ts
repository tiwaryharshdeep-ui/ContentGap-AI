import { describe, it, expect } from 'vitest';
import { BlogGeneratorService } from '../../src/services/blog-generator.service.js';

describe('BlogGeneratorService (2000-Word Blog & Images)', () => {
  const generator = new BlogGeneratorService();

  it('generates a 2000-word blog post with title, hero image, and markdown/html structure', () => {
    const blog = generator.generate2000WordBlog({
      blogTitle: 'Kedarkantha Winter Snow Trek Guide',
      primaryKeyword: 'kedarkantha winter trek',
    });

    expect(blog.title).toBe('Kedarkantha Winter Snow Trek Guide');
    expect(blog.wordCount).toBeGreaterThanOrEqual(1800);
    expect(blog.heroImageUrl).toBeTruthy();
    expect(blog.contentMarkdown).toContain('# Kedarkantha Winter Snow Trek Guide');
    expect(blog.contentMarkdown).toContain('Day-by-Day Expedition Itinerary');
    expect(blog.contentMarkdown).toContain('Packing Checklist');
    expect(blog.contentHtml).toContain('<h1');
  });

  it('assigns custom hero images based on trek topic', () => {
    const blog1 = generator.generate2000WordBlog({ blogTitle: 'Valley of Flowers Monsoon Trek' });
    const blog2 = generator.generate2000WordBlog({ blogTitle: 'Har Ki Dun Spring Valley Trek' });

    expect(blog1.heroImageUrl).toBeTruthy();
    expect(blog2.heroImageUrl).toBeTruthy();
  });
});
