import React, { ReactNode, useCallback, useMemo } from 'react';
import style from './index.module.scss';
import { Button, InputNumber, Slider, Tooltip } from 'antd';
import { formatUnits, parseUnits } from 'viem';
import { SyncOutlined } from '@ant-design/icons';

function truncatePrecision(num: number | string, precision: number) {
  const numSegs = num.toString().split('.');
  numSegs[1] = numSegs[1]?.slice(0, precision);
  return numSegs.filter((seg) => seg).join('.');
}

export
interface IProps {
  symbol: string;
  balance: bigint;
  precision: number;
  precisionShow: number;
  children?: ReactNode,
  value?: bigint;
  onChange?: (value: bigint) => void;
  balanceLoading?: boolean;
  onUpdateBalance?: () => void;
}

export default
function TokenAmount(props: IProps) {
  const valueFormat = useMemo(
    () => formatUnits(props.value ?? 0n, props.precision),
    [props.value, props.precision],
  );
  const value = useMemo(() => Number(valueFormat), [valueFormat]);
  const valueShow = useCallback(
    (value: any) => truncatePrecision(value ?? 0, props.precisionShow),
    [props.precisionShow],
  );

  const balanceFormat = useMemo(
    () => formatUnits(props.balance ?? 0n, props.precision),
    [props.balance, props.precision],
  );
  const balance = useMemo(() => Number(balanceFormat), [balanceFormat]);
  const balanceShow = useMemo(
    () => truncatePrecision(balanceFormat, props.precisionShow),
    [balanceFormat, props.precisionShow],
  );

  const percent = useMemo(() => Math.round(balance && (value / balance * 100)), [value, balance]);

  const isAll = useMemo(() => props.value === props.balance, [props.value, props.balance]);

  return <div className={style.com}>
    <div className={style.input}>
      <InputNumber
        value={value}
        formatter={valueShow}
        onChange={(value) => props.onChange?.(parseUnits(valueShow(value), props.precision))}
        min={0}
        max={balance}
        placeholder="0.0"
      />
      {props.children ?? <Button
        size="large"
        onClick={() => props.onChange?.(isAll ? props.balance * 50n / 100n : props.balance)}>
        {isAll ? 'HALF' : 'ALL'} {props.symbol}
      </Button>}
    </div>
    <div className={style.info}>
      <span></span>
      <span>
        Balance {balanceShow}&nbsp;
        <Tooltip
          placement="bottom"
          title="Refresh balance">
          <SyncOutlined
            className={style.refresh}
            spin={props.balanceLoading}
            onClick={() => props.onUpdateBalance?.()}
          />
        </Tooltip>
      </span>
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
