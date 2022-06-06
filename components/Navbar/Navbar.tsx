import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  Text,
  useBreakpointValue,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react'
import { User } from 'firebase/auth'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebase/firebaseConfig'
import Directory from './Directory/Directory'
import RightContent from './RightContent/RightContent'
import SearchInput from './SearchInput'

const Navbar = () => {
  const navColor = useColorModeValue('white', 'gray.700')
  const isDark = useColorMode().colorMode === 'dark'
  const { push } = useRouter()

  return (
    <HStack
      justify="space-between"
      h={['7vh', '8vh', '9vh']}
      bg={navColor}
      as="nav"
      w="100%"
      px={2}
      py={2}
    >
      <Flex align="center" h="100%" gap={2} w="100%">
        <Flex align="center" h="100%" cursor="pointer" gap={2} onClick={() => push('/')}>
          <Image src="/images/redditFace.svg" h={['100%', '100%', '80%']} />
          <Image
            src={
              isDark ? '/images/redditWhiteLogo.svg' : '/images/redditText.svg'
            }
            h="100%"
            display={['none', 'none', 'block']}
          />
        </Flex>
        <Directory />
        <SearchInput />
        <RightContent />
      </Flex>
    </HStack>
  )
}

export default Navbar
