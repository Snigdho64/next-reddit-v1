import {
  Avatar,
  Flex,
  Heading,
  HStack,
  Icon,
  Spinner,
  Text,
  Tooltip,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { BiBookmarkAlt, BiComment, BiShare } from 'react-icons/bi'
import { PostData, PostVote } from '../../../types'
import Media from './Media'
import Moment from 'react-moment'
import { MdOutlineDelete } from 'react-icons/md'
import usePostAction from '../../../hooks/usePostAction'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { firestore } from '../../../firebase/firebaseConfig'
import { useRecoilValue } from 'recoil'
import { CommunityDataState, UserDataState } from '../../../atoms/atoms'
import {
  BsFillArrowDownCircleFill,
  BsFillArrowUpCircleFill,
} from 'react-icons/bs'
import { useRouter } from 'next/router'

const PostCard: React.FC<{ postData: PostData; pageView?: boolean }> = ({
  postData,
  pageView,
}) => {
  const cardColor = useColorModeValue('white', 'gray.600')
  const iconColor = useColorModeValue('gray.500', 'gray.400')
  const iconHoverColor = useColorModeValue('gray.300', 'gray.300')
  const deleteIconColor = useColorModeValue('red.500', 'red.300')
  const deleteIconHoverColor = useColorModeValue('red.500', 'red.300')
  const upvoteColor = useColorModeValue('orange.500', 'orange.300')
  const downvoteColor = useColorModeValue('blue.500', 'blue.300')

  const { loading, error, onDelete, onVote } = usePostAction()

  const user = useRecoilValue(UserDataState)
  const community = useRecoilValue(CommunityDataState)
  const { push } = useRouter()

  const [voteType, setVoteType] = useState<'upvote' | 'downvote'>(null)
  const [post, setPost] = useState(postData)

  useEffect(
    () =>
      onSnapshot(doc(firestore, 'posts', post.id), async (snapshot) => {
        if (snapshot.exists()) {
          setPost({ ...snapshot.data(), id: snapshot.id } as PostData)
        }
        if (!user?.uid) return
        const postVoteDoc = doc(
          firestore,
          'posts',
          post.id,
          'postVotes',
          user.uid
        )
        const postVoteSnap = await getDoc(postVoteDoc)
        if (postVoteSnap.exists()) {
          setVoteType((postVoteSnap.data() as PostVote).type)
        } else {
          setVoteType(null)
        }
      }),
    [user]
  )

  return (
    <Flex
      maxW={pageView ? ['800px'] : '600px'}
      w={pageView ? ['96%', '80%%'] : ['96%', '80%%', '600px']}
      rounded={['lg', 'xl', '2xl']}
      shadow={'lg'}
      p={[2, 4]}
      bg={cardColor}
    >
      <HStack w="full" align="self-start">
        <VStack justify={'flex-start'} maxW="10%">
          <Icon
            as={BsFillArrowUpCircleFill}
            fontSize={['2xl', '3xl', '4xl']}
            cursor="pointer"
            color={voteType === 'upvote' ? upvoteColor : iconColor}
            __css={{
              ':hover': { transform: 'scale(1.1)', color: iconHoverColor },
            }}
            onClick={onVote.bind(null, post.id, user?.uid, 'upvote')}
          />
          <Text
            wordBreak="break-word"
            fontWeight="bold"
            fontSize={['md', 'lg']}
          >
            {post.votesCount}
          </Text>
          <Icon
            as={BsFillArrowDownCircleFill}
            fontSize={['2xl', '3xl', '4xl']}
            cursor="pointer"
            color={voteType === 'downvote' ? downvoteColor : iconColor}
            __css={{
              ':hover': { transform: 'scale(1.1)', color: iconHoverColor },
            }}
            onClick={onVote.bind(null, post.id, user?.uid, 'downvote')}
          />
        </VStack>
        <VStack
          p={2}
          w="full"
          onClick={() => push(`/r/${post.community.name}/p/${post.id}`)}
        >
          <HStack w="full" justify={'space-between'}>
            <VStack align="flex-start">
              <Flex gap={1}>
                <Avatar src={post.community.imageURL} size="xs" />
                <Text>{post.community.name}</Text>
              </Flex>
              <HStack>
                <Avatar src={post.createdBy.photoURL} size="sm" />
                <Text>{post.createdBy.username}</Text>
              </HStack>
            </VStack>
            <Moment date={new Date(post.createdAt.seconds * 1000)} fromNow />
          </HStack>
          <VStack align="flex-start" w="full" px={[2, 4]}>
            <Heading size={'md'}>{post.title}</Heading>
            <Text>{post.description}</Text>
          </VStack>
          <Media mediaData={post.media} />
          <HStack w="full" px={2} justify="space-between">
            <Flex gap={2}>
              <Icon
                as={BiComment}
                fontSize={['2xl', '3xl', '4xl']}
                color={iconColor}
                __css={{
                  ':hover': { transform: 'scale(1.1)', color: iconHoverColor },
                }}
              />
              <Text wordBreak="break-word" fontWeight="bold">
                {post.commentsCount}
              </Text>
              <Icon
                as={BiShare}
                __css={{
                  ':hover': { transform: 'scale(1.1)', color: iconHoverColor },
                }}
                fontSize={['2xl', '3xl', '4xl']}
                color={iconColor}
              />
              <Icon
                as={BiBookmarkAlt}
                __css={{
                  ':hover': { transform: 'scale(1.1)', color: iconHoverColor },
                }}
                fontSize={['2xl', '3xl', '4xl']}
                color={iconColor}
              />
            </Flex>
            {post.createdBy.username === user?.username && (
              <Tooltip hasArrow label="Delete" placement="bottom">
                <Flex>
                  <Icon
                    as={!loading ? MdOutlineDelete : Spinner}
                    __css={{
                      ':hover': {
                        transform: 'scale(1.1)',
                        color: deleteIconHoverColor,
                      },
                    }}
                    fontSize={['2xl', '3xl', '4xl']}
                    color={deleteIconColor}
                    onClick={() => onDelete(post.id)}
                  />
                </Flex>
              </Tooltip>
            )}
          </HStack>
        </VStack>
      </HStack>
    </Flex>
  )
}

export default PostCard
