import { Form, Modal, ModalProps, message } from 'antd';
import TokenAmount from '../../../common/TokenAmount';
import { useEffect, useState } from 'react';
import ExpireTimePicker from '../../../common/ExpireTimePicker';
import { useAccount, useBalance, useContractWrite } from 'wagmi';
import { abi } from '../../../../contracts/JIMAO.json';

const address = '0x527C0b26D899A3Bc7d232ADFb4B771cD3F1c4910';

export
interface IProps extends ModalProps {
  open: any;
  onNewTxn?: (data: { hash: string, name?: string }) => void;
}

export default
function WithdrawModal(props: IProps) {
  const [form] = Form.useForm();
  const account = useAccount();
  const balance = useBalance({ address: account.address });

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
    title="WithdrawModal"
    maskClosable={false}
    okButtonProps={{
      loading: depositETH.isLoading,
    }}
    onOk={handleDepositETH}>
    <Form
      form={form}
      layout="vertical">
      <Form.Item label="Amount" name="amount">
        <TokenAmount
          symbol="ETH"
          balance={(props.open?.amount ?? 0n)}
          precision={18}
          precisionShow={4}
          balanceLoading={balance.isLoading}
          onUpdateBalance={() => balance.refetch()}
        />
      </Form.Item>
    </Form>
  </Modal>;
}
