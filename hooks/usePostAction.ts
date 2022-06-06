import { useToast } from '@chakra-ui/react'
import { useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { AuthModalState } from '../atoms/atoms'
import { deletePostFromFirestore, votePost } from '../utils/firebase'

const usePostAction = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  const setAuthModalState = useSetRecoilState(AuthModalState)

  const toast = useToast()

  const onDelete = async (id: string) => {
    setLoading(true)
    const [status, message] = await deletePostFromFirestore(id)
    if (status === 'error')
      toast({
        description: message,
        status,
        title: 'Error',
      })
    if (status === 'success')
      toast({
        status,
        title: 'Success',
        description: message,
      })
    setLoading(false)
  }

  const onSelect = () => {}

  const onVote = (
    postId: string,
    userId: string,
    type: 'upvote' | 'downvote'
  ) => {
    if (!userId) return setAuthModalState({ open: true, view: 'login' })
    votePost(postId, userId, type)
  }

  return { loading, error, onDelete, onSelect, onVote }
}

export default usePostAction
