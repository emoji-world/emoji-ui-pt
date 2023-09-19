import { Layout } from 'antd';

const { Header, Content } = Layout;

export default ((props: any) => {
  const Component = props.Component;
  const pageProps = props.pageProps;
  return <Layout className="App">
    <Header className="Header">
      <h1>OWC</h1>
    </Header>
    <Content className="Content">
      <Component {...pageProps} />
    </Content>
  </Layout>;
});
