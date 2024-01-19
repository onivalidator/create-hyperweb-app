import Head from 'next/head';
import { Box, Container, useTheme } from '@interchain-ui/react';
import { Header } from './Header';
import { Footer } from './Footer';

export const Layout = ({ children }: { children?: React.ReactNode }) => {
  const { theme } = useTheme();

  return (
    <Box
      top="0"
      bottom="0"
      left="0"
      right="0"
      height="100%"
      backgroundColor={theme === 'light' ? '$white' : '$gray900'}
      data-part-id="layout-container"
    >
      <Container
        maxWidth="64rem"
        attributes={{
          paddingY: '$14',
        }}
      >
        <Head>
          <title>Create Cosmos App</title>
          <meta name="description" content="Generated by create cosmos app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header />

        <div id="body">{children}</div>

        <Footer />
      </Container>
    </Box>
  );
};