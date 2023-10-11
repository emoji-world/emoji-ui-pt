import { Form, Modal, ModalProps } from 'antd';
import TokenAmount from '../../../common/TokenAmount';
import { useEffect, useState } from 'react';
import ExpireTimePicker from '../../../common/ExpireTimePicker';
import { useAccount, useBalance } from 'wagmi';

export default
function DepositModal(props: ModalProps) {
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

  return <Modal
    { ...props }
    open={open}
    title="DepositModal"
    maskClosable={false}
    onOk={async (event) => {
      const data = await form.validateFields();
      console.log(data);
    }}>
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
          balanceLoading={balance.isLoading}
          onUpdateBalance={() => balance.refetch()}
        />
      </Form.Item>
    </Form>
  </Modal>;
}
