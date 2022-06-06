import { Center, Flex, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { PostsState } from '../../../atoms/atoms'
import { PostData } from '../../../types'
import PostCard from './PostCard'

const Posts: React.FC<{ posts: PostData[] }> = ({ posts }) => {
  return (
    <VStack minH="full" gap={[5, 7, 10]}>
      {posts.length === 0 ? (
        <Center>
          PostCard<Text>Nothing Posted Yet!</Text>
        </Center>
      ) : (
        posts.map((post) => <PostCard postData={post} key={post.id} />)
      )}
    </VStack>
  )
}

export default Posts
