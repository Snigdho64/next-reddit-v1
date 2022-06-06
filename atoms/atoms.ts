import { atom, RecoilState } from 'recoil'
import { CommunityData, PostComment, PostData, UserData } from '../types'

export const AuthModalState: RecoilState<{
  open: boolean
  view?: 'login' | 'signup' | 'resetPassword'
}> = atom({
  key: 'authModalState',
  default: {
    open: false,
    view: 'login',
  },
})

export const CommunityModalState: RecoilState<boolean> = atom({
  key: 'communityModalState',
  default: false,
})

export const UserDataState: RecoilState<UserData> = atom({
  key: 'userDataState',
  default: null,
})

export const CommunityDataState: RecoilState<CommunityData> = atom({
  key: 'communityDataState',
  default: null,
})

export const PostsState: RecoilState<PostData[]> = atom({
  key: 'postDataState',
  default: [],
})

export const PostCommentsState: RecoilState<PostComment[]> = atom({
  key: 'postCommentsState',
  default: [],
})
