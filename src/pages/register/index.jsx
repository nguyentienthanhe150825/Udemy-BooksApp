import React from 'react';
import { Button, Divider, Form, Input, message, notification } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { callRegister } from '../../services/api';
import './register.scss';

const registerLayout = {
    marginTop: '100px',
    border: '2px solid blue',
    margin: 'auto',
    width: '60%',
};

const styleForm = {
    // maxWidth: 600, 
    paddingTop: '30px',
    margin: 'auto',
    width: '60%',
    // border: '2px solid blue',
}


const Register = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);

    const onFinish = async (values) => {
        //Lấy ra giá trị mà điền ở trong Form
        const { fullName, email, password, phone } = values;
        //Gọi tới API register
        setIsSubmit(true);
        const res = await callRegister(fullName, email, password, phone);
        setIsSubmit(false);
        console.log('>>> check data register: ', res);
        if (res && res.data && res.data._id) {
            // if (res?.data?._id) {
            message.success('Đăng ký tài khoản thành công!');
            navigate('/login')
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : 'ok',
                duration: 2
            })
        }

    };

    return (
        <div className='register-page' style={registerLayout}>
            <h1 style={{ textAlign: 'center' }}>Đăng Ký Tài Khoản</h1>
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
                    // labelCol={{ span: 24 }}
                    label="Full Name"
                    name="fullName"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your full name!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    // labelCol={{ span: 24 }}
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
                    // labelCol={{ span: 24 }}
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
                    // labelCol={{ span: 24 }}
                    label="Phone"
                    name="phone"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your phone!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit" loading={isSubmit}>
                        Register
                    </Button>
                </Form.Item>
                <Divider>Or</Divider>
                <p className='text text-normal'>Đã có tài khoản ?
                    <span>
                        <Link to='/login'> Đăng Nhập </Link>
                    </span>
                </p>
            </Form>
        </div>
    );
}

export default Register;