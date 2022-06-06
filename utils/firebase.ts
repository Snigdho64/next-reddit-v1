import {
  NewPostData,
  PostComment,
  PostData,
  PostVote,
  UserInfo,
} from './../types'
import { User } from 'firebase/auth'
import {
  addDoc,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage'
import { firestore, storage } from '../firebase/firebaseConfig'
import { CommunityData, CommunityInfo, UserData } from '../types'

const usersRef = collection(firestore, 'users')
const communitiesRef = collection(firestore, 'communities')
const postsRef = collection(firestore, 'posts')

export const saveToFirestore = async (user: User) => {
  const { email, displayName, emailVerified, providerData, uid, photoURL } =
    user
  const username = displayName || email.split('@')[0]
  const providerId = providerData[0].providerId
  await setDoc(doc(usersRef, uid), {
    email,
    username,
    emailVerified,
    providerId,
    uid,
    photoURL,
  })
}

export const getUserData = async (user: User) => {
  const userSnap = await getDoc(doc(usersRef, user.uid))
  if (userSnap.exists()) {
    const userInfo = userSnap.data() as any
    let userCommunities: CommunityInfo[] = []
    const userCommunitesSnap = await getDocs(
      collection(userSnap.ref, 'userCommunities')
    )
    if (!userCommunitesSnap.empty)
      userCommunitesSnap.docs.forEach((doc) =>
        userCommunities.push(doc.data() as CommunityInfo)
      )
    return { ...userInfo, userCommunities } as UserData
  }
}

export const getCommunity = async (name: string) => {
  const q = query(communitiesRef, where('name', '==', name))
  const docs = await getDocs(q)
  if (!docs.empty) {
    const comDoc = docs.docs[0]
    return { id: comDoc.id, ...comDoc.data() } as CommunityData
  }
}

export const createCommunity = async (
  name: string,
  privacyType: string,
  creator: User
) => {
  const { uid, email, displayName, photoURL } = creator
  const username = displayName || email.split('@')[0]
  const comDoc = await addDoc(communitiesRef, {
    name,
    privacyType,
    creator: {
      email,
      username,
      photoURL,
      uid,
    },
    createdAt: serverTimestamp(),
    membersCount: 1,
  })

  await setDoc(doc(communitiesRef, comDoc.id, 'communityUsers', uid), {
    username,
    photoURL,
    email,
  })

  await setDoc(doc(usersRef, creator.uid, 'userCommunities', comDoc.id), {
    name,
    privacyType,
    isModerator: true,
  })
}

export const joinLeaveCommunity = async (
  community: CommunityData,
  user: UserData
): Promise<['joined' | 'left', string]> => {
  if (!user || !community) return

  const { id, name, privacyType } = community
  const { uid, username } = user

  const userComDocRef = doc(usersRef, uid, 'userCommunities', id)
  const comUserDocRef = doc(communitiesRef, id, 'communityUsers', uid)
  try {
    const userCommunitySnap = await getDoc(userComDocRef)

    const alreadyJoined = userCommunitySnap.exists()
    if (alreadyJoined) {
      await deleteDoc(userComDocRef)
      await deleteDoc(comUserDocRef)
      await updateDoc(doc(communitiesRef, id), {
        memebersCount: increment(-1),
      })
      return ['left', null]
    } else {
      await setDoc(userComDocRef, {
        name,
        imageURL: community?.imageURL || null,
        privacyType,
      })
      await setDoc(comUserDocRef, {
        username,
        photoURL: user?.photoURL || null,
      })
      await updateDoc(doc(communitiesRef, id), {
        memebersCount: increment(1),
      })
      return ['joined', null]
    }
  } catch (e) {
    console.log(e.message)
    return [null, e.message as string]
  }
}

export const savePostToFirestore = async (
  newPostData: NewPostData,
  userInfo: UserInfo,
  communityInfo: CommunityInfo
): Promise<['success' | 'error', string]> => {
  const { title, description, media } = newPostData
  const { username, photoURL } = userInfo
  const { name, imageURL } = communityInfo

  const postData: PostData = {
    title,
    description,
    createdBy: {
      username,
      photoURL: photoURL || null,
    },
    community: {
      name,
      imageURL: imageURL || null,
    },
    votesCount: 0,
    commentsCount: 0,
    createdAt: serverTimestamp() as Timestamp,
  }

  try {
    const post = await addDoc(postsRef, postData)
    const postRef = ref(storage, `posts/${post.id}`)
    if (media) {
      const result = await uploadBytes(postRef, media)
      const downloadUrl = await getDownloadURL(result.ref)
      await updateDoc(doc(postsRef, post.id), {
        media: {
          name: media.name,
          type: media.type,
          size: media.size,
          URL: downloadUrl,
        },
        createdAt: serverTimestamp(),
      })
    }
    return ['success', null]
  } catch (e) {
    console.log(e.message)
    return ['error', e.message]
  }
}

export const getAllCommunityPosts = async (communityName: string) => {
  try {
    const snap = await getDocs(
      query(
        postsRef,
        where('community.name', '==', communityName),
        orderBy('createdAt', 'desc')
      )
    )
    let posts: PostData[] = []
    if (snap.empty) return []
    snap.docs.forEach((doc) =>
      posts.push({ id: doc.id, ...(doc.data() as PostData) })
    )
    return posts
  } catch (e) {
    console.log(e.message)
  }
}

export const deletePostFromFirestore = async (
  postId: string
): Promise<['success' | 'error', string]> => {
  try {
    const postRef = doc(postsRef, postId)
    const post = await getDoc(postRef)
    if (!post.exists()) return ['error', 'Post Not Found']
    const postData = post.data() as PostData
    if (postData.media) {
      const mediaRef = ref(storage, `posts/${post.id}`)
      await deleteObject(mediaRef)
    }
    await deleteDoc(postRef)
    return ['success', 'Post Deleted Successfully']
  } catch (e) {
    console.log(e.message)
    return ['error', e.message || 'Server Errror']
  }
}

export const changeCommunityImage = async (
  userId: string,
  communityId: string,
  image: File,
  coverImage?: File
): Promise<['success' | 'error', string]> => {
  const communityRef = doc(communitiesRef, communityId)
  const userCommunityRef = doc(usersRef, 'userCommunities', communityId)

  const storageRef = ref(storage, `communities/${communityId}`)
  try {
    let imageURL = ''
    let coverImageURL = ''
    if (image) {
      const result = await uploadBytes(storageRef, image)
      imageURL = await getDownloadURL(result.ref)
    }
    if (coverImage) {
      const result = await uploadBytes(storageRef, image)
      coverImageURL = await getDownloadURL(result.ref)
    }
    await updateDoc(communityRef, { imageURL, coverImageURL })
    await updateDoc(userCommunityRef, { imageURL, coverImageURL })
    return ['success', 'Image Updated successfully']
  } catch (e) {
    return ['error', 'Could not upload Image']
  }
}

export const votePost = async (
  postId: string,
  userId: string,
  type: 'upvote' | 'downvote'
) => {
  try {
    const postDocRef = doc(postsRef, postId)
    const post = await getDoc(postDocRef)
    if (!post.exists()) return ['error', 'Could not find post']
    const postData = post.data() as PostData
    let votesCount = postData.votesCount
    const postVoteDocRef = doc(postDocRef, 'postVotes', userId)
    const postVote = await getDoc(postVoteDocRef)
    if (postVote.exists()) {
      const voteType = (postVote.data() as PostVote).type
      if (voteType === 'upvote') {
        if (type === 'upvote') {
          await deleteDoc(postVoteDocRef)
          --votesCount
        } else {
          await updateDoc(postVoteDocRef, { type: 'downvote' })
          votesCount -= 2
        }
      } else {
        if (type === 'downvote') {
          await deleteDoc(postVoteDocRef)
          ++votesCount
        } else {
          await updateDoc(postVoteDocRef, { type: 'upvote' })
          votesCount += 2
        }
      }
    } else {
      await setDoc(postVoteDocRef, {
        uid: userId,
        type,
      })
      votesCount += type === 'upvote' ? 1 : -1
    }
    await updateDoc(postDocRef, { votesCount })
    return ['success', 'Successfully Voted']
  } catch (e) {
    return ['error', 'Error While Voting']
  }
}

export const getPost = async (postId: string) => {
  const post = await getDoc(doc(postsRef, postId))
  if (!post.exists()) return
  return { id: post.id, ...post.data() } as PostData
}

export const createComment = async (
  postId: string,
  user: UserData,
  text: string
): Promise<['success' | 'error', string]> => {
  const { username, email, photoURL, uid } = user
  try {
    const postDocRef = doc(postsRef, postId)
    const post = await getDoc(postDocRef)
    if (!post.exists()) return ['error', 'Could not find post']
    const postCommentsRef = collection(postDocRef, 'postComments')
    await addDoc(postCommentsRef, {
      uid,
      username,
      photoURL: photoURL || null,
      text: text,
      timestamp: serverTimestamp(),
    })
    await updateDoc(postDocRef, { commentsCount: increment(1) })
    return ['success', 'Comment successfully']
  } catch (e) {
    console.log(e.message)
    return ['error', 'Fail To Comment']
  }
}

export const editPostComment = async (
  postId: string,
  commentId: string,
  text: string
): Promise<['success' | 'error', string]> => {
  try {
    const postDocRef = doc(postsRef, postId)
    const post = await getDoc(postDocRef)
    if (!post.exists()) return ['error', 'Could not find post']
    const postCommentsRef = doc(postDocRef, 'postComments', commentId)
    await updateDoc(postCommentsRef, {
      text: text,
      editedAt: serverTimestamp(),
    })
    return ['success', 'Comment Update']
  } catch (e) {
    console.log(e.message)
    return ['error', 'Fail To Update']
  }
}

export const getAllComments = async (postId: string) => {
  try {
    const postDocRef = doc(postsRef, postId)
    const post = await getDoc(postDocRef)
    if (!post.exists()) return
    const postCommentsRef = collection(postDocRef, 'postComments')

    const postCommentsSnap = await getDocs(postCommentsRef)

    let comments: PostComment[] = []
    postCommentsSnap.docs.forEach((doc) => {
      comments.push({ ...doc.data(), id: doc.id } as PostComment)
    })

    return comments
  } catch (e) {
    console.log(e.message)
  }
}

export const deletePostComment = async (
  postId: string,
  commentId: string
): Promise<['success' | 'error', string]> => {
  try {
    const postDocRef = doc(postsRef, postId)
    const post = await getDoc(postDocRef)
    if (!post.exists()) return
    const postCommentDocRef = doc(postDocRef, 'postComments', commentId)

    await deleteDoc(postCommentDocRef)

    await updateDoc(postDocRef, { commentsCount: increment(-1) })

    return ['success', 'Comment Deleted']
  } catch (e) {
    console.log(e.message)
    return ['error', 'Failed to delete']
  }
}

export const getAllCommunities = async () => {
  try {
    const comSnap = await getDocs(
      query(communitiesRef, orderBy('createdAt', 'desc'))
    )
    let communities: CommunityData[] = []
    comSnap.docs.forEach((doc) =>
      communities.push({ ...doc.data(), id: doc.id } as CommunityData)
    )
    return communities
  } catch (e) {
    console.log(e?.message || 'Failed to get communities')
  }
}

export const getAllPosts = async () => {
  try {
    const postsSnap = await getDocs(
      query(postsRef, orderBy('createdAt', 'desc'))
    )
    let posts: PostData[] = []
    postsSnap.docs.forEach((doc) =>
      posts.push({ ...doc.data(), id: doc.id } as PostData)
    )
    return posts
  } catch (e) {
    console.log(e?.message || 'Failed to get posts')
  }
}
