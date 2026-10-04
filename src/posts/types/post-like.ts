import { LikeStatus } from '../../comments/types/comment-like';

export type PostLike = {
  postId: string;
  userId: string;
  login: string;
  status: LikeStatus;
  addedAt: Date;
};

export type LikeDetailsViewModel = {
  addedAt: string;
  userId: string;
  login: string;
};

export type ExtendedLikesInfoViewModel = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
  newestLikes: LikeDetailsViewModel[];
};