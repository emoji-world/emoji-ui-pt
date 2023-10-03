import { useContractRead, useContractWrite, useToken } from 'wagmi';
import abi from '../contracts/JIMAO.json';
import { useEffect, useState } from 'react';
import { Button } from 'antd';
import { formatUnits } from 'viem';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export default () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const jimaoToken = useToken({
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  });

  const balanceOfResult = useContractRead({
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    abi: abi.abi,
    functionName: 'balanceOf',
    args: ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'],
  });

  const airdropResult = useContractWrite({
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    abi: abi.abi,
    functionName: 'airdrop',
    onSuccess: () => {
      balanceOfResult.refetch();
    },
  });

  if (!isClient) return null;

  return <div>
    <div>{jimaoToken.data?.name}</div>
    <div>
      <span onClick={() => {
        console.log(balanceOfResult.data);
      }}>余额:</span>
      <pre>{formatUnits(balanceOfResult.data as any, jimaoToken.data?.decimals as any)}</pre>
    </div>
    <div>
      <Button loading={airdropResult.isLoading} type="primary" onClick={() => {
        airdropResult.write();
      }}>领币</Button>
    </div>
    <div>
      <pre>
        {JSON.stringify(airdropResult, null, 2)}
      </pre>
    </div>
  </div>;
};
