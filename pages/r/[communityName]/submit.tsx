import { Flex, HStack, Text } from '@chakra-ui/react'
import { GetServerSideProps, NextPage } from 'next'
import React, { useEffect } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { CommunityDataState } from '../../../atoms/atoms'
import CreatePost from '../../../components/Post/CreatePost/CreatePost'
import CommunityLayout from '../../../Layout/CommunityLayout'
import Layout from '../../../Layout/Layout'
import { CommunityData, PageQuery } from '../../../types'
import { getCommunity } from '../../../utils/firebase'

const SubmitPostPage: NextPage<{ community: CommunityData }> = ({
  community,
}) => {
  const [communityData, setCommunityData] = useRecoilState(CommunityDataState)
  useEffect(() => {
    if (community) setCommunityData(community)
  }, [community])

  return communityData ? (
    <Layout>
      <CommunityLayout hideHeader>
        <CreatePost community={communityData} />
      </CommunityLayout>
    </Layout>
  ) : (
    <Layout>
      <Text>Community Not Found</Text>
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
    return {
      props: {
        community: JSON.parse(JSON.stringify(community)),
      },
    }
  }
}

export default SubmitPostPage
