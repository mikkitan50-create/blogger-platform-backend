import { Container } from 'inversify';
import { TYPES } from './types';
import { BlogsRepository } from '../blogs/repositories/blogs.repository';
import { BlogsService } from '../blogs/application/blogs.service';
import { BlogsController } from '../blogs/controllers/blogs.controller';
import { UsersRepository } from '../users/repositories/users.repository';
import { UsersService } from '../users/application/users.service';
import { UsersController } from '../users/controllers/users.controller';
import { PostsRepository } from '../posts/repositories/posts.repository';
import { PostsService } from '../posts/application/posts.service';
import { PostsController } from '../posts/controllers/posts.controller';
import { CommentsRepository } from '../comments/repositories/comments.repository';
import { CommentsService } from '../comments/application/comments.service';
import { CommentsController } from '../comments/controllers/comments.controller';
import { DeviceSessionsRepository } from '../security-devices/repositories/device-sessions.repository';
import { SecurityDevicesService } from '../security-devices/application/security-devices.service';
import { SecurityDevicesController } from '../security-devices/controllers/security-devices.controller';
import { RequestLogRepository } from '../rate-limit/repositories/request-log.repository';
import { JwtService } from '../auth/adapters/jwt.service';
import { NodemailerService } from '../auth/adapters/nodemailer.service';
import { AuthService } from '../auth/application/auth.service';
import { AuthController } from '../auth/controllers/auth.controller';
import { PasswordRecoveryService } from '../auth/application/password-recovery.service';
import { PasswordRecoveryController } from '../auth/controllers/password-recovery.controller';

export const container = new Container();

container.bind<BlogsRepository>(TYPES.BlogsRepository).to(BlogsRepository).inSingletonScope();
container.bind<BlogsService>(TYPES.BlogsService).to(BlogsService).inSingletonScope();
container.bind<BlogsController>(TYPES.BlogsController).to(BlogsController).inSingletonScope();

container.bind<UsersRepository>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope();
container.bind<UsersService>(TYPES.UsersService).to(UsersService).inSingletonScope();
container.bind<UsersController>(TYPES.UsersController).to(UsersController).inSingletonScope();

container.bind<PostsRepository>(TYPES.PostsRepository).to(PostsRepository).inSingletonScope();
container.bind<PostsService>(TYPES.PostsService).to(PostsService).inSingletonScope();
container.bind<PostsController>(TYPES.PostsController).to(PostsController).inSingletonScope();

container.bind<CommentsRepository>(TYPES.CommentsRepository).to(CommentsRepository).inSingletonScope();
container.bind<CommentsService>(TYPES.CommentsService).to(CommentsService).inSingletonScope();
container.bind<CommentsController>(TYPES.CommentsController).to(CommentsController).inSingletonScope();

container.bind<DeviceSessionsRepository>(TYPES.DeviceSessionsRepository).to(DeviceSessionsRepository).inSingletonScope();
container.bind<SecurityDevicesService>(TYPES.SecurityDevicesService).to(SecurityDevicesService).inSingletonScope();
container.bind<SecurityDevicesController>(TYPES.SecurityDevicesController).to(SecurityDevicesController).inSingletonScope();

container.bind<RequestLogRepository>(TYPES.RequestLogRepository).to(RequestLogRepository).inSingletonScope();

container.bind<JwtService>(TYPES.JwtService).to(JwtService).inSingletonScope();
container.bind<NodemailerService>(TYPES.NodemailerService).to(NodemailerService).inSingletonScope();
container.bind<AuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
container.bind<AuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();
container.bind<PasswordRecoveryService>(TYPES.PasswordRecoveryService).to(PasswordRecoveryService).inSingletonScope();
container.bind<PasswordRecoveryController>(TYPES.PasswordRecoveryController).to(PasswordRecoveryController).inSingletonScope();