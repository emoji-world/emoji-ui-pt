import { Layout } from 'antd';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const { Header, Content } = Layout;

export default ((props: any) => {
  const Component = props.Component;
  const pageProps = props.pageProps;
  return <Layout className="App">
    <Header className="Header">
      <h1>OWC</h1>
      <ConnectButton />
    </Header>
    <Content className="Content">
      <Component {...pageProps} />
    </Content>
  </Layout>;
});
