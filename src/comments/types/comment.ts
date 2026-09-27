import { LikesInfoViewModel } from './comment-like';

export type CommentatorInfo = {
  userId: string;
  userLogin: string;
};

export type Comment = {
  postId: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: Date;
  likesCount: number;
  dislikesCount: number;
};

export type CommentInputModel = {
  content: string;
};

export type CommentViewModel = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
  likesInfo: LikesInfoViewModel;
};

export type CommentQueryInput = {
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: number;
};