
import { Button, DatePicker, Radio, Space, Table } from 'antd';
import style from '../styles/deposits.module.scss';
import { useAccount, useContractRead } from 'wagmi';
import { useEffect, useMemo, useState } from 'react';
import { abi } from '../contracts/JIMAO.json';
import { formatEther } from 'viem';
import dayjs from 'dayjs';
import DepositModal from '../comps/page/deposits/depositModal';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const address = '0x527C0b26D899A3Bc7d232ADFb4B771cD3F1c4910';


export default
function Deposits() {
  const [isClient, setIsClient] = useState(false);
  const account = useAccount();
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  const [depositModal, setDepositModal] = useState<boolean>(false);

  const myDeposits = useContractRead({
    abi,
    address,
    functionName: 'myDeposits',
    args: [account.address, pageNum, pageSize],
    keepPreviousData: true,
  });
  const myDepositsData = useMemo(() => (myDeposits.data ?? { }) as any, [myDeposits]);

  useEffect(() => setIsClient(true), []);
  if (!isClient) return null;
  return <div className={style.page}>
    <div>
      <Space>
        <span>{account.address}</span>
      </Space>
    </div>
    {/* <div>
      <pre>{JSON.stringify(myDeposits, null, 2)}</pre>
    </div> */}
    <div className={style.header}>
      <span></span>
      <Button type="primary" onClick={() => {
        setDepositModal(true);
      }}>Deposit</Button>
    </div>
    <div className={style.content}>
      <Table
        loading={myDeposits.isLoading}
        bordered
        size="small"
        columns={[
          {
            title: 'Amount',
            dataIndex: 'amount',
            render: (value: bigint) => <span style={{ fontWeight: 'bold' }}>{`${formatEther(value)} ETH`}</span>,
          },
          {
            title: 'WithdrawTime',
            dataIndex: 'withdrawTime',
            width: 180,
            render: (value: bigint) => dayjs(Number(value)).format('YYYY-MM-DD HH:mm:ss'),
          },
          {
            title: 'Actions',
            width: 160,
            render: () => <Space>
              <Button type="link">Withdraw</Button>
              <Button type="link">Append</Button>
            </Space>,
          },
        ]}
        dataSource={myDepositsData.list ?? []}
        pagination={{
          size: 'default',
          total: Number(myDepositsData.total),
          current: Number(myDepositsData.pageNum),
          pageSize: Number(myDepositsData.pageSize),
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20, 50],
          onChange: (pageNum, pageSize) => {
            setPageNum(pageNum);
            setPageSize(pageSize);
          },
        }}
      />
    </div>
    <DepositModal
      open={depositModal}
      onCancel={() => setDepositModal(false)}
    />
  </div>;
}
