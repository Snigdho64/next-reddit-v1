import { extendTheme, type ThemeConfig } from '@chakra-ui/react'
import { Button } from './StyledComponents'

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

// 3. extend the theme
const theme = extendTheme({
  config,
  colors: {
    brand: {
      100: '#FF3C00',
    },
  },
  fonts: {
    body: 'Open Sans, sans-serif',
  },
  styles: {
    global: () => ({
      body: {
        bg: 'gray.200',
      },
    }),
  },
  components: {
    Button,
    // Input, // not working for some reason - come back to this
  },
})

export default theme
