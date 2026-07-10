// src/blogs/repositories/blogs.repository.ts

import { db } from '../../db/in-memory.db';
import { Blog, BlogInputModel } from '../types/blog';

export const blogsRepository = {
  findAll(): Blog[] {
    return db.blogs;
  },

  findById(id: string): Blog | null {
    return db.blogs.find((b) => b.id === id) ?? null;
  },

  create(data: BlogInputModel): Blog {
    const lastBlog = db.blogs[db.blogs.length - 1];
    const newId = lastBlog ? Number(lastBlog.id) + 1 : 1;

    const newBlog: Blog = {
      id: String(newId),
      ...data,
    };

    db.blogs.push(newBlog);
    return newBlog;
  },

  update(id: string, data: BlogInputModel): boolean {
    const index = db.blogs.findIndex((b) => b.id === id);
    if (index === -1) return false;

    db.blogs[index] = { ...db.blogs[index], ...data };
    return true;
  },

  delete(id: string): boolean {
    const index = db.blogs.findIndex((b) => b.id === id);
    if (index === -1) return false;

    db.blogs.splice(index, 1);
    return true;
  },
};