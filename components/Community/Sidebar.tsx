import { LockIcon } from '@chakra-ui/icons'
import {
  Avatar,
  Button,
  Center,
  CloseButton,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  Text,
  useColorModeValue,
  useToast,
  VisuallyHiddenInput,
  VStack,
} from '@chakra-ui/react'
import React, { ChangeEventHandler, useRef, useState } from 'react'
import { BsEyeFill } from 'react-icons/bs'
import { GrReddit } from 'react-icons/gr'
import { MdCake, MdPublic } from 'react-icons/md'
import Moment from 'react-moment'
import { useRecoilValue } from 'recoil'
import { CommunityDataState, UserDataState } from '../../atoms/atoms'
import useFileSelector from '../../hooks/useFileSelect'
import { changeCommunityImage } from '../../utils/firebase'

const Sidebar = () => {
  const textColor = useColorModeValue('white', 'gray.700')
  const bgColor = useColorModeValue('white', 'gray.500')
  const textColor2 = useColorModeValue('gray.700', 'white')
  const community = useRecoilValue(CommunityDataState)
  const user = useRecoilValue(UserDataState)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { selectedFile, media, onFileChange, clearFile } = useFileSelector()
  const toast = useToast()

  const updateImage = async () => {
    if (!selectedFile.type.startsWith('image')) {
      toast({ status: 'warning', description: 'Selected A Valid Image' })
      clearFile()
      return
    }

    setLoading(true)
    const [status, message] = await changeCommunityImage(
      user.uid,
      community.id,
      selectedFile
    )
    if (status === 'error') {
      toast({ status, title: 'Error', description: message })
    } else {
      toast({ status, title: 'Success', description: message })
    }
    clearFile()
    setLoading(false)
  }

  return (
    <VStack
      alignSelf="flex-start"
      py={4}
      spacing={0}
      w="xs"
      top={{ xl: '20vh' }}
      right={{ xl: 4 }}
      position="relative"
      align="stretch"
      display={{ base: 'none', xl: 'flex' }}
      color={textColor}
    >
      <Flex
        bg="blue.500"
        p={{ xl: 2, '2xl': 4 }}
        flexDir="column"
        align="center"
        borderRadius={'8px 8px 0 0'}
      >
        <Text textAlign={'center'} fontWeight="bold" fontSize={['lg', 'xl']}>
          About Community
        </Text>
      </Flex>
      <VStack
        bg={bgColor}
        spacing={0}
        width="full"
        color={textColor2}
        px={2}
        pb={4}
        borderRadius="0 0 8px 8px"
      >
        <HStack justify="space-between" w="full" p={2}>
          <Heading fontSize={['lg', 'xl']}>{community.name}</Heading>
          <Center gap={1}>
            <Icon
              as={
                community.privacyType === 'public'
                  ? MdPublic
                  : community.privacyType === 'restricted'
                  ? BsEyeFill
                  : LockIcon
              }
            />
            <Text fontSize={'md'} textTransform="capitalize">
              {community.privacyType}
            </Text>
          </Center>
        </HStack>
        <HStack justify="space-between" w="full">
          <Center flexDir="column">
            <Text fontWeight="bold">
              {community.membersCount.toLocaleString()}
            </Text>
            <Text>Members</Text>
          </Center>
          <Center flexDir="column">
            <Text fontWeight="bold">
              {community.membersCount.toLocaleString()}
            </Text>
            <Text>Online</Text>
          </Center>
        </HStack>
        <Divider />
        <Center gap={4} w="full" p={2} fontWeight="bold">
          <Icon as={MdCake} />
          <Moment
            date={community.createdAt.seconds * 1000}
            format="MMM DD YYYY"
          />
        </Center>
        <Divider />
        {community.creator.username === user?.username && (
          <HStack py={4} w="full" justify="space-between" p={4}>
            {community.imageURL ? (
              <Image src={community.imageURL} as={Avatar} size="xl" />
            ) : (
              <Icon
                as={GrReddit}
                bg={'brand.100'}
                color={textColor}
                fontSize={['2xl', '3xl', '4xl', '5xl']}
                rounded="full"
                p={1}
              />
            )}
            {!selectedFile && (
              <Button
                variant="outline"
                onClick={() => inputRef.current?.click()}
                size="sm"
              >
                Change Photo
              </Button>
            )}
            <VisuallyHiddenInput
              ref={inputRef}
              type="file"
              onChange={onFileChange}
            />
          </HStack>
        )}
        {media && selectedFile && (
          <Center w="full" justifyContent="space-between">
            <CloseButton
              alignSelf={'flex-start'}
              bg={bgColor}
              rounded="full"
              onClick={clearFile}
            />
            <Avatar src={media} size="xl" />
            <Button
              alignSelf="flex-end"
              onClick={updateImage}
              isLoading={loading}
            >
              Update
            </Button>
          </Center>
        )}
      </VStack>
    </VStack>
  )
}

export default Sidebar
