import {
  Button,
  HStack,
  Image,
  useBreakpointValue,
  useToast,
  VisuallyHiddenInput,
  VStack,
} from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { BiImage, BiLeftArrowAlt, BiRecycle } from 'react-icons/bi'
import { MdDelete } from 'react-icons/md'
import { PostTabItems } from '../../../types'

type Media = 'video' | 'audio' | 'image'

const MediaUpload: React.FC<{
  setActiveLink: React.Dispatch<React.SetStateAction<PostTabItems>>
  onFileChange: React.ChangeEventHandler<HTMLInputElement>
  clearFile: () => {} | void
  media: string
}> = ({ setActiveLink, media, onFileChange, clearFile }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const buttonSize = useBreakpointValue(['xs', 'sm', 'md'])

  return (
    <VStack w="90%" minH={['20vh', '30vh']} justify="center">
      {media?.startsWith('data:image') && (
        <Image src={String(media)} maxH={['300', '400']} />
      )}
      {media?.startsWith('data:video') && (
        <video src={String(media)} controls />
      )}
      {media?.startsWith('data:audio') && (
        <audio src={String(media)} controls style={{ width: '100%' }} />
      )}
      {!media ? (
        <>
          <Button
            size={buttonSize}
            leftIcon={<BiImage />}
            px={6}
            letterSpacing="wide"
            variant={'outline'}
            onClick={() => inputRef.current?.click()}
          >
            Upload
          </Button>
          <VisuallyHiddenInput
            ref={inputRef}
            type="file"
            onChange={onFileChange}
          />
        </>
      ) : (
        <HStack w="full" justify="space-between">
          <Button
            size={buttonSize}
            leftIcon={<BiLeftArrowAlt />}
            onClick={() => setActiveLink('Post')}
          >
            Back To Post
          </Button>
          <Button
            size={buttonSize}
            variant="outline"
            leftIcon={<MdDelete />}
            onClick={clearFile}
          >
            Remove
          </Button>
        </HStack>
      )}
    </VStack>
  )
}

export default MediaUpload
