import { Button, Input, InputNumber, Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useContractRead, useContractWrite } from 'wagmi';
import { abi } from '../contracts/JIMAO.json';
import { formatEther, parseEther } from 'viem';
import dayjs from 'dayjs';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export default
function List() {
  const [isClient, setIsClient] = useState(false);
  const [deposit, setDeposit] = useState<number>(0);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => setIsClient(true), []);

  const myDeposits = useContractRead({
    abi,
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    functionName: 'myDeposits',
    args: [pageNum, pageSize],
  });

  const depositETH = useContractWrite({
    abi,
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    functionName: 'depositETH',
    args: [0],
    onSuccess: () => {
      myDeposits.refetch();
    },
  });

  if (!isClient) return null;
  return <div>
    <div>
      <Space>
        <InputNumber min={0} onChange={(value) => setDeposit(value ?? 0)} />
        <Button type="primary" onClick={() => {
          depositETH.write({ value: parseEther(deposit.toString()) });
        }}>Deposit</Button>
      </Space>
    </div>
    {/* <div>
      <pre>{JSON.stringify(myDeposits, null, 2)}</pre>
    </div> */}
    <Table
      bordered
      size="large"
      pagination={{
        current: Number((myDeposits as any).data?.pageNum ?? 0),
        total: Number((myDeposits as any).data?.total ?? 0),
        pageSize,
        onChange: (pageNum, pageSize) => {
          setPageNum(pageNum);
          setPageSize(pageSize);
        },
      }}
      columns={[
        {
          title: 'Amount',
          dataIndex: 'amount',
          render: (amount) => formatEther(amount) + ' ETH',
        },
        {
          title: 'WithdrawTime',
          dataIndex: 'withdrawTime',
          width: 180,
          render: (withdrawTime) => dayjs(Number(withdrawTime.toString())).format('YYYY-MM-DD HH:mm:ss'),
        },
      ]}
      dataSource={(myDeposits as any).data?.list ?? []}
    />
  </div>;
}
