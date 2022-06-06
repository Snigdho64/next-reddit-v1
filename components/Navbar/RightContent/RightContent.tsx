import { Button, Flex, useBreakpointValue } from '@chakra-ui/react'
import React from 'react'
import { useSetRecoilState } from 'recoil'
import { AuthModalState } from '../../../atoms/atoms'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../../firebase/firebaseConfig'
import NavIcons from './NavIcons'
import UserMenu from './UserMenu'
import { User } from 'firebase/auth'

const RightContent = () => {
  const buttonSize = useBreakpointValue(['xs', 'sm', 'md'])
  const setAuthModalState = useSetRecoilState(AuthModalState)
  const [user] = useAuthState(auth)
  return (
    <Flex gap={1} align="center">
      {user && <NavIcons />}
      {!user && (
        <>
          <Button
            variant="outline"
            size={buttonSize}
            onClick={() => setAuthModalState({ open: true, view: 'login' })}
          >
            Login
          </Button>
          <Button
            variant="solid"
            size={buttonSize}
            onClick={() => setAuthModalState({ open: true, view: 'signup' })}
          >
            Signup
          </Button>
        </>
      )}
      <UserMenu />
    </Flex>
  )
}

export default RightContent
