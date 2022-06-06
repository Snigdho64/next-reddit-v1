import {
  Avatar,
  Button,
  Flex,
  Heading,
  Icon,
  Image,
  Text,
  useBreakpointValue,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import { BsReddit } from 'react-icons/bs'
import { useRecoilValue } from 'recoil'
import { CommunityDataState } from '../../atoms/atoms'
import useJoinCommunity from '../../hooks/useJoinCommunity'

const Header: React.FC = () => {
  const headerBg = useColorModeValue('blue.500', 'blue.700')
  const textColor = useColorModeValue('gray.500', 'gray.700')
  const iconColor = useColorModeValue('white', 'gray.700')
  const iconBg = useColorModeValue('blue.500', 'blue.700')
  const imgSize = useBreakpointValue(['lg', 'xl', 'xl'])

  const community = useRecoilValue(CommunityDataState)
  const { name, imageURL, coverImageURL } = community

  const { joined, loading, handleJoinLeave } = useJoinCommunity(community)

  return (
    <Flex
      as="header"
      flexDirection={'column'}
      h={['15vh', '20vh', '25vh']}
      w="100%"
      maxWidth={'800px'}
      alignSelf="center"
    >
      <Flex bg={headerBg} h="50%" w="full">
        {coverImageURL && <Image src={coverImageURL} p={10} h="90%" w="80%" />}
      </Flex>
      <Flex h="50%" bg={'blue.100'} px={10}>
        <Flex position="relative" top="-4" rounded="full">
          {!imageURL ? (
            <Icon
              as={BsReddit}
              color={iconColor}
              fontSize={['5xl', '6xl', '7xl', '5.5rem']}
              bg={iconBg}
              border="2px solid white"
            />
          ) : (
            <Image src={imageURL} as={Avatar} size={imgSize} />
          )}
        </Flex>
        <VStack px={8} align="flex-start" spacing={['0', '1', '2']}>
          <Heading fontSize={['lg', 'xl', '2xl', '3xl']}>{name}</Heading>
          <Text
            color={textColor}
            fontSize={['xs', 'sm', 'md']}
          >{`r/${name}`}</Text>
        </VStack>
        <Flex align="center" p={4}>
          <Button
            variant={joined ? 'outline' : 'solid'}
            fontWeight="bold"
            fontSize={['20', '22', '24']}
            isLoading={loading}
            _disabled={{
              bg: 'gray.500',
              color: 'white',
              _hover: { bg: 'gray.500' },
            }}
            onClick={handleJoinLeave}
          >
            {joined ? 'Joined' : 'Join'}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Header
