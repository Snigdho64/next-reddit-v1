import {
  ChevronDownIcon,
  HamburgerIcon,
  MoonIcon,
  SunIcon,
} from '@chakra-ui/icons'
import {
  Button,
  Center,
  ComponentWithAs,
  Flex,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Switch,
  useColorMode,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import { CgProfile } from 'react-icons/cg'
import { MdOutlineLogin } from 'react-icons/md'
import { BiUserCircle } from 'react-icons/bi'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { auth } from '../../../firebase/firebaseConfig'
import { useAuthState } from 'react-firebase-hooks/auth'
import { signOut, User } from 'firebase/auth'
import { IconType } from 'react-icons'
import { BsReddit } from 'react-icons/bs'
import { ImReddit } from 'react-icons/im'
import { UserMenuItem } from '../../../types'
import { useResetRecoilState, useSetRecoilState } from 'recoil'
import { AuthModalState, UserDataState } from '../../../atoms/atoms'

const UserMenu = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  const [user, loading] = useAuthState(auth)

  const setAuthModalState = useSetRecoilState(AuthModalState)

  const resetUserData = useResetRecoilState(UserDataState)

  const menuItems: UserMenuItem[] = user
    ? [
        {
          name: 'My Profile',
          icon: CgProfile,
          action: () => {},
        },
        {
          name: 'Logout',
          icon: MdOutlineLogin,
          action: async () => {
            await signOut(auth)
            resetUserData()
          },
        },
      ]
    : [
        {
          name: 'Login/Signup',
          icon: CgProfile,
          action: () => setAuthModalState({ open: true, view: 'login' }),
        },
      ]

  menuItems.push({
    name: colorMode as string,
    icon: colorMode === 'dark' ? MoonIcon : SunIcon,
    action: toggleColorMode,
    rightIcon: <Switch isChecked={colorMode === 'dark'} />,
  })

  const textColor = useColorModeValue('gray.700', 'white')
  const hoverTextColor = useColorModeValue('white', 'gray.700')

  return loading ? (
    <Spinner />
  ) : (
    <Menu closeOnSelect={false}>
      <MenuButton
        as={motion.button}
        aria-label="User Options"
        whileHover={{
          scale: 1.05,
          backgroundColor: '#8884',
          borderRadius: '8px',
        }}
        whileTap={{ scale: 0.95 }}
      >
        <Center
          border="1px solid"
          borderColor="gray.500"
          p={[0.5, 1]}
          fontSize={['xl', '2xl', '3xl']}
          rounded={['sm', 'md', 'lg']}
        >
          <Icon as={user ? BiUserCircle : ImReddit} />
          <Icon as={ChevronDownIcon} />
        </Center>
      </MenuButton>
      <MenuList
        as={VStack}
        divider={<MenuDivider />}
        fontSize={['sm', 'md', 'lg']}
        fontWeight={[500, 700]}
        color={textColor}
      >
        {menuItems.map(({ name, icon, action, rightIcon }) => (
          <MenuItem
            key={name}
            onClick={action}
            w="90%"
            justifyContent={'space-between'}
            rounded={['sm', 'md', 'lg']}
            icon={React.createElement(icon as any, { size: 24 })}
            _hover={{
              bg: 'blue.500',
              color: hoverTextColor,
            }}
          >
            <Flex justify="space-between">
              {name}
              {rightIcon}
            </Flex>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}

export default UserMenu
