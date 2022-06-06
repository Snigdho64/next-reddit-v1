import { Center, Flex, Icon, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { GrAdd } from 'react-icons/gr'
import { BsArrowRightCircle, BsChatDots } from 'react-icons/bs'
import {
  IoFilterCircleOutline,
  IoNotificationsOutline,
  IoVideocamOutline,
} from 'react-icons/io5'
import { motion } from 'framer-motion'

const NavIcons = () => {
  return (
    <Flex gap={2} display={{ base: 'none', md: 'flex' }}>
      {[
        BsArrowRightCircle,
        BsChatDots,
        IoFilterCircleOutline,
        IoNotificationsOutline,
        IoVideocamOutline,
        GrAdd,
      ].map((i, idx) => (
        <Center
          key={idx}
          as={motion.div}
          whileHover={{ scale: 1.1 }}
          rounded="full"
          _hover={{
            bg: useColorModeValue('gray.100', 'gray.600'),
          }}
          p={1}
        >
          <Icon as={i} fontSize={['md', 'xl', 'xl']} />
        </Center>
      ))}
    </Flex>
  )
}

export default NavIcons
