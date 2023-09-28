import { useEffect, useMemo, useState } from 'react';
import { useNetwork, useToken } from 'wagmi';

export default () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const network = useNetwork();

  const jimaoToken = useToken({
    address: (network.chain?.contracts?.jimaoToken as any)?.address,
  });

  if (!isClient) return null;
  return <div>
    <div>{jimaoToken.data?.name}</div>
    <pre>
      {JSON.stringify(network.chain?.contracts, null, 2)}
    </pre>
  </div>;
};
