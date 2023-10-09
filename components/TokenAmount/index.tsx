import React, { useMemo, useState } from 'react';
import style from './index.module.scss';
import { Button, InputNumber, Slider } from 'antd';
import { formatUnits, parseUnits } from 'viem';

function truncatePrecision(num: number | string, precision: number) {
  const numSegs = num.toString().split('.');
  numSegs[1] = numSegs[1]?.slice(0, precision) ?? '';
  return numSegs.join('.');
}

export
interface IProps {
  symbol: string;
  balance: bigint;
  precision: number;
  precisionShow: number;
  value?: bigint;
  onChange?: (value: bigint) => void;
}

export default
function TokenAmount(props: IProps) {
  const valueShow = useMemo(
    () => formatUnits(props.value ?? 0n, props.precision),
    [props.value, props.precision],
  );

  const value = useMemo(() => Number(valueShow), [valueShow]);

  const balanceFormat = useMemo(
    () => formatUnits(props.balance ?? 0n, props.precision),
    [props.balance, props.precision],
  );
  const balance = useMemo(() => Number(balanceFormat), [balanceFormat]);
  const balanceShow = useMemo(() => truncatePrecision(balanceFormat, props.precisionShow), [balanceFormat, props.precisionShow]);

  const percent = useMemo(() => balance && (value / balance * 100), [value, balance]);

  return <div className={style.com}>
    <div className={style.input}>
      <InputNumber
        value={value}
        onChange={(value) => props.onChange?.(parseUnits((value ?? 0).toString(), props.precision))}
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
