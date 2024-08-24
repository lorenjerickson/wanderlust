import React, { useState } from 'react';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';
import { useUserSession } from '@wanderlust/ui';
import { useNavigate } from 'react-router-dom';
import classes from './Login.module.scss';

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

export const LoginPage = () => {
  const { startUserSession } = useUserSession();
  const [error, setError] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    setError(undefined);
    startUserSession(values)
      .then((response) => {
        navigate('/welcome');
      })
      .catch((error) => {
        console.error('Login failed', error);
        setError('Login failed');
      });
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className={classes.page}>
      <div className={classes.title}>Wanderlust</div>
      <div className={classes.subtitle}>Let the adventure begin.</div>
      <div className={classes.form}>
        <div className={classes.login}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 800 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item<FieldType>
              name="remember"
              valuePropName="checked"
              wrapperCol={{ offset: 8, span: 16 }}
            >
              <Checkbox>
                I agree to abide by the <a href="#">terms of use</a>.
              </Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button className={classes.button} htmlType="submit" size="large">
                Login
              </Button>
              {error && <div className={classes.error}>{error}</div>}
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};
