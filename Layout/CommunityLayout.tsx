import { Center, Flex, HStack, Spinner, VStack } from '@chakra-ui/react'
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import Header from '../components/Community/Header'
import { firestore } from '../firebase/firebaseConfig'
import { CommunityData } from '../types'
import { CommunityDataState, PostsState } from '../atoms/atoms'
import { PostData } from '../types'
import Sidebar from '../components/Community/Sidebar'
import { getCommunity } from '../utils/firebase'

const CommunityLayout: React.FC<{
  hideHeader?: boolean
  communityName?: string
}> = ({ hideHeader, communityName, children }) => {
  const [community, setCommunity] = useRecoilState(CommunityDataState)
  const setPosts = useSetRecoilState(PostsState)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!community && communityName) {
      getCommunity(communityName).then((community) => {
        setCommunity(community)
        setLoading(false)
      })
    }
    setLoading(false)
  }, [community, communityName])

  useEffect(
    () =>
      onSnapshot(
        query(collection(firestore, 'posts'), orderBy('createdAt', 'desc')),
        (snapshot) => {
          let posts: PostData[] = []
          snapshot.docs.forEach((doc) =>
            posts.push({ ...doc.data(), id: doc.id } as PostData)
          )
          setPosts(posts)
        }
      ),
    []
  )

  useEffect(
    () =>
      !community
        ? null
        : onSnapshot(
            doc(firestore, 'communities', community.id),
            (snapshot) => {
              if (snapshot.exists()) {
                setCommunity({
                  ...snapshot.data(),
                  id: snapshot.id,
                } as CommunityData)
              }
            }
          ),
    []
  )

  return loading || !community ? (
    <Center w="100%" h="100vh">
      <Spinner
        position="absolute"
        top="50%"
        size={'xl'}
        thickness="4px"
        color="brand.100"
      />
    </Center>
  ) : (
    <HStack w="100%">
      <Flex flexDir={'column'} w="full" gap={2} h="full">
        {!hideHeader && <Header />}
        <VStack flex={1} p={[2, 4, 6, 8]} gap={[10, 20]}>
          {children}
        </VStack>
      </Flex>
      <Sidebar />
    </HStack>
  )
}

export default CommunityLayout
