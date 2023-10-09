import { Button, DatePicker, Form, Input, InputNumber, Radio, Modal, Space, Table, Tag, message, Slider } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useAccount, useBalance, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import { abi } from '../contracts/JIMAO.json';
import { formatEther, parseEther } from 'viem';
import dayjs from 'dayjs';
import style from '../styles/list.module.scss';
import TokenAmount from '../components/TokenAmount';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const address = '0x527C0b26D899A3Bc7d232ADFb4B771cD3F1c4910';

function WithdrawTime(props: {
  value?: number,
  onChange?: (value: number) => void,
}) {
  const isTime = useMemo(() => props.value as number > 0, [props.value]);
  const time = useMemo(() => dayjs.unix(props.value ?? 0), [props.value]);
  return <Space>
    <Radio.Group
      value={isTime}
      onChange={(event) => props.onChange?.(event.target.value ? dayjs().add(1, 'years').unix() : 0)}>
      <Radio value={true}>Time</Radio>
      <Radio value={false}>Demand</Radio>
    </Radio.Group>
    {isTime && <DatePicker
      value={time}
      onChange={(value) => props.onChange?.(value?.unix() ?? 0)}
      showTime
      placeholder="Please select WithdrawTime"
      style={{ width: '240px' }}
    />}
  </Space>;
}

export default
function List() {
  const [isClient, setIsClient] = useState(false);
  const [deposit, setDeposit] = useState<number>(0);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [addModal, setAddModal] = useState<boolean>(false);
  const [addForm] = Form.useForm();
  const [addData, setAddData] = useState<any>({ });

  const [withdrawModal, setWithdrawModal] = useState<any>(null);
  const [withdrawAmount, setWithdrawAmount] = useState<bigint>(0n);

  const [appendModal, setAppendModal] = useState<any>(null);
  const [appendAmount, setAppendAmount] = useState<bigint>(0n);

  useEffect(() => setIsClient(true), []);

  const account = useAccount();
  const balance = useBalance({ address: account.address });

  const myDeposits = useContractRead({
    abi,
    address,
    functionName: 'myDeposits',
    args: [account.address, pageNum, pageSize],
  });

  const myAddress = useContractRead({
    abi,
    address,
    functionName: 'myAddress',
  });

  const [depositETHHash, setDepositETHHash] = useState<any>(null);
  const depositETH = useContractWrite({
    abi,
    address,
    functionName: 'depositETH',
    onError: (error: any) => {
      message.error(error.shortMessage ?? error.message);
    },
  });

  const wait = useWaitForTransaction({
    hash: depositETHHash,
    onReplaced: (data) => {
      message.info('onReplaced');
    },
    onSettled: (data) => {
      console.log(1111, data?.transactionHash);
      myDeposits.refetch();
      message.success('deposit success');
    },
  });

  const changeDepositETH = useContractWrite({
    abi,
    address,
    functionName: 'changeDepositETH',
    onSuccess: () => {
      myDeposits.refetch();
      message.success('change deposit success');
    },
    onError: (error: any) => {
      message.error(error.shortMessage ?? error.message);
    },
    onSettled: () => {
      balance.refetch();
    },
  });

  if (!isClient) return null;
  return <div className={style.page}>
    {/* <div>
      <pre>{JSON.stringify(myAddress, null, 2)}</pre>
    </div> */}
    <div>
      {balance.data?.formatted}
    </div>
    <div className={style.top}>
      <span></span>
      <Space>
        <Button type="primary" onClick={() => {
          addForm.resetFields();
          addForm.setFieldsValue({ withdrawTime: 0 });
          setAddModal(true);
        }}>Deposit</Button>
      </Space>
    </div>
    <div className={style.table}>
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
            render: (value) => {
              if (value <= 0) return <Tag>活期</Tag>;
              return <Tag>{dayjs.unix(Number(value)).format('YYYY-MM-DD HH:mm:ss')}</Tag>;
            },
          },
          {
            title: 'Actions',
            width: 200,
            render: (record, _, index) => {
              return <Space>
                <Button
                  type="link"
                  disabled={!(dayjs().unix() >= record.withdrawTime) || record.amount <= 0}
                  onClick={() => {
                    setWithdrawModal({ ...record, index: (pageNum - 1) * pageSize + index });
                    setWithdrawAmount(BigInt(record.amount));
                  }}>
                  Withdraw
                </Button>
                <Button
                  type="link"
                  onClick={() => {
                    setAppendModal({ ...record, index });
                  }}>
                  Append
                </Button>
              </Space>;
            },
          },
        ]}
        dataSource={(myDeposits as any).data?.list ?? []}
      />
      <div onClick={() => {
        console.log(myDeposits.data);
      }}>123</div>
    </div>
    <Modal
      title="DepositETH"
      open={addModal}
      okButtonProps={{ loading: depositETH.isLoading }}
      onOk={async () => {
        try {
          const data = await addForm.validateFields();
          const tx = await depositETH.writeAsync({
            args: [data.withdrawTime],
            value: parseEther(data.amount.toString()),
          });
          setDepositETHHash(tx.hash);
          console.log(1112, tx.hash);
          setAddModal(false);
        } catch (error) {
          console.error(error);
        }
      }}
      onCancel={() => setAddModal(false)}>
      <Form form={addForm} layout="vertical">
        <Form.Item
          name="withdrawTime"
          label="WithdrawTime">
          <WithdrawTime />
        </Form.Item>
        <Form.Item
          name="amount"
          label="Amount"
          rules={[{
            required: true,
            validator: (_, value) => {
              if (value == null) return Promise.reject('Please input Amount');
              if (value <= 0) return Promise.reject('Amount must be greater than 0');
              return Promise.resolve();
            },
          }]}>
          <InputNumber
            min={0}
            placeholder="Please input Amount"
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Form>
    </Modal>
    <Modal
      title="WithdrawETH"
      maskClosable={false}
      open={withdrawModal}
      okButtonProps={{ loading: changeDepositETH.isLoading }}
      onOk={async () => {
        try {
          console.log(withdrawModal, withdrawAmount);
          await changeDepositETH.writeAsync({
            args: [withdrawModal.index, withdrawAmount],
          });
          setWithdrawModal(null);
        } catch (err) {
          console.error(err);
        }
      }}
      onCancel={() => setWithdrawModal(null)}>
      <TokenAmount
        symbol="ETH"
        value={withdrawAmount}
        balance={BigInt(withdrawModal?.amount ?? 0)}
        precision={18}
        onChange={(value) => setWithdrawAmount(value)}
      />
    </Modal>
    <Modal
      title="AppendETH"
      maskClosable={false}
      open={appendModal}
      onCancel={() => setAppendModal(null)}>
      <TokenAmount
        symbol="ETH"
        value={withdrawAmount}
        balance={balance.data?.value ?? 0n}
        precision={18}
        onChange={(value) => setWithdrawAmount(value)}
      />
    </Modal>
  </div>;
}
