import {
  Flex,
  Spinner,
  useColorModeValue,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import AuthModal from '../components/Modal/AuthModal/AuthModal'
import { auth } from '../firebase/firebaseConfig'
import { formatAuthError } from '../utils/helper'
import Navbar from '../components/Navbar/Navbar'
import CommunityModal from '../components/Modal/CommunityModal/CommunityModal'
import { getUserData } from '../utils/firebase'
import { UserDataState } from '../atoms/atoms'

const Layout: React.FC = ({ children }) => {
  const [user, loading, error] = useAuthState(auth)
  const toast = useToast()

  const setUserData = useSetRecoilState(UserDataState)
  const bgColor = useColorModeValue('gray.300', 'gray.700')

  useEffect(() => {
    if (error) {
      toast({
        status: 'error',
        title: 'Error',
        description: formatAuthError(error),
        duration: 5000,
        isClosable: true,
      })
    }
    if (user) {
      getUserData(user).then((userData) => {
        console.log(userData)
        setUserData(userData)
      })
    }
  }, [error, user, loading])

  return (
    <Flex flexDir="column" minH="100vh" maxW="100%" align="center" bg={bgColor}>
      {loading && (
        <Spinner position="absolute" top="50%" size={'xl'} thickness="4px" />
      )}
      <Navbar />
      <VStack flex={1} w="full" as="main">
        {children}
        <AuthModal />
        <CommunityModal />
      </VStack>
    </Flex>
  )
}

export default Layout
