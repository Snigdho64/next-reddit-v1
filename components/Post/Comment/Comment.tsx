import {
  Center,
  HStack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import useCommentAction from '../../../hooks/useCommentAction'
import { PostComment, PostData } from '../../../types'
import CommentCard from './CommentCard'
import CreateComment from './CreateComment'

const Comment: React.FC<{
  post: PostData
  comments: PostComment[]
}> = ({ post, comments }) => {
  const color = useColorModeValue('gray.700', 'gray.100')

  return (
    <VStack
      spacing={0}
      bg={'white'}
      maxWidth="800px"
      w="96%"
      p={8}
      rounded={['md', 'lg', 'xl']}
      color={color}
    >
      <CreateComment {...{ post }} />
      {comments.length > 0 ? (
        comments.map((comment) => (
          <VStack align="start" w="full" key={comment.id}>
            <CommentCard {...{ comment, post }} />)
          </VStack>
        ))
      ) : (
        <Center>
          <Text>No Comments Yet!</Text>
        </Center>
      )}
    </VStack>
  )
}

export default Comment
