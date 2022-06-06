import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import { useRecoilState } from 'recoil'
import { AuthModalState } from '../../../atoms/atoms'
import AuthForm from './AuthForm'
import OAuthProviders from './OAuthProviders'

const AuthModal = () => {
  const [authModalState, setAuthModalState] = useRecoilState(AuthModalState)
  const modalSize = useBreakpointValue(['xs', 'sm', 'md'])

  return (
    <>
      <Modal
        isOpen={authModalState.open}
        onClose={() => {
          setAuthModalState((p) => ({ ...p, open: false }))
        }}
        size={modalSize}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            textTransform={'capitalize'}
            textAlign="center"
            color="brand.100"
          >
            {authModalState.view}
          </ModalHeader>
          <ModalCloseButton size={useBreakpointValue(['sm', 'sm', 'md'])} />
          <ModalBody>
            <Flex w="100%" h="100%" flexDir="column" p={4}>
              <VStack gap={4} w="100%">
                <OAuthProviders />
                <Text>OR</Text>
                <AuthForm />
              </VStack>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AuthModal
