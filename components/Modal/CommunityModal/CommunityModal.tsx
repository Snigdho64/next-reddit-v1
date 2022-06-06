import { LockIcon } from '@chakra-ui/icons'
import {
  Button,
  Center,
  Checkbox,
  CheckboxGroup,
  Divider,
  FormControl,
  FormErrorMessage,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useToast,
  VStack,
} from '@chakra-ui/react'
import React, { ChangeEvent, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { IoEyeOff } from 'react-icons/io5'
import { MdPublic } from 'react-icons/md'
import { useRecoilState } from 'recoil'
import { CommunityModalState } from '../../../atoms/atoms'
import { auth } from '../../../firebase/firebaseConfig'
import { createCommunity, getCommunity } from '../../../utils/firebase'

const CommunityModal = () => {
  const [showModal, setShowModal] = useRecoilState(CommunityModalState)
  const [user] = useAuthState(auth)
  const [privacyType, setPrivacyType] = useState<
    'public' | 'private' | 'restricted'
  >('public')
  const [communityName, setCommunityName] = useState<string>('')
  const [communityLength, setCommunityLength] = useState(0)
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)

  const toast = useToast()

  const buttonSize = useBreakpointValue(['xs', 'sm', 'md'])

  const onClose = () => setShowModal(false)

  const inputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 25) return
    setCommunityName(e.target.value)
    setCommunityLength(e.target.value.length)
  }

  const checkboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPrivacyType(e.target.value as 'public' | 'private' | 'restricted')
  }

  const handleCreateCommunity = async () => {
    setLoading(true)
    try {
      const community = await getCommunity(communityName)
      if (community) setError('Community Name Is Already Taken')
      else if (!user) {
        setError(`You're not signed in!`)
      } else {
        await createCommunity(communityName, privacyType, user)
        toast({
          title: 'Community created.',
          description: 'Invite members, share posts...',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        setShowModal(false)
      }
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <Modal
      isOpen={showModal}
      onClose={onClose}
      size={useBreakpointValue(['sm', 'md', 'lg'])}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Center fontWeight={[700, 900]} fontSize={['lg', 'xl']}>
            Create Community
          </Center>
        </ModalHeader>
        <ModalCloseButton />
        <Divider />
        <ModalBody as={Center}></ModalBody>
        <VStack p={4} align="flex-start">
          <Text fontSize={['md', 'lg', 'xl']} fontWeight={[500, 700]}>
            Name
          </Text>
          <Text
            fontSize={['xs', 'sm', 'md']}
            color={useColorModeValue('gray.500', 'gray.300')}
          >
            Community names including capitalization cannot be changed
          </Text>
          <FormControl isInvalid={!!error}>
            <InputGroup size={useBreakpointValue(['sm', 'md', 'lg'])}>
              <InputLeftAddon children="/r" fontSize={['sm', 'md', 'lg']} />
              <Input
                placeholder="Community Name"
                onChange={inputChange}
                value={communityName}
                fontWeight={['semibold', 'bold']}
              />
            </InputGroup>
            <Text
              color={
                communityLength >= 25 && useColorModeValue('red.500', 'red.300')
              }
            >
              {25 - communityLength} characters remaining
            </Text>
            <FormErrorMessage>{error}</FormErrorMessage>
          </FormControl>
        </VStack>
        <VStack p={4} align="flex-start">
          <Text fontSize={['md', 'lg', 'xl']} fontWeight={[500, 700]}>
            Community Type
          </Text>
          <Text
            fontSize={['xs', 'sm', 'md']}
            color={useColorModeValue('gray.500', 'gray.300')}
          >
            Choose a community type
          </Text>
          <CheckboxGroup value={[privacyType]} colorScheme="green">
            <VStack spacing={[0.5, 1, 2]}>
              {Object.entries({
                public: {
                  icon: MdPublic,
                  text: 'Anyone can view, post and comment in the community',
                },
                restricted: {
                  icon: IoEyeOff,
                  text: 'Anyone can view the community but only approved users can post',
                },
                private: {
                  icon: LockIcon,
                  text: 'Only approved users can view and submit to the community',
                },
              }).map(([key, val], idx) => (
                <Checkbox
                  key={key + idx}
                  value={key}
                  onChange={checkboxChange}
                  gap={2}
                  w="full"
                >
                  <HStack textTransform={'capitalize'} whiteSpace="unset">
                    <Icon as={val.icon} />
                    <Text>{key}</Text>
                    <Text fontSize={['9', '10', '11']}>{val.text}</Text>
                  </HStack>
                </Checkbox>
              ))}
            </VStack>
          </CheckboxGroup>
        </VStack>
        <ModalFooter gap={3}>
          <Button
            variant={'outline'}
            onClick={onClose}
            size={buttonSize}
            h="30px"
          >
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            mr={3}
            size={buttonSize}
            h="30px"
            onClick={handleCreateCommunity}
            isLoading={loading}
          >
            Create Community
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default CommunityModal
