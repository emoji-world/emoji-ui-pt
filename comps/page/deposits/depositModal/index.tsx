import { DatePicker, Form, Modal, ModalProps, Radio, Space } from 'antd';
import style from './index.module.scss';
import TokenAmount from '../../../common/TokenAmount';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import ExpireTimePicker from '../../../common/ExpireTimePicker';
import { useAccount, useBalance } from 'wagmi';

export default
function DepositModal(props: ModalProps) {
  const [form] = Form.useForm();
  const account = useAccount();
  const balance = useBalance({ address: account.address });

  return <Modal
    { ...props }
    title="DepositModal"
    maskClosable={false}>
    {/* <pre>{JSON.stringify(balance, null, 2)}</pre> */}
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
        />
      </Form.Item>
    </Form>
  </Modal>;
}
