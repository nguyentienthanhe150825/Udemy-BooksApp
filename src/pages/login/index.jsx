import React from 'react';
import { Button, Divider, Form, Input, notification } from 'antd';
import { Link } from 'react-router-dom';

const onFinish = (values) => {
    console.log('Success:', values);
};

const loginLayout = {
    marginTop: '100px',
    margin: 'auto',
    width: '60%',
}

const styleForm = {
    // maxWidth: 600, 
    paddingTop: '30px',
    margin: 'auto',
    width: '60%',
    // border: '2px solid blue',
}

const LoginPage = () => {
    return (
        <div className='login-page' style={loginLayout}>
            <h1 style={{ textAlign: 'center' }}>Đăng Nhập</h1>
            <Divider />
            <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                style={styleForm}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                autoComplete="off"
            >

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your email!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                </Form.Item>
                <Divider>Or</Divider>
                <p className='text text-normal'>Chưa có tài khoản ?
                    <span>
                        <Link to='/register'> Đăng Ký </Link>
                    </span>
                </p>
            </Form>
        </div>
    )
}

export default LoginPage;