import { useMemo } from 'react';
import { DatePicker, Radio, Space } from 'antd';
import dayjs from 'dayjs';

export default
function ExpireTimePicker(props: {
  value?: number,
  onChange?: (value: number) => void,
}) {
  const isTime = useMemo(() => props.value as number > 0, [props.value]);
  const time = useMemo(() => dayjs.unix(props.value ?? 0), [props.value]);
  const duration = useMemo(() => {
    const diff = (props.value ?? 0) - dayjs().unix();
    if (diff < 0) return '';
    if (diff < 60 * 60) return 'in one hour';
    const hours = Number((diff / 60 / 60).toFixed(1));
    if (hours < 24) return `${hours} hours`;
    return `${Number((hours / 24).toFixed(1))} days`;
  }, [props.value]);

  return <Space>
    <Radio.Group
      value={isTime}
      onChange={(event) => props.onChange?.(event.target.value ? dayjs().add(1, 'years').unix() : 0)}>
      <Radio value={true}>Time{duration ? ` [${duration}]` : ''}</Radio>
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
