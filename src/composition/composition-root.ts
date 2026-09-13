import { BlogsRepository, blogsRepository } from '../blogs/repositories/blogs.repository';
import { BlogsService } from '../blogs/application/blogs.service';
import { BlogsController } from '../blogs/controllers/blogs.controller';

const objects: any[] = [];

objects.push(blogsRepository);

const blogsService = new BlogsService(blogsRepository);
objects.push(blogsService);

const blogsController = new BlogsController(blogsService);
objects.push(blogsController);

export const ioc = {
  getInstance<T>(ClassType: new (...args: any[]) => T): T {
    const targetInstance = objects.find((object) => object instanceof ClassType);
    return targetInstance as T;
  },
};