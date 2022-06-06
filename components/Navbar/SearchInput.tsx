import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  useBreakpointValue,
  useColorMode,
} from '@chakra-ui/react'
import { PhoneIcon, Search2Icon } from '@chakra-ui/icons'
import React from 'react'

const SearchInput = () => {
  const inputSize = useBreakpointValue(['sm', 'sm', 'md'])
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  return (
    <Flex flex={1} align="center">
      <InputGroup size={inputSize}>
        <InputLeftElement
          h="100%"
          pointerEvents="none"
          children={<Search2Icon color={isDark ? 'gray.50' : 'gray.500'} />}
        />
        <Input
          borderRadius={['md', 'md', 'lg']}
          placeholder="Search Reddit"
          color={isDark ? 'white' : 'gray.600'}
          fontWeight={'semibold'}
          _placeholder={{ color: !isDark ? 'gray.500' : 'white' }}
          //   bg="gray.100"
          _hover={{ border: '2px solid', borderColor: 'blue.500' }}
          _focus={{ border: '2px solid', borderColor: 'blue.500' }}
        />
      </InputGroup>
    </Flex>
  )
}

export default SearchInput
