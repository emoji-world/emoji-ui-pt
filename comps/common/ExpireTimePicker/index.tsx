import { DatePicker, Radio, Space } from 'antd';
import dayjs from 'dayjs';
import { useMemo } from 'react';

export default
function ExpireTimePicker(props: {
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
      presets={[
        { label: 'One Day', value: dayjs().add(1, 'days'), },
        { label: 'One Week', value: dayjs().add(1, 'weeks'), },
        { label: 'One Month', value: dayjs().add(1, 'months'), },
        { label: 'One Year', value: dayjs().add(1, 'years'), },
      ]}
      placeholder="Please select WithdrawTime"
      style={{ width: '200px' }}
    />}
  </Space>;
}
