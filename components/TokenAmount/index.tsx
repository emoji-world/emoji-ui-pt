import React, { useMemo, useState } from 'react';
import style from './index.module.scss';
import { Button, InputNumber, Slider, Space } from 'antd';
import { formatUnits, parseUnits } from 'viem';

function truncatePrecision(num: number | string, precision: number) {
  const numSegs = num.toString().split('.');
  numSegs[1] = numSegs[1]?.slice(0, precision) ?? '';
  return numSegs.filter((seg) => seg).join('.');
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

  const percent = useMemo(() => Math.round(balance && (value / balance * 100)), [value, balance]);

  return <div className={style.com}>
    <div className={style.input}>
      <InputNumber
        value={value}
        formatter={(value) => {
          console.log(value);
          return truncatePrecision(value ?? 0, props.precisionShow);
        }}
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
    <div>
      <Space>
        <span>{balanceFormat}</span>
        <span>{balance}</span>
        <span>{parseUnits(balanceFormat, 18).toString()}</span>
      </Space>
      {/* <Space>
        <span>{value}</span>
        <span>{balance}</span>
        <span>{percent}</span>
      </Space> */}
    </div>
    <div className={style.slider}>
      <Slider
        value={percent}
        onChange={(value) => {
          console.log(value);
          console.log(props.balance);
          console.log(props.balance * BigInt(value) / 100n);
          props.onChange?.(props.balance * BigInt(value) / 100n);
        }}
        min={0}
        max={100}
        step={1}
        marks={Object.fromEntries([0, 25, 50, 75, 100].map((num) => [num, num]))}
        tooltip={{ placement: 'top', formatter: (value) => `${value}%` }}
      />
    </div>
  </div>;
}
