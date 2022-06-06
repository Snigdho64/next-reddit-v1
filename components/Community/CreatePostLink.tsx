import {
  Center,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react'
import React, { MouseEventHandler } from 'react'
import { ImAttachment, ImReddit } from 'react-icons/im'
import { HiOutlinePhotograph } from 'react-icons/hi'

const CreatePostLink: React.FC<{
  onClick: MouseEventHandler<HTMLDivElement>
}> = ({ onClick }) => {
  const bgColor = useColorModeValue('white', 'gray.700')

  const inputSize = useBreakpointValue(['lg', 'lg'])

  const iconSize = useBreakpointValue(['lg', 'xl', '2xl'])

  return (
    <Center w="full" maxW="800px" bg={bgColor}>
      <InputGroup size={inputSize} h={['5vh', '7vh', '8vh']} onClick={onClick}>
        <InputLeftAddon h="full">
          <Icon as={ImReddit} fontSize={iconSize} />
        </InputLeftAddon>
        <Input h="full" size={inputSize} />
        <InputRightAddon
          h="full"
          children={
            <HStack>
              <Icon as={HiOutlinePhotograph} fontSize={iconSize} />
              <Icon as={ImAttachment} fontSize={['md', 'lg', 'xl']} />
            </HStack>
          }
        />
      </InputGroup>
    </Center>
  )
}

export default CreatePostLink
