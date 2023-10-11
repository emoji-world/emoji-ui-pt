import { Form, Modal, ModalProps, message } from 'antd';
import TokenAmount from '../../../common/TokenAmount';
import { useEffect, useState } from 'react';
import ExpireTimePicker from '../../../common/ExpireTimePicker';
import { useAccount, useBalance, useContractWrite } from 'wagmi';
import { abi } from '../../../../contracts/JIMAO.json';

const address = '0x527C0b26D899A3Bc7d232ADFb4B771cD3F1c4910';

export
interface IProps extends ModalProps {
  onNewTxn?: (data: { hash: `0x${string}`, name?: string }) => void;
}

export default
function DepositModal(props: IProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [form] = Form.useForm();
  const account = useAccount();
  const balance = useBalance({ address: account.address });

  const openModal = async () => {
    const latestBalance = await balance.refetch();
    form.resetFields();
    form.setFieldValue('withdrawTime', 0);
    form.setFieldValue('amount', latestBalance.data?.value ?? 0n);
    setOpen(true);
  };

  useEffect(() => {
    if (props.open) openModal();
    else setOpen(false);
  }, [props.open]);

  const depositETH = useContractWrite({
    abi,
    address,
    functionName: 'depositETH',
    onError: (error: any) => {
      message.error(error.shortMessage ?? error.message);
    },
  });

  const handleDepositETH = async (event: any) => {
    try {
      const data = await form.validateFields();
      const txn = await depositETH.writeAsync({
        args: [data.withdrawTime],
        value: data.amount,
      });
      message.success('Deposit has submitted');
      props.onNewTxn?.({ hash: txn.hash, name: 'Deposit ETH' });
      props.onCancel?.(event);
    } catch (error) {
      console.error(error);
    }
  };

  return <Modal
    { ...props }
    open={open}
    title="DepositModal"
    maskClosable={false}
    okButtonProps={{
      loading: depositETH.isLoading,
    }}
    onOk={handleDepositETH}>
    <Form
      form={form}
      layout="vertical">
      <Form.Item label="WithdrawTime" name="withdrawTime">
        <ExpireTimePicker />
      </Form.Item>
      <Form.Item label="Amount" name="amount">
        <TokenAmount
          symbol="ETH"
          balance={(balance.data?.value ?? 0n)}
          precision={Number(balance.data?.decimals ?? 0)}
          precisionShow={4}
          showBalanceLoading
          balanceLoading={balance.isLoading}
          onUpdateBalance={() => balance.refetch()}
        />
      </Form.Item>
    </Form>
  </Modal>;
}
