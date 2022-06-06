import { EmailIcon, LockIcon, UnlockIcon } from '@chakra-ui/icons'
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightAddon,
  Link,
  Text,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { AuthModalState } from '../../../atoms/atoms'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import {
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
} from 'react-firebase-hooks/auth'
import { auth } from '../../../firebase/firebaseConfig'
import { formatAuthError } from '../../../utils/helper'

import { saveToFirestore } from '../../../utils/firebase'
import useAuthHook from '../../../hooks/useAuthHook'

const AuthForm = () => {
  const [authModalState, setAuthModalState] = useRecoilState(AuthModalState)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const size = useBreakpointValue(['sm', 'md', 'md', 'lg'])
  type FormData = {
    email: string
    password: string
    confirmPassword?: string
  }
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormData>()

  const { user, loading, signin, signup } = useAuthHook()

  const onSubmit = async (e: FormData) => {
    if (authModalState.view === 'signup') {
      await signup(e.email, e.password)
    } else if (authModalState.view === 'login') {
      await signin(e.email, e.password)
    }
  }

  return (
    <VStack as="form" w="100%" onSubmit={handleSubmit(onSubmit)} p={4} gap={4}>
      <FormControl isInvalid={!!errors.email}>
        <InputGroup alignItems={'center'} size={size}>
          <Input
            placeholder="Email"
            //   type="email"
            {...register('email', { required: 'Email is rquired' })}
          />
          <InputRightAddon>
            <EmailIcon cursor={'pointer'} _hover={{ color: 'brand.100' }} />
          </InputRightAddon>
        </InputGroup>
        <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.password}>
        <InputGroup alignItems={'center'} size={size}>
          <Input
            placeholder="Password"
            type={showPassword ? 'text' : 'password'}
            {...register('password', {
              required: 'Password is Required',
              minLength:
                authModalState.view === 'signup'
                  ? {
                      value: 8,
                      message: 'Password must have at least 8 characters',
                    }
                  : undefined,
            })}
          />
          <InputRightAddon
            cursor={'pointer'}
            _hover={{ color: 'brand.100' }}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <UnlockIcon /> : <LockIcon />}
          </InputRightAddon>
        </InputGroup>
        <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
      </FormControl>
      {authModalState.view === 'signup' && (
        <FormControl isInvalid={!!errors.confirmPassword}>
          <InputGroup alignItems={'center'} size={size}>
            <Input
              placeholder="Confirm Password"
              type={showConfirm ? 'text' : 'password'}
              {...register('confirmPassword', {
                required: 'Confirm your Password',
                validate: (val) =>
                  watch('password') !== val
                    ? 'Passwords do not Match'
                    : undefined,
              })}
            />
            <InputRightAddon
              cursor={'pointer'}
              _hover={{ color: 'brand.100' }}
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <UnlockIcon /> : <LockIcon />}
            </InputRightAddon>
          </InputGroup>
          <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
        </FormControl>
      )}

      <Button
        size={size}
        as={motion.button}
        w="60%"
        type="submit"
        _hover={{ bg: 'green.500' }}
        whileHover={{ scale: 1.1 }}
        transition="0.1s"
        textTransform="uppercase"
        letterSpacing={'wide'}
        isLoading={loading}
      >
        {authModalState.view}
      </Button>
      <Flex alignSelf={'flex-end'} gap={2} fontSize={['sm', 'md', 'lg']}>
        <Text>
          {authModalState.view === 'login'
            ? 'New to Reddit?'
            : 'Already a user?'}
        </Text>
        <Link
          color={'blue.500'}
          textTransform="capitalize"
          fontWeight="bold"
          onClick={() => {
            reset()
            setAuthModalState((p) => ({
              ...p,
              view: authModalState.view === 'login' ? 'signup' : 'login',
            }))
          }}
        >
          {authModalState.view === 'login' ? 'signup' : 'login'}
        </Link>
      </Flex>
    </VStack>
  )
}

export default AuthForm
