import { useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { deletePostComment, editPostComment } from '../utils/firebase'

const useCommentAction = () => {
  const [loading, setLoading] = useState(false)

  const toast = useToast()
  const deleteComment = async (postId: string, commentId: string) => {
    setLoading(true)
    const [status, description] = await deletePostComment(postId, commentId)
    toast({ status, description })
    setLoading(false)
  }
  const editComment = async (
    postId: string,
    commentId: string,
    text: string
  ) => {
    setLoading(true)
    const [status, description] = await editPostComment(postId, commentId, text)
    toast({ status, description })
    setLoading(false)
  }

  return { loading, deleteComment, editComment }
}

export default useCommentAction
