import { Form, Modal, ModalProps, message } from 'antd';
import TokenAmount from '../../../common/TokenAmount';
import { useContractWrite } from 'wagmi';
import { abi } from '../../../../contracts/JIMAO.json';
import { useEffect } from 'react';

const address = '0x527C0b26D899A3Bc7d232ADFb4B771cD3F1c4910';

export
interface IProps extends ModalProps {
  open: any;
  onNewTxn?: (data: { hash: string, name?: string }) => void;
}

export default
function AppendModal(props: IProps) {
  const [form] = Form.useForm();

  const withdrawETH = useContractWrite({
    abi,
    address,
    functionName: 'changeDepositETH',
    onError: (error: any) => {
      message.error(error.shortMessage ?? error.message);
    },
  });

  const handleWithdrawETH = async (event: any) => {
    try {
      const data = await form.validateFields();
      const txn = await withdrawETH.writeAsync({ args: [props.open.index, data.amount] });
      message.success('Withdraw has submitted');
      props.onNewTxn?.({ hash: txn.hash, name: 'Withdraw ETH' });
      props.onCancel?.(event);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (props.open) {
      form.resetFields();
      form.setFieldsValue({
        amount: props.open?.amount ?? 0n,
      });
    }
  }, [props.open]);

  return <Modal
    { ...props }
    title="AppendModal"
    maskClosable={false}
    okButtonProps={{
      loading: withdrawETH.isLoading,
    }}
    onOk={handleWithdrawETH}>
    <Form
      form={form}
      layout="vertical">
      <Form.Item label="Amount" name="amount">
        <TokenAmount
          symbol="ETH"
          balance={(props.open?.amount ?? 0n)}
          precision={18}
          precisionShow={4}
        />
      </Form.Item>
    </Form>
  </Modal>;
}
