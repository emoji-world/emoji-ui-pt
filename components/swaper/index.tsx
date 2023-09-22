import { Button, Card, Col, Input, InputNumber, Row, Slider } from 'antd';
import React from 'react';
import style from './index.module.scss';
import EButton from '../embutton';

export
function Swaper() {
  return <div className={style.com}>
    <div></div>
    <div className={style.card}>
      <div className={style.input_area}>
        <input type="number" className={style.amount_input} placeholder="0.0" />
        <Button size="large" type="primary">ETH</Button>
      </div>
      <div className={style.suppl_info}>
        <span></span>
        <span className={style.balance}>Balance {0.03}</span>
      </div>
      <div className={style.percent_btns}>
        <Button type="primary" ghost>25%</Button>
        <Button type="primary" ghost>50%</Button>
        <Button type="primary" ghost>75%</Button>
        <Button type="primary" ghost>100%</Button>
      </div>
      <div className={style.percent_slider}>
        <Slider defaultValue={30} tooltip={{ placement: 'bottom' }} />
      </div>
    </div>
    <div className={style.card}>
      <div className={style.input_area}>
        <input type="number" className={style.amount_input} placeholder="0.0" />
        <Button size="large" type="primary">USDC</Button>
      </div>
      <div className={style.suppl_info}>
        <span></span>
        <span className={style.balance}>Balance {0.03}</span>
      </div>
    </div>
    <div className={style.card}>3</div>
  </div>;
}
