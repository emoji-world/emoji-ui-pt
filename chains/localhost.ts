import { Chain } from '@rainbow-me/rainbowkit';

export const localhost: Chain = {
  id: 31337,
  network: 'localhost',
  name: 'localhost',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
    public: {
      http: ['http://127.0.0.1:8545'],
    },
  },
  testnet: true,
};
