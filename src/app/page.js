import { getAllPosts } from '../lib/markdown';
import BlogApp from '../components/BlogApp';

export default function Page() {
  const posts = getAllPosts();
  return <BlogApp posts={posts} />;
}
