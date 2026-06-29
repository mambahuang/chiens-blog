import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export function getAllPosts() {
  if (!fs.existsSync(postsDirectory)) return [];

  const fileNames = fs.readdirSync(postsDirectory).filter((f) => f.endsWith('.md'));
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      id,
      title: data.title ?? id,
      date: data.date ?? '',
      tags: data.tags ?? [],
      category: data.category ?? 'Uncategorized',
      excerpt: data.excerpt ?? '',
      content,
    };
  });

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}
