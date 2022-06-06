import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import { UseFormRegister, FormState } from 'react-hook-form'
import { PostFormInput } from '../../../types'

const PostForm: React.FC<{
  register: UseFormRegister<PostFormInput>
  formState: FormState<PostFormInput>
  onSubmit: React.FormEventHandler<HTMLDivElement>
  loading: boolean
}> = ({ register, formState: { errors }, onSubmit, loading }) => {
  return (
    <VStack w="90%" minH={['20vh', '30vh']} as="form" onSubmit={onSubmit}>
      <FormControl isInvalid={!!errors.title}>
        <Input
          placeholder="title"
          fontSize={['md', 'lg']}
          {...register('title', {
            required: 'Must have a title',
            pattern: {
              value: /^[a-zA-Z0-9_]+/,
              message: 'Invalid Title',
            },
          })}
        />
        <FormErrorMessage>{errors?.title?.message}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.description}>
        <Textarea
          placeholder="description (optional)"
          fontSize={['sm', 'md']}
          {...register('description', {
            pattern: {
              value: /^[a-zA-Z0-9_]+/,
              message: 'Invalid Description',
            },
            minLength: { value: 2, message: 'Too short description' },
          })}
        />
        <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
      </FormControl>
      <Button
        alignSelf="flex-end"
        px={6}
        letterSpacing="wide"
        type="submit"
        isLoading={loading}
      >
        Post
      </Button>
    </VStack>
  )
}

export default PostForm
