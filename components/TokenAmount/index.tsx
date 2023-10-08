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
        value={value}
        onChange={(value) => props.onChange?.(parseUnits((value ?? 0).toString(), props.precision ?? 0))}
        min={0}
        max={balance}
        placeholder="0.0"
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
        marks={Object.fromEntries([0, 25, 50, 75, 100].map((num) => [num, num]))}
        tooltip={{ placement: 'top', formatter: (value) => `${value}%` }}
      />
    </div>
  </div>;
}
