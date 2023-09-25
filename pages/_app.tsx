import '../styles/globals.scss';
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, lightTheme, connectorsForWallets } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  arbitrum,
  arbitrumGoerli,
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { ConfigProvider } from 'antd'; 
import Layout from '../layout';
import { useEffect } from 'react';
import { merge } from '../utils/tools';
import {
  metaMaskWallet,
  coinbaseWallet,
  okxWallet,
  rainbowWallet,
  walletConnectWallet,
  injectedWallet,
  argentWallet,
  trustWallet,
  ledgerWallet,
  omniWallet,
  imTokenWallet,
} from '@rainbow-me/rainbowkit/wallets';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    arbitrum,
    arbitrumGoerli,
    // ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [goerli] : []),
  ],
  [publicProvider()]
);

const appName = 'RainbowKit App';
const projectId = 'YOUR_PROJECT_ID';
const walletOptions = { chains, appName, projectId };

const connectors = connectorsForWallets([
  {
    groupName: 'Popular',
    wallets: [
      metaMaskWallet(walletOptions),
      coinbaseWallet(walletOptions),
      okxWallet(walletOptions),
      rainbowWallet(walletOptions),
      walletConnectWallet(walletOptions),
      injectedWallet(walletOptions),
    ],
  },
  {
    groupName: 'Suggested',
    wallets: [
      argentWallet(walletOptions),
      trustWallet(walletOptions),
      ledgerWallet(walletOptions),
      omniWallet(walletOptions),
      imTokenWallet(walletOptions),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    console.log(lightTheme());
  }, []);

  return (
    <ConfigProvider theme={{
      token: {
        colorPrimary: '#ffbd2c',
      },
    }}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider
          chains={chains}
          theme={merge(lightTheme({
            accentColor: '#ffbd2c',
            borderRadius: 'small',
          }), {

          })}>
          <Layout Component={Component} pageProps={pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </ConfigProvider>
  );
}

export default MyApp;
