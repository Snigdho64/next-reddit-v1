import { useToast } from '@chakra-ui/react'
import  { useState } from 'react'
import { CommunityInfo, NewPostData, UserInfo } from '../types'
import { savePostToFirestore } from '../utils/firebase'

const useCreatePost = () => {
  const [loading, setLoading] = useState(false)

  const toast = useToast()

  const createPost = async (
    postData: NewPostData,
    community: CommunityInfo,
    user: UserInfo
  ) => {
    setLoading(true)
    const [res, err] = await savePostToFirestore(postData, user, community)
    if (err) {
      toast({ status: 'error', title: 'Error', description: err })
    } else {
      toast({
        status: 'success',
        title: 'Success',
        description: 'Posted Successfully',
        isClosable: true,
      })
    }
    setLoading(false)
  }

  return { createPost, loading }
}

export default useCreatePost
