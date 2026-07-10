// src/posts/repositories/posts.repository.ts

import { db } from '../../db/in-memory.db';
import { Post, PostInputModel } from '../types/post';
import { blogsRepository } from '../../blogs/repositories/blogs.repository';

export const postsRepository = {
  findAll(): Post[] {
    return db.posts;
  },

  findById(id: string): Post | null {
    return db.posts.find((p) => p.id === id) ?? null;
  },

  create(data: PostInputModel): Post | null {
    const blog = blogsRepository.findById(data.blogId);
    if (!blog) return null;

    const lastPost = db.posts[db.posts.length - 1];
    const newId = lastPost ? Number(lastPost.id) + 1 : 1;

    const newPost: Post = {
      id: String(newId),
      title: data.title,
      shortDescription: data.shortDescription,
      content: data.content,
      blogId: data.blogId,
      blogName: blog.name,
    };

    db.posts.push(newPost);
    return newPost;
  },

  update(id: string, data: PostInputModel): boolean {
    const index = db.posts.findIndex((p) => p.id === id);
    if (index === -1) return false;

    const blog = blogsRepository.findById(data.blogId);
    if (!blog) return false;

    db.posts[index] = {
      ...db.posts[index],
      title: data.title,
      shortDescription: data.shortDescription,
      content: data.content,
      blogId: data.blogId,
      blogName: blog.name,
    };
    return true;
  },

  delete(id: string): boolean {
    const index = db.posts.findIndex((p) => p.id === id);
    if (index === -1) return false;

    db.posts.splice(index, 1);
    return true;
  },
};