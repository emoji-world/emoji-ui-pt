import { DatePicker, Form, Modal, ModalProps, Radio, Space } from 'antd';
import style from './index.module.scss';
import TokenAmount from '../../../../components/TokenAmount';
import { useMemo } from 'react';
import dayjs from 'dayjs';

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
function DepositModal(props: ModalProps) {
  const [form] = Form.useForm();

  return <Modal
    { ...props }
    title="DepositModal">
    <Form
      form={form}
      layout="vertical">
      <Form.Item label="WithdrawTime" name="withdrawTime">
        <WithdrawTime />
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
