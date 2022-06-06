import { VStack } from '@chakra-ui/react'
import { collection, doc, onSnapshot } from 'firebase/firestore'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { CommunityDataState, PostCommentsState } from '../../../../atoms/atoms'
import Comment from '../../../../components/Post/Comment/Comment'
import PostCard from '../../../../components/Post/Posts/PostCard'
import { firestore } from '../../../../firebase/firebaseConfig'
import CommunityLayout from '../../../../Layout/CommunityLayout'
import Layout from '../../../../Layout/Layout'
import {
  CommunityData,
  PageQuery,
  PostComment,
  PostData,
} from '../../../../types'
import {
  getAllComments,
  getCommunity,
  getPost,
} from '../../../../utils/firebase'

const PostPage: NextPage<{
  post: PostData
  community: CommunityData
  comments: PostComment[]
}> = ({ post, comments: commentsData, community }) => {
  const router = useRouter()

  const { postId } = router.query as PageQuery

  const setCommunityData = useSetRecoilState(CommunityDataState)

  useEffect(() => {
    if (community) {
      setCommunityData(community)
    }
  }, [community])

  const [comments, setComments] = useRecoilState(PostCommentsState)

  useEffect(
    () =>
      onSnapshot(
        collection(firestore, 'posts', postId, 'postComments'),
        (postCommentsSnap) => {
          let comments: PostComment[] = []
          postCommentsSnap.docs.forEach((comment) =>
            comments.push({ ...comment.data(), id: comment.id } as PostComment)
          )
          setComments(comments)
          console.log(comments)
        }
      ),
    []
  )

  return (
    <Layout>
      <CommunityLayout>
        <PostCard postData={post} pageView />
        <Comment {...{ post, comments }} />
      </CommunityLayout>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { postId, communityName } = ctx.query as PageQuery

  const community = await getCommunity(communityName)
  const post = await getPost(postId)
  const comments = await getAllComments(postId)

  if (!post || !community || !community)
    return {
      notFound: true,
    }

  return {
    props: {
      community: JSON.parse(JSON.stringify(community)),
      post: JSON.parse(JSON.stringify(post)),
      comments: JSON.parse(JSON.stringify(comments)),
    },
  }
}

export default PostPage
