import { Image } from '@chakra-ui/react'
import React from 'react'
import { MediaData } from '../../../types'

const Media: React.FC<{ mediaData: MediaData }> = ({ mediaData }) => {
  switch (mediaData.type.split('/')[0]) {
    case 'image':
      return <Image src={mediaData.URL} alt={mediaData.name} maxH="400px" />
    case 'video':
      return (
        <video
          src={mediaData.URL}
          controls
          style={{ maxWidth: '96%', maxHeight: '560px' }}
        />
      )
    case 'audio':
      return <audio src={mediaData.URL} controls style={{ width: '96%' }} />
    default:
      return <Image src={mediaData.URL} />
  }
}

export default Media
