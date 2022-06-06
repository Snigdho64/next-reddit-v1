import { HStack, Icon, Text, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { IconType } from 'react-icons'
import { BiPoll } from 'react-icons/bi'
import { BsImage, BsMic } from 'react-icons/bs'
import { ImAttachment } from 'react-icons/im'
import { IoDocumentText } from 'react-icons/io5'
import { PostTabItems } from '../../../types'

const tabItems: {
  text: PostTabItems
  icon: IconType
}[] = [
  {
    text: 'Post',
    icon: IoDocumentText,
  },
  {
    text: 'Images & Videos',
    icon: BsImage,
  },
  {
    text: 'Link',
    icon: ImAttachment,
  },
  {
    text: 'Poll',
    icon: BiPoll,
  },
  {
    text: 'Talk',
    icon: BsMic,
  },
]

const PostTab: React.FC<{
  activeLink: string
  setActiveLink: React.Dispatch<React.SetStateAction<PostTabItems>>
}> = ({ activeLink, setActiveLink }) => {
  return (
    <HStack as="nav" gap={[0, 2, 4, 6]} spacing={[2, 4, 5, 8]}>
      {tabItems.map(({ text, icon }, idx) => (
        <TabItem
          key={text + idx}
          text={text}
          icon={icon}
          onClick={() => setActiveLink(text)}
          active={text === activeLink}
        />
      ))}
    </HStack>
  )
}

const TabItem: React.FC<{
  text: string
  icon: IconType
  active: boolean
  onClick: React.MouseEventHandler<HTMLDivElement>
}> = ({ text, icon, active, onClick }) => {
  const activeColor = useColorModeValue('blue.500', 'blue.300')
  const color = useColorModeValue('gray.700', 'white')
  const hoverColor = useColorModeValue('gray.500', 'gray.300')

  return (
    <HStack
      as="li"
      cursor="pointer"
      onClick={onClick}
      spacing={1}
      fontWeight={[500, 700]}
      color={active ? activeColor : color}
      borderBottom={active ? '2px' : '0'}
      borderColor={active ? 'blue.500' : 'gray.500'}
      _hover={!active && { color: hoverColor, borderBottom: '1px' }}
      fontSize={['xs', 'sm', 'md', 'lg']}
    >
      <Icon as={icon} />
      <Text>{text}</Text>
    </HStack>
  )
}

export default PostTab
