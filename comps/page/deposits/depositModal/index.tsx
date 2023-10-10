import { DatePicker, Form, Modal, ModalProps, Radio, Space } from 'antd';
import style from './index.module.scss';
import TokenAmount from '../../../../components/TokenAmount';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import ExpireTimePicker from '../../../common/ExpireTimePicker';

export default
function DepositModal(props: ModalProps) {
  const [form] = Form.useForm();

  return <Modal
    { ...props }
    title="DepositModal">
    <Form
      form={form}
      layout="vertical">
      <Form.Item label="WithdrawTime" name="withdrawTime">
        <ExpireTimePicker />
      </Form.Item>
      <Form.Item label="Amount" name="amount">
        <TokenAmount
          symbol="ETH"
          balance={100000n}
          precision={2}
          precisionShow={2}
        />
      </Form.Item>
    </Form>
  </Modal>;
}
