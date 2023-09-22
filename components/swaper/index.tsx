import { Card, Col, Input, Row } from 'antd';
import React from 'react';
import style from './index.module.scss';
import EButton from '../embutton';

export
function Swaper() {
  return <div className={style.com}>
    <Row>
      0
    </Row>
    <Row className={style.source}>
      <Col span={24}>
        <Card>
          <Input />
        </Card>
      </Col>
    </Row>
    <Row>
      <EButton />
    </Row>
    <Row className={style.target}>
      <Col span={24}>
        <Card>
          1
        </Card>
      </Col>
    </Row>
  </div>;
}
