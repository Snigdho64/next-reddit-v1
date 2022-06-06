import { Button, Spinner, Text, useToast, Image } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import React, { useEffect } from 'react'
import { useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { useSetRecoilState } from 'recoil'
import { AuthModalState } from '../../../atoms/atoms'
import { auth } from '../../../firebase/firebaseConfig'
import { saveToFirestore } from '../../../utils/firebase'
import { formatAuthError } from '../../../utils/helper'

const OAuthProviders = () => {
  const [signin, user, loading, error] = useSignInWithGoogle(auth)

  const setAuthModalState = useSetRecoilState(AuthModalState)

  const toast = useToast()

  useEffect(() => {
    if (user) {
      saveToFirestore(user.user)
      toast({
        status: 'success',
        title: 'Success',
        description: 'Signed in successfully',
        isClosable: true,
      })
      setAuthModalState({ open: false })
    }
    if (error) {
      toast({
        status: 'error',
        title: 'Error',
        description: formatAuthError(error),
        isClosable: true,
      })
    }
  }, [error, user])

  return (
    <>
      <Button
        as={motion.button}
        maxW="80%"
        justifyContent={'space-around'}
        variant="oauth"
        leftIcon={<Image height="6" src="/images/googlelogo.png" />}
        spinnerPlacement="end"
        spinner={<Spinner />}
        isLoading={loading}
        whileHover={{
          scale: 1.1,
        }}
        transition="0.1s"
        onClick={() => signin()}
      >
        <Text
          overflowWrap="break-word"
          maxW="100%"
          fontSize={['sx', 'sm', 'md']}
        >
          Continue with Google
        </Text>
      </Button>
    </>
  )
}

export default OAuthProviders
