import React from 'react';
import { Icon, Input, Button } from 'antd';
import './Login.less';

export default function Login() {
  return (
    <div className="ns-login">
      <div className="login-form">
        <Input
          prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
          placeholder="用户名	"
        />
        <Input
          prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
          type="password"
          placeholder="密码"
        />
        <Button
          type="primary"
          onClick={() => this.props.history.push('/')}
          className="login-form-button"
        >
          登 录
        </Button>
      </div>
    </div>
  );
}
