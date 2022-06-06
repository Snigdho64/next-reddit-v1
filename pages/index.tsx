import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useColorMode,
  VStack,
} from '@chakra-ui/react'
import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import Posts from '../components/Post/Posts/Posts'
import Layout from '../Layout/Layout'
import { PostData } from '../types'
import { getAllCommunities, getAllPosts } from '../utils/firebase'

const IndexPage: NextPage<{ posts: PostData[] }> = ({ posts }) => {

  return (
    <Layout>
      <title>Next Reddit</title>
      <Flex w="full" h="full" p={[2, 4, 6]} justify="space-around">
        <Posts posts={posts} />
      </Flex>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const posts = await getAllPosts()
  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
    },
  }
}

export default IndexPage
