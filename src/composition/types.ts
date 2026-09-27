export const TYPES = {
  BlogsRepository: Symbol.for('BlogsRepository'),
  BlogsService: Symbol.for('BlogsService'),
  BlogsController: Symbol.for('BlogsController'),

  PostsRepository: Symbol.for('PostsRepository'),
  PostsService: Symbol.for('PostsService'),
  PostsController: Symbol.for('PostsController'),

  CommentsRepository: Symbol.for('CommentsRepository'),
  CommentLikesRepository: Symbol.for('CommentLikesRepository'),
  CommentsService: Symbol.for('CommentsService'),
  CommentsController: Symbol.for('CommentsController'),

  UsersRepository: Symbol.for('UsersRepository'),
  UsersService: Symbol.for('UsersService'),
  UsersController: Symbol.for('UsersController'),

  DeviceSessionsRepository: Symbol.for('DeviceSessionsRepository'),
  SecurityDevicesService: Symbol.for('SecurityDevicesService'),
  SecurityDevicesController: Symbol.for('SecurityDevicesController'),

  RequestLogRepository: Symbol.for('RequestLogRepository'),

  JwtService: Symbol.for('JwtService'),
  NodemailerService: Symbol.for('NodemailerService'),
  AuthService: Symbol.for('AuthService'),
  AuthController: Symbol.for('AuthController'),
  PasswordRecoveryService: Symbol.for('PasswordRecoveryService'),
  PasswordRecoveryController: Symbol.for('PasswordRecoveryController'),
};