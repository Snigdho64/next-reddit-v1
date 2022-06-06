import { AddIcon, ChevronDownIcon, HamburgerIcon } from '@chakra-ui/icons'
import {
  Avatar,
  Button,
  Center,
  Flex,
  HStack,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  MenuOptionGroup,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import { CgProfile } from 'react-icons/cg'
import { MdOutlineLogin } from 'react-icons/md'
import { BiUserCircle } from 'react-icons/bi'
import { ImHome, ImReddit } from 'react-icons/im'
import React from 'react'
import { motion } from 'framer-motion'
import {
  CommunityDataState,
  CommunityModalState,
  UserDataState,
} from '../../../atoms/atoms'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../../firebase/firebaseConfig'
import { useRouter } from 'next/router'

const Directory = () => {
  const setShowCommunityModal = useSetRecoilState(CommunityModalState)
  const user = useRecoilValue(UserDataState)
  const community = useRecoilValue(CommunityDataState)

  console.log(community)

  const menuItems = [
    {
      name: 'Create Community',
      icon: AddIcon,
      action: () => {
        setShowCommunityModal(true)
      },
    },
    {
      name: 'Logout',
      icon: MdOutlineLogin,
      action: () => {},
    },
  ]

  const textColor = useColorModeValue('gray.700', 'white')
  const hoverTextColor = useColorModeValue('white', 'gray.700')

  const { push } = useRouter()

  return (
    <>
      {user && (
        <Menu>
          <MenuButton
            as={motion.button}
            aria-label="Directory Options"
            whileHover={{
              scale: 1.1,
              backgroundColor: '#8884',
              borderRadius: '8px',
            }}
            whileTap={{ scale: 0.9 }}
          >
            <Center
              rounded={['sm', 'md', 'lg']}
              border="1px solid"
              borderColor="gray.500"
              p={[0.5, 1]}
              gap={1}
            >
              {community ? (
                community.imageURL ? (
                  <Avatar src={community.imageURL} size="sm" />
                ) : (
                  <Icon as={ImReddit} />
                )
              ) : (
                <Icon as={ImHome} fontSize={['lg', 'xl']} />
              )}
              <Text
                display={{ base: 'none', md: 'block' }}
                fontWeight={[500, 700]}
                fontSize={{ xl: 'sm', '2xl': 'md' }}
                // alignSelf="flex-end"
              >
                {community?.name ? community.name : 'Home'}
              </Text>
              <Icon as={ChevronDownIcon} />
            </Center>
          </MenuButton>
          <MenuList
            w="full"
            as={VStack}
            fontSize={['sm', 'md', 'lg']}
            fontWeight={[500, 700]}
            color={textColor}
          >
            {menuItems.map(({ name, icon, action }) => (
              <MenuItem
                key={name}
                onClick={action}
                w="90%"
                rounded={['sm', 'md', 'lg']}
                icon={React.createElement(icon, { size: 24 })}
                _hover={{
                  bg: 'blue.500',
                  color: hoverTextColor,
                }}
              >
                {name}
              </MenuItem>
            ))}
            {user.userCommunities && (
              <>
                <Text>Moderator</Text>
                {user.userCommunities
                  .filter((com) => com.isModerator)
                  .map((com, idx) => (
                    <MenuItem
                      key={com.name + idx}
                      w="96%"
                      as={Flex}
                      justify="space-between"
                      align="center"
                      cursor={'pointer'}
                      rounded={['sm', 'md', 'lg']}
                      _hover={{
                        bg: 'blue.500',
                        color: hoverTextColor,
                      }}
                      onClick={() => push(`r/${com.name}`)}
                    >
                      <Avatar src={com.imageURL} />
                      <Text>{com.name}</Text>
                    </MenuItem>
                  ))}
              </>
            )}
            {user.userCommunities.find((com) => !com.isModerator) && (
              <>
                <Text>My Communities</Text>
                {user.userCommunities
                  .filter((com) => !com.isModerator)
                  .map((com, idx) => (
                    <MenuItem
                      key={com.name + idx}
                      w="96%"
                      as={Flex}
                      justify="space-between"
                      align="center"
                      cursor={'pointer'}
                      rounded={['sm', 'md', 'lg']}
                      _hover={{
                        bg: 'blue.500',
                        color: hoverTextColor,
                      }}
                      onClick={() => push(`r/${com.name}`)}
                    >
                      <Avatar src={com.imageURL} />
                      <Text>{com.name}</Text>
                    </MenuItem>
                  ))}
              </>
            )}
          </MenuList>
        </Menu>
      )}
    </>
  )
}

export default Directory
