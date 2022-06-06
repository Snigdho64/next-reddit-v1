import {
  Avatar,
  Center,
  Flex,
  HStack,
  Icon,
  Image,
  Link,
  MenuButton,
  Spinner,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import {
  BsFillArrowDownCircleFill,
  BsFillArrowUpCircleFill,
} from 'react-icons/bs'
import Moment from 'react-moment'
import useCommentAction from '../../../hooks/useCommentAction'
import { PostComment, PostData } from '../../../types'

const CommentCard: React.FC<{ comment: PostComment; post: PostData }> = ({
  comment,
  post,
}) => {
  const [isEdit, setIsEdit] = useState(false)
  const [text, setText] = useState(comment.text)
  const { loading, deleteComment, editComment } = useCommentAction()

  return (
    <HStack w="full" p={[0.5, 1, 1.5]}>
      <Avatar src={comment.photoURL} />
      <VStack maxW="80%" flex={1}>
        <HStack
          fontSize={['xs', 'sm', 'sm', 'md']}
          fontWeight="bold"
          alignSelf={'flex-start'}
        >
          <Text fontSize={['sm', 'md']}>{comment.username}</Text>
          <Moment date={new Date(comment.timestamp?.seconds * 1000)} fromNow />
        </HStack>
        <Flex>
          <Textarea
            isDisabled={!isEdit}
            resize={'none'}
            value={text}
            onChange={(e) => setText(e.target.value)}
            _disabled={{ color: 'gray.700', outline: 'none', border: 'none' }}
          >
            {comment.text}
          </Textarea>
        </Flex>
        <HStack alignSelf="flex-start" gap={4}>
          <Center gap={2}>
            <Icon as={BsFillArrowUpCircleFill} cursor="pointer" />
            <Text>{0}</Text>
            <Icon as={BsFillArrowDownCircleFill} cursor="pointer" />
          </Center>
          <Center gap={2}>
            <Link onClick={() => setIsEdit(!isEdit)}>
              {isEdit ? 'Cancel' : 'Edit'}
            </Link>
            {isEdit ? (
              <Link
                onClick={() => {
                  if (text === comment.text || !text.trim())
                    return setIsEdit(false)
                  editComment(post.id, comment.id, text).then(() =>
                    setIsEdit(false)
                  )
                }}
              >
                Save
              </Link>
            ) : (
              <Link onClick={() => deleteComment(post.id, comment.id)}>
                Delete
              </Link>
            )}
          </Center>
          {loading && <Spinner />}
        </HStack>
      </VStack>
    </HStack>
  )
}

export default CommentCard
