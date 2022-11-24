import { useState } from 'react'
import Head from 'next/head'
import { useWallet } from '@cosmos-kit/react'
import { StdFee } from '@cosmjs/amino'
import { SigningStargateClient } from '@cosmjs/stargate'
import BigNumber from 'bignumber.js'

import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  Grid,
  Heading,
  Icon,
  Link,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react'
import { BsFillMoonStarsFill, BsFillSunFill } from 'react-icons/bs'
import { chainassets, chainName, coin, dependencies, products } from '../config'

import { WalletStatus } from '@cosmos-kit/core'
import { Dependency, handleChangeColorModeValue, Product, WalletSection } from '../components'
import { SendTokensCard } from '../components/react/send-tokens-card'

import { cosmos, createRpcQueryHooks } from '../codegen'
import { getRpcClient } from '../codegen'
import { useRpcClient, useRpcEndpoint } from '../codegen'

const library = {
  title: 'Telescope',
  text: 'telescope',
  href: 'https://github.com/osmosis-labs/telescope',
}

const sendTokens = (
  getSigningStargateClient: () => Promise<SigningStargateClient>,
  setResp: (resp: string) => any,
  address: string,
) => {
  return async () => {
    const stargateClient = await getSigningStargateClient()
    if (!stargateClient || !address) {
      console.error('stargateClient undefined or address undefined.')
      return
    }

    const { send } = cosmos.bank.v1beta1.MessageComposer.withTypeUrl

    const msg = send({
      amount: [
        {
          denom: coin.base,
          amount: '1000',
        },
      ],
      toAddress: address,
      fromAddress: address,
    })

    const fee: StdFee = {
      amount: [
        {
          denom: coin.base,
          amount: '2000',
        },
      ],
      gas: '86364',
    }
    const response = await stargateClient.signAndBroadcast(address, [msg], fee)
    setResp(JSON.stringify(response, null, 2))
  }
}

// Get the display exponent
// we can get the exponent from chain registry asset denom_units
const COIN_DISPLAY_EXPONENT = coin.denom_units.find((unit) => unit.denom === coin.display)
  ?.exponent as number

export default function Home() {
  const { colorMode, toggleColorMode } = useColorMode()

  const { getSigningStargateClient, address, walletStatus, getRpcEndpoint } =
    useWallet()

  const [resp, setResp] = useState('')

  // const {
  //   data: rpcEndpoint
  // } = useRpcEndpoint({
  //   //@ts-ignore 
  //   getter: getRpcEndpoint
  // });

  const rpcEndpoint = 'https://rpc.cosmos.directory/cosmoshub';

  const {
    data: rpcClient
  } = useRpcClient({
    rpcEndpoint,
    options: {
      enabled: !!rpcEndpoint,
    }
  });

  console.log({
    rpcEndpoint,
    rpcClient
  })

  //@ts-ignore 
  // const cosmosHooks = cosmos.ClientFactory.createRPCQueryHooks({ rpc: rpcClient })
  const cosmosHooks = createRpcQueryHooks({ rpc: rpcClient })

  const {
    data: balance,
    isSuccess: isBalanceLoaded,
    isLoading: isFetchingBalance,
    refetch: refetchBalance,
  } = cosmosHooks.cosmos.bank.v1beta1.useBalance({
    request: {
      address: address || '',
      denom: chainassets?.assets[0].base as string,
    },
    options: {
      enabled: !!address && !!rpcClient,
      // transform the returned balance into a BigNumber
      select: ({ balance }) => new BigNumber(balance?.amount ?? 0).multipliedBy(10 ** -COIN_DISPLAY_EXPONENT),
    },
  })

  console.log(JSON.stringify({
    address,
    balance,
    isBalanceLoaded,
    isFetchingBalance,
    refetchBalance
  }, null, 2))

  return (
    <Container maxW="5xl" py={10}>
      <Head>
        <title>Create Cosmos App</title>
        <meta name="description" content="Generated by create cosmos app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex justifyContent="end" mb={4}>
        <Button variant="outline" px={0} onClick={toggleColorMode}>
          <Icon
            as={useColorModeValue(
              BsFillMoonStarsFill,
              BsFillSunFill,
            )}
          />
        </Button>
      </Flex>
      <Box textAlign="center">
        <Heading
          as="h1"
          fontSize={{ base: '3xl', md: '5xl' }}
          fontWeight="extrabold"
          mb={3}
        >
          Create Cosmos App
        </Heading>
        <Heading
          as="h1"
          fontWeight="bold"
          fontSize={{ base: '2xl', md: '4xl' }}
        >
          <Text as="span">Welcome to&nbsp;</Text>
          <Text
            as="span"
            color={handleChangeColorModeValue(
              colorMode,
              'primary.500',
              'primary.200',
            )}
          >
            CosmosKit&nbsp;+&nbsp;Next.js&nbsp;+&nbsp;
            <Link href={library.href} target="_blank" rel="noreferrer">
              {library.title}
            </Link>
          </Text>
        </Heading>
      </Box>

      <WalletSection />

      <Center mb={16}>
        <SendTokensCard
          isConnectWallet={walletStatus === WalletStatus.Connected}
          balance={isBalanceLoaded ? balance.toNumber() : 0}
          isFetchingBalance={isFetchingBalance}
          response={resp}
          sendTokensButtonText="Send Tokens"
          handleClickSendTokens={sendTokens(
            getSigningStargateClient as () => Promise<SigningStargateClient>,
            setResp as () => any,
            address as string,
          )}
          handleClickGetBalance={refetchBalance}
        />
      </Center>

      <Box mb={16}>
        <Divider />
      </Box>
      <Grid
        templateColumns={{
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
        }}
        gap={8}
        mb={14}
      >
        {products.map((product) => (
          <Product key={product.title} {...product} />
        ))}
      </Grid>
      <Grid templateColumns={{ md: 'repeat(3, 1fr)' }} gap={8} mb={20}>
        <Dependency {...library} />
        {dependencies.map((dependency) => (
          <Dependency key={dependency.title} {...dependency} />
        ))}
      </Grid>

      <Box mb={3}>
        <Divider />
      </Box>
      <Stack
        isInline={true}
        spacing={1}
        justifyContent="center"
        opacity={0.5}
        fontSize="sm"
      >
        <Text>Built with</Text>
        <Link
          href="https://cosmology.tech/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Cosmology
        </Link>
      </Stack>
    </Container>
  )
}
