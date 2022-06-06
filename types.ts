import { ComponentWithAs } from '@chakra-ui/react'
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace'
import { Timestamp } from 'firebase/firestore'
import { ParsedUrlQuery } from 'querystring'
import { IconType } from 'react-icons'

export type CommunityInfo = {
  name: string
  privacyType?: 'public' | 'private' | 'restricted'
  imageURL?: string
  isModerator?: boolean
}

export interface CommunityData extends CommunityInfo {
  id: string
  membersCount: number
  creator: UserData
  createdAt: Timestamp
  coverImageURL?: string
}

export type UserInfo = {
  username: string
  photoURL?: string
}

export interface UserData extends UserInfo {
  email: string
  uid: string
  userCommunities: CommunityInfo[]
}

export type PostFormInput = {
  title: string
  description?: string
}

export interface NewPostData extends PostFormInput {
  media?: File
}

export type MediaData = {
  name: string
  type: string
  size: string
  URL: string
}

export interface PostData extends PostFormInput {
  id?: string
  media?: MediaData
  createdBy: UserInfo
  community: CommunityInfo
  createdAt: Timestamp
  votesCount: number
  commentsCount: number
}

export type PostVote = {
  uid?: string
  username: string
  type: 'upvote' | 'downvote'
}

export type PostComment = {
  id: string
  uid: string
  username: string
  photoURL?: string
  text: string
  mediaURL?: string
  timestamp: Timestamp
}

export interface PageQuery extends ParsedUrlQuery {
  communityName?: string
  postId?: string
}

export type PostTabItems = 'Post' | 'Images & Videos' | 'Link' | 'Poll' | 'Talk'

export type UserMenuItem = {
  name: string
  icon: IconType | ComponentWithAs<'svg'>
  action: () => {} | void
  rightIcon?: ReactJSXElement
}
