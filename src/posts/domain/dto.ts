import { LikeStatus } from '../../comments/types/comment-like';

export class CreatePostDto {
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
  ) {}
}

export class UpdatePostDto {
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
  ) {}
}

export class CreatePostLikeDto {
  constructor(
    public postId: string,
    public userId: string,
    public login: string,
    public status: LikeStatus,
  ) {}
}