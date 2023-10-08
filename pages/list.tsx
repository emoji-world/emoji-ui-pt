import { Button, DatePicker, Form, Input, InputNumber, Radio, Modal, Space, Table, Tag, message, Slider } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useContractRead, useContractWrite } from 'wagmi';
import { abi } from '../contracts/JIMAO.json';
import { formatEther, parseEther } from 'viem';
import dayjs from 'dayjs';
import style from '../styles/list.module.scss';
import TokenAmount from '../components/TokenAmount';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

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
    onSuccess: () => {
      myDeposits.refetch();
      message.success('deposit success');
    },
    onError: (error: any) => {
      message.error(error.shortMessage ?? error.message);
    },
  });

  const changeDepositETH = useContractWrite({
    abi,
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    functionName: 'changeDepositETH',
    onSuccess: () => {
      myDeposits.refetch();
      message.success('change deposit success');
    },
    onError: (error: any) => {
      message.error(error.shortMessage ?? error.message);
    },
  });

  const [time, setTime] = useState<number>(0);
  const [bn, setBN] = useState<bigint>(0n);

  if (!isClient) return null;
  return <div className={style.page}>
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
            width: 110,
            render: (record, _, index) => {
              return <Space>
                <Button
                  type="link"
                  disabled={!(dayjs().unix() >= record.withdrawTime) || record.amount <= 0}
                  onClick={() => {
                    setWithdrawModal({ ...record, index });
                    setWithdrawAmount(BigInt(record.amount));
                  }}>Withdraw</Button>
              </Space>;
            },
          },
        ]}
        dataSource={(myDeposits as any).data?.list ?? []}
      />
    </div>
    <Modal
      title="DepositETH"
      open={addModal}
      okButtonProps={{ loading: depositETH.isLoading }}
      onOk={async () => {
        try {
          const data = await addForm.validateFields();
          await depositETH.writeAsync({
            args: [data.withdrawTime],
            value: parseEther(data.amount.toString()),
          });
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
  </div>;
}
