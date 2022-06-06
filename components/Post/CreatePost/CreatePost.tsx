import { Heading, HStack, useColorModeValue, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import Layout from '../../../Layout/Layout'
import PostForm from './PostForm'
import MediaUpload from './MediaUpload'
import {
  CommunityData,
  NewPostData,
  PageQuery,
  PostFormInput,
  PostTabItems,
} from '../../../types'
import PostTab from './PostTab'
import { useForm } from 'react-hook-form'
import useCreatePost from '../../../hooks/useCreatePost'
import { useRecoilValue } from 'recoil'
import { CommunityDataState, UserDataState } from '../../../atoms/atoms'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../../firebase/firebaseConfig'
import { useRouter } from 'next/router'
import useFileSelector from '../../../hooks/useFileSelect'

const CreatePost: React.FC<{
  community: CommunityData
}> = ({ community }) => {
  const [activeLink, setActiveLink] = useState<PostTabItems>('Post')

  const bgColor = useColorModeValue('white', 'gray.700')
  const shadow = useColorModeValue(
    '0px 0px 10px 1px #ccc',
    '0px 0px 10px 1px #555'
  )

  const { register, reset, formState, handleSubmit } = useForm<PostFormInput>()

  const { selectedFile, onFileChange, media, clearFile } = useFileSelector()

  const { createPost, loading } = useCreatePost()

  const userData = useRecoilValue(UserDataState)

  const { push, query } = useRouter()

  const handleCreatePost = async (inputData: PostFormInput) => {
    const postData: NewPostData = { ...inputData, media: selectedFile }
    const { name, imageURL } = community
    const { username, photoURL } = userData
    await createPost(postData, { name, imageURL }, { username, photoURL })
    push(`/r/${query.communityName}`)
  }

  return (
    <VStack w="full">
      <Heading>Create Post</Heading>
      <VStack
        bg={bgColor}
        rounded="lg"
        shadow={shadow}
        p={2}
        w="96%"
        maxWidth={'800px'}
      >
        <PostTab {...{ activeLink, setActiveLink }} />
        {activeLink === 'Post' && (
          <PostForm
            {...{ register, formState, handleSubmit, loading }}
            onSubmit={handleSubmit(handleCreatePost)}
          />
        )}
        {activeLink === 'Images & Videos' && (
          <MediaUpload {...{ media, setActiveLink, onFileChange, clearFile }} />
        )}
      </VStack>
    </VStack>
  )
}

export default CreatePost
