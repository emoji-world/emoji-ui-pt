import React, { useMemo, useState } from 'react';
import style from './index.module.scss';
import { Button, InputNumber, Slider } from 'antd';
import { formatUnits, parseUnits } from 'viem';

export
interface IProps {
  value?: bigint;
  onChange?: (value: bigint) => void;
  balance: bigint;
  precision?: number;
  symbol: string;
}

export default
function TokenAmount(props: IProps) {

  const valueShow = useMemo(
    () => formatUnits(props.value ?? 0n, props.precision ?? 0),
    [props.value, props.precision],
  );

  const value = useMemo(() => Number(valueShow), [valueShow]);

  const balanceShow = useMemo(
    () => formatUnits(props.balance ?? 0n, props.precision ?? 0),
    [props.balance, props.precision],
  );

  const balance = useMemo(() => Number(balanceShow), [balanceShow]);

  const percent = useMemo(() => value / balance * 100, [value, balance]);

  return <div className={style.com}>
    <div className={style.input}>
      <InputNumber
        min={0}
        max={balance}
        value={value}
        placeholder="0.0"
        onChange={(value) => props.onChange?.(parseUnits((value ?? 0).toString(), props.precision ?? 0))}
      />
      <Button size="large">{props.symbol}</Button>
    </div>
    <div className={style.info}>
      <span></span>
      <span>Balance {balanceShow}</span>
    </div>
    <div className={style.slider}>
      <Slider
        value={percent}
        onChange={(value) => props.onChange?.(props.balance * BigInt(value) / 100n)}
        min={0}
        max={100}
        step={1}
        marks={{
          0: <span>0</span>,
          25: <span>25</span>,
          50: <span>50</span>,
          75: <span>75</span>,
          100: <span>100</span>,
        }}
        tooltip={{
          placement: 'bottom',
          formatter: (value) => <span>{`${value}%`}</span>,
        }}
      />
    </div>
  </div>;
}
