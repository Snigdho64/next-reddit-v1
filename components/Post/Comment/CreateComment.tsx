import {
  Button,
  Flex,
  IconButton,
  Textarea,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { IoImage } from 'react-icons/io5'
import { MdInsertComment, MdSend } from 'react-icons/md'
import { useRecoilValue } from 'recoil'
import { UserDataState } from '../../../atoms/atoms'
import { PostData } from '../../../types'
import { createComment } from '../../../utils/firebase'

const CreateComment: React.FC<{ post: PostData }> = ({ post }) => {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const user = useRecoilValue(UserDataState)
  const toast = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const [status, message] = await createComment(post.id, user, text)
    if (status === 'error') {
      toast({ status, description: message })
    } else {
      toast({ status, description: message })
    }
    setLoading(false)
  }

  return (
    <Flex
      as="form"
      w="full"
      gap={[1, 2]}
      position="relative"
      justify="center"
      flexDir="column"
      onSubmit={handleSubmit}
    >
      <Textarea
        w="full"
        placeholder="Share your thoughts"
        fontWeight="semibold"
        fontSize={['md', 'md', 'lg']}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Flex justify="space-between">
        <IconButton aria-label="add-image" icon={<IoImage />} />
        <Button
          alignSelf={'flex-end'}
          type="submit"
          zIndex={1}
          _hover={{ bg: 'teal.500' }}
          rightIcon={<MdSend />}
          disabled={!text.trim()}
          isLoading={loading}
        >
          Comment
        </Button>
      </Flex>
    </Flex>
  )
}

export default CreateComment
