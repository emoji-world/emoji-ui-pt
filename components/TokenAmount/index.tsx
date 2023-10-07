import React, { useMemo, useState } from 'react';
import style from './index.module.scss';
import { InputNumber, Slider } from 'antd';
import Decimal from 'decimal.js';

export
interface IProps {
  value?: number;
  onChange?: (value: number | null) => void;
  balance: number;
  precision?: number;
}

export default
function TokenAmount(props: IProps) {
  return <div className={style.com}>
    <div className={style.input}>
      <InputNumber
        value={props.value}
        onChange={props.onChange}
      />
    </div>
    <div className={style.info}>
      <span></span>
      <span>Balance {}</span>
    </div>
    <div className={style.slider}>
      <Slider
        value={(props.value ?? 0) / props.balance}
        min={0}
        max={1}
        step={0.01}
        marks={{
          0: <span>0</span>,
          0.25: <span>25</span>,
          0.5: <span>50</span>,
          0.75: <span>75</span>,
          1: <span>100</span>,
        }}
        tooltip={{
          placement: 'bottom',
          formatter: (value: any) => `${props.balance * value} ETH`,
        }}
        onChange={(value) => props.onChange?.(props.balance * value)}
      />
    </div>
  </div>;
}
