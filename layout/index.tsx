import { Button, Layout, Menu, Space } from 'antd';
import style from './index.module.scss';
import Connector from '../components/connector';

const { Header, Content } = Layout;

export
function NavMenu() {
  return <nav className={style.navmenu}>
    <ol>
      <li>
        <span>Game</span>
      </li>
      <li>
        <span>Swap</span>
      </li>
      <li>
        <span>Finance</span>
      </li>
    </ol>
  </nav>
}

export default ((props: any) => {
  const Component = props.Component;
  const pageProps = props.pageProps;
  return <Layout className={style.app}>
    <Header className={style.header}>
      <Space>
        <h1
          className={style.logo}
          style={{ marginRight: '1.2rem' }}>
          Em<span className={style.haha}>😄</span>ji
        </h1>
        <NavMenu />
      </Space>
      <Button type="primary">你好</Button>
      <Connector />
    </Header>
    <Content className={style.content}>
      <Component {...pageProps} />
    </Content>
  </Layout>;
});
