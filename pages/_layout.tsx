import { Button, Layout, Menu, Space } from 'antd';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import style from '../styles/layout.module.scss';

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
  return <Layout className="App">
    <Header className="Header">
      <Space>
        <h1
          className={style.logo}
          style={{ marginRight: '1.2rem' }}>
          Em<span className={style.haha}>😄</span>ji
        </h1>
        <NavMenu />
      </Space>
      <Button type="primary">你好</Button>
      <ConnectButton />
    </Header>
    <Content className="Content">
      <Component {...pageProps} />
    </Content>
  </Layout>;
});
