import { CommunityData } from './../types'
import { joinLeaveCommunity } from './../utils/firebase'
import { useEffect, useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { AuthModalState, UserDataState } from '../atoms/atoms'

import { useToast } from '@chakra-ui/react'

const useJoinCommunity = (community: CommunityData) => {
  const { name, imageURL, privacyType } = community
  const [userData, setUserData] = useRecoilState(UserDataState)
  const setAuthModal = useSetRecoilState(AuthModalState)
  const [joined, setJoined] = useState<boolean>(
    !!userData?.userCommunities.find((i) => i.name === name)
  )
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  useEffect(() => {
    setJoined(!!userData?.userCommunities.find((i) => i.name === name))
  }, [userData])

  const handleJoinLeave = async () => {
    if (!userData) {
      setAuthModal({ open: true, view: 'login' })
      return
    }
    setLoading(true)
    const [joined, error] = await joinLeaveCommunity(community, userData)

    if (error) {
      toast({
        status: 'error',
        title: 'Error',
        description: error,
        isClosable: true,
      })
      return
    }

    if (joined === 'joined') {
      setUserData((p) => ({
        ...p,
        userCommunites: p.userCommunities.concat({
          name,
          imageURL,
          privacyType,
        }),
      }))
    } else {
      setUserData((p) => ({
        ...p,
        userCommunites: p.userCommunities.filter((com) => com.name === name),
      }))
    }
    setJoined(joined === 'joined' ? true : false)
    setLoading(false)
  }

  return { handleJoinLeave, joined, loading }
}

export default useJoinCommunity
