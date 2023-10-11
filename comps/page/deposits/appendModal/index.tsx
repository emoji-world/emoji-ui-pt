import { Form, Modal, ModalProps, message } from 'antd';
import TokenAmount from '../../../common/TokenAmount';
import { useAccount, useBalance, useContractWrite } from 'wagmi';
import { abi } from '../../../../contracts/JIMAO.json';
import { useEffect, useState } from 'react';

const address = '0x527C0b26D899A3Bc7d232ADFb4B771cD3F1c4910';

export
interface IProps extends ModalProps {
  open: any;
  onNewTxn?: (data: { hash: string, name?: string }) => void;
}

export default
function AppendModal(props: IProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [form] = Form.useForm();
  const account = useAccount();
  const balance = useBalance({ address: account.address });

  const openModal = async () => {
    const latestBalance = await balance.refetch();
    form.resetFields();
    form.setFieldValue('amount', latestBalance.data?.value ?? 0n);
    setOpen(true);
  };

  useEffect(() => {
    if (props.open) openModal();
    else setOpen(false);
  }, [props.open]);

  const appendETH = useContractWrite({
    abi,
    address,
    functionName: 'changeDepositETH',
    onError: (error: any) => {
      message.error(error.shortMessage ?? error.message);
    },
  });

  const handleAppendETH = async (event: any) => {
    try {
      const data = await form.validateFields();
      const txn = await appendETH.writeAsync({
        args: [props.open.index, 0],
        value: data.amount,
      });
      message.success('Append has submitted');
      props.onNewTxn?.({ hash: txn.hash, name: 'Append ETH' });
      props.onCancel?.(event);
    } catch (error) {
      console.error(error);
    }
  };

  return <Modal
    { ...props }
    open={open}
    title="AppendModal"
    maskClosable={false}
    okButtonProps={{
      loading: appendETH.isLoading,
    }}
    onOk={handleAppendETH}>
    <Form
      form={form}
      layout="vertical">
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
