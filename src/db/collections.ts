import { Collection, Db } from 'mongodb';
import { Blog } from '../blogs/types/blog';
import { Post } from '../posts/types/post';
import { User } from '../users/types/user';
import { Comment } from '../comments/types/comment';
import { DeviceSession } from '../security-devices/types/device-session';
import { RequestLog } from '../rate-limit/types/request-log';

export const BLOG_COLLECTION_NAME = 'blogs';
export const POST_COLLECTION_NAME = 'posts';
export const USER_COLLECTION_NAME = 'users';
export const COMMENT_COLLECTION_NAME = 'comments';
export const DEVICE_SESSION_COLLECTION_NAME = 'deviceSessions';
export const REQUEST_LOG_COLLECTION_NAME = 'requestsLog';

export let blogCollection: Collection<Blog>;
export let postCollection: Collection<Post>;
export let userCollection: Collection<User>;
export let commentCollection: Collection<Comment>;
export let deviceSessionCollection: Collection<DeviceSession>;
export let requestLogCollection: Collection<RequestLog>;

export function initCollections(db: Db): void {
  blogCollection = db.collection<Blog>(BLOG_COLLECTION_NAME);
  postCollection = db.collection<Post>(POST_COLLECTION_NAME);
  userCollection = db.collection<User>(USER_COLLECTION_NAME);
  commentCollection = db.collection<Comment>(COMMENT_COLLECTION_NAME);
  deviceSessionCollection = db.collection<DeviceSession>(DEVICE_SESSION_COLLECTION_NAME);
  requestLogCollection = db.collection<RequestLog>(REQUEST_LOG_COLLECTION_NAME);
}

export function getAllCollections(): Collection<any>[] {
  return [
    blogCollection,
    postCollection,
    userCollection,
    commentCollection,
    deviceSessionCollection,
    requestLogCollection,
  ];
}