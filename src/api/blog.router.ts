import { Router, Request, Response } from 'express';
import { BlogGeneratorService } from '../services/blog-generator.service.js';

export const blogRouter = Router();
const blogGenerator = new BlogGeneratorService();

/**
 * POST /api/blog/generate
 * Generates a full 2000-word SEO-optimized blog post with images for a trek event
 */
blogRouter.post('/generate', (req: Request, res: Response) => {
  try {
    const { title, primaryKeyword, targetAudience, searchIntent, cta, publishDate } = req.body;

    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'Title string is required' });
    }

    const blog = blogGenerator.generate2000WordBlog({
      blogTitle: title,
      primaryKeyword,
      targetAudience,
      searchIntent,
      cta,
      publishDate,
    });

    res.status(200).json(blog);
  } catch (error: any) {
    res.status(500).json({ error: 'Blog Generation Failed', message: error.message });
  }
});

/**
 * GET /api/blog/export-markdown?title=...
 * Downloads the 2000-word blog as a markdown file (.md)
 */
blogRouter.get('/export-markdown', (req: Request, res: Response) => {
  try {
    const title = (req.query.title as string) || 'Himalayan Trek Guide';
    const blog = blogGenerator.generate2000WordBlog({ blogTitle: title });

    const filename = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-2000-word-blog.md`;

    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(blog.contentMarkdown);
  } catch (error: any) {
    res.status(500).json({ error: 'Blog Export Failed', message: error.message });
  }
});
