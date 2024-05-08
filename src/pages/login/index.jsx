import React from 'react';
import { Button, Divider, Form, Input, message, notification } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { callLogin } from '../../services/api';
import { useDispatch } from 'react-redux';
import { doLoginAction } from '../../redux/account/accountSlice';
import './login.scss';

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
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);

    const dispatch = useDispatch();

    const onFinish = async (values) => {
        const { username, password } = values;
        setIsSubmit(true);
        const res = await callLogin(username, password);
        setIsSubmit(false);
        // if(res?.data) {
        if (res && res.data) {
            console.log('>>> check data LoginJSX: ', res);

            localStorage.setItem('access_token', res.data.access_token)

            //Khi login thành công => nạp data vào trong Redux thông qua dispatch
            dispatch(doLoginAction(res.data.user))

            message.success('Đăng nhập tài khoản thành công!');
            navigate('/')
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                // description: 'Tài Khoản hoặc mật khẩu chưa đúng',
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : 'ok',
                duration: 2
            })
        }
    };


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
                    labelCol={{ span: 24 }}
                    label="Email"
                    name="username"
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
                    labelCol={{ span: 24 }}
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
                    <Button type="primary" htmlType="submit" loading={isSubmit}>
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