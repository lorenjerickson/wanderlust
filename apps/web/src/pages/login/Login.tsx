<<<<<<< HEAD
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
=======
import classes from './Login.module.scss';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, Group, PasswordInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';

type FormData = {
  username?: string;
  password?: string;
  remember?: boolean;
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    mode: 'controlled',
    initialValues: {
      username: '',
      password: '',
      remember: false,
    },
    validate: {
      username: (value) => (/^\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (/^\S+$/.test(value) ? null : 'Invalid password'),
    },
  });

  const handleSubmit = async (values: FormData) => {
    setError(null);
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('accessToken', data.accessToken);
      navigate('/welcome');
    } else {
      setError('Login failed.');
    }
>>>>>>> cb21b1c (feat: auth with jwt)
  };

  return (
    <div className={classes.page}>
      <div className={classes.title}>Wanderlust</div>
      <div className={classes.subtitle}>Let the adventure begin.</div>
      <div className={classes.form}>
        <div className={classes.login}>
<<<<<<< HEAD
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
=======
          <form
            onSubmit={form.onSubmit(handleSubmit)}
            name="login"
            style={{ maxWidth: 800 }}
            autoComplete="off"
          >
            <TextInput
              withAsterisk
              variant="filled"
              label="Username"
              placeholder="Username"
              key={'username'}
              {...form.getInputProps('username')}
            />
            <PasswordInput
              withAsterisk
              variant="filled"
              label="Password"
              placeholder="Password"
              key={'password'}
              {...form.getInputProps('password')}
            />
            <Checkbox
              mt="md"
              label="Remember my username"
              key={'termsOfService'}
              {...form.getInputProps('remember', { type: 'checkbox' })}
            />
            <Group justify="flex-end" mt="md">
              <Button type="submit">Submit</Button>
            </Group>
          </form>
          {error && <div className={classes.error}>{error}</div>}
>>>>>>> cb21b1c (feat: auth with jwt)
        </div>
      </div>
    </div>
  );
};
