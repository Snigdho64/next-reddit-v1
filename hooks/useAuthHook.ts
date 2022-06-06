import { useRecoilState } from 'recoil'
import { useToast } from '@chakra-ui/react'
import { useEffect } from 'react'
import {
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
} from 'react-firebase-hooks/auth'
import { auth } from '../firebase/firebaseConfig'
import { AuthModalState } from '../atoms/atoms'
import { formatAuthError } from '../utils/helper'
import { getUserData, saveToFirestore } from '../utils/firebase'

const useAuthHook = () => {
  const [signup, signupUser, signupLoading, signupError] =
    useCreateUserWithEmailAndPassword(auth)
  const [signin, signinUser, signinLoading, signinError] =
    useSignInWithEmailAndPassword(auth)
  const toast = useToast()
  const [authModalState, setAuthModalState] = useRecoilState(AuthModalState)

  useEffect(() => {
    if (signupUser?.user) {
      toast({
        status: 'success',
        title: 'Account Created',
        description: 'Wecome To Reddit',
        isClosable: true,
      })
      setAuthModalState({ open: false })
    }
    if (signupError) {
      toast({
        status: 'error',
        title: 'Error',
        description: formatAuthError(signupError),
        isClosable: true,
      })
    }
    if (signinUser?.user) {
      toast({
        status: 'success',
        title: 'Signed in successfully',
        description: 'Welcome Back',
        isClosable: true,
      })
      setAuthModalState({ open: false })
    }
    if (signinError) {
      toast({
        status: 'error',
        title: 'Error',
        description: formatAuthError(signinError),
        isClosable: true,
      })
    }
  }, [signinUser, signinError, signupUser, signupError])

  useEffect(() => {
    const user = signinUser?.user || signupUser?.user
    if (user) {
      saveToFirestore(user)
    }
  }, [signupUser, signinUser])

  return {
    user: signinUser?.user || signupUser?.user,
    loading: signinLoading || signupLoading,
    signin,
    signup,
  }
}

export default useAuthHook
