import { ComponentStyleConfig } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

export const Button: ComponentStyleConfig = {
  baseStyle: {
    borderRadius: '60px',
    fontSize: '10pt',
    fontWeight: 700,
    _focus: {
      boxShadow: 'none',
    },
  },
  sizes: {
    xs: {
      fontSize: '6pt',
    },
    sm: {
      fontSize: '8pt',
    },
    md: {
      fontSize: '10pt',
      // height: "28px",
    },
  },
  variants: {
    solid: (props) => ({
      color: 'white',
      bg: 'blue.500',
      _hover: {
        bg: 'blue.400',
      },
    }),
    outline: {
      color: 'blue.500',
      border: '1px solid',
      borderColor: 'blue.500',
    },
    oauth: (props) => ({
      minHeight: '40px',
      height: 'auto',
      border: '1px solid',
      borderColor: 'gray.300',
      whiteSpace: 'unset',
      _hover: {
        bg: mode('gray.300', 'gray.600')(props),
      },
    }),
  },
}
