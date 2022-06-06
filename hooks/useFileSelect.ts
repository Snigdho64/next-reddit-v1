import { useToast } from '@chakra-ui/react'
import React, { useState } from 'react'

const useFileSelector = () => {
  const [selectedFile, setSelectedFile] = useState<File>()
  const [media, setMedia] = useState<string>()

  const toast = useToast()

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files
    if (files.length) {
      const file = files[0]
      if (!file.type.match(/video|audio|image/)) {
        toast({
          status: 'warning',
          title: 'Only Media Files Are Supported',
          isClosable: true,
        })
        setMedia(null)
        setSelectedFile(null)
        return
      }
      const reader = new FileReader()
      reader.readAsDataURL(e.target.files[0])
      reader.onloadend = (ev) => {
        setMedia(reader.result.toString())
        setSelectedFile(file)
      }
    }
  }
  const clearFile = () => {
    setMedia(null)
    setSelectedFile(null)
  }
  return { selectedFile, setSelectedFile, onFileChange, clearFile, media }
}

export default useFileSelector
