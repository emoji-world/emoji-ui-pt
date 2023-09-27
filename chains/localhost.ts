import { defineChain } from 'viem/utils/chain';

export const localhost = /*#__PURE__*/ defineChain({
  id: 5,
  network: 'locaohost',
  name: 'locaohost',
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
})
