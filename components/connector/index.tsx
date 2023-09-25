import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button, Space } from 'antd';
import style from './index.module.scss';
import { DownOutlined } from '@ant-design/icons';

export default () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return <div
          className={[style.com, !ready ? style.hidden : ''].join(' ')}
          aria-hidden={!ready}>
          {(() => {
            if (!connected)
              return <Button onClick={openConnectModal} type="primary">Connect Wallet</Button>;
            if (chain.unsupported)
              return <Button onClick={openChainModal} type="primary" danger>Unsupported Network</Button>;
            return <Space>
              <Button
                type="default"
                className={style.chain_button}
                onClick={openChainModal}>
                {chain.hasIcon && chain.iconUrl && <img
                  className={style.chain_logo}
                  alt={chain.name ?? 'chain icon'}
                  src={chain.iconUrl}
                />}
                {chain.name}
              </Button>
              <Button
                type="primary"
                className={style.account_button}
                onClick={openAccountModal}>
                <span>{account.displayName}</span>
                <DownOutlined />
              </Button>
            </Space>;
          })()}
        </div>;
      }}
    </ConnectButton.Custom>
  );
};
