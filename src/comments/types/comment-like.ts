export enum LikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

export type CommentLike = {
  commentId: string;
  userId: string;
  status: LikeStatus;
  createdAt: Date;
};

export type LikeInputModel = {
  likeStatus: LikeStatus;
};

export type LikesInfoViewModel = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
};