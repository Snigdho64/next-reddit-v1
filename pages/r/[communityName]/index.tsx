import { Flex, Text } from '@chakra-ui/react'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { CommunityDataState, PostsState } from '../../../atoms/atoms'
import CreatePostLink from '../../../components/Community/CreatePostLink'
import Posts from '../../../components/Post/Posts/Posts'
import CommunityLayout from '../../../Layout/CommunityLayout'
import Layout from '../../../Layout/Layout'
import { CommunityData, PageQuery, PostData } from '../../../types'
import { getAllCommunityPosts, getCommunity } from '../../../utils/firebase'

const CommunityPage: NextPage<{
  community: CommunityData
  posts: PostData[]
}> = ({ community, posts }) => {
  const [communityData, setCommunityData] = useRecoilState(CommunityDataState)
  const [postsData, setPostsData] = useRecoilState(PostsState)
  const router = useRouter()

  useEffect(() => {
    if (community) {
      setCommunityData(community)
      setPostsData(posts)
    }
  }, [community])

  if (!communityData) return <Flex>Community Not Found</Flex>

  return (
    <Layout>
      <CommunityLayout>
        <CreatePostLink
          onClick={() => router.push(`/r/${community.name}/submit`)}
        />
        {postsData && <Posts posts={postsData} />}
      </CommunityLayout>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { communityName } = ctx.query as PageQuery

  const community = await getCommunity(communityName)

  if (typeof community === 'undefined') {
    return {
      props: {
        community: JSON.parse(JSON.stringify('')),
      },
    }
  } else {
    const posts = await getAllCommunityPosts(community.name)
    return {
      props: {
        community: JSON.parse(JSON.stringify(community)),
        posts: JSON.parse(JSON.stringify(posts)),
      },
    }
  }
}

export default CommunityPage
