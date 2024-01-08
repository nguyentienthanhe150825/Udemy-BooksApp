import React from 'react';
import { Button, Divider, Form, Input } from 'antd';

const onFinish = (values) => {
    console.log('Success:', values);
};

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
    return (
        <div className='register-page' style={registerLayout}>
            <h3 style={{ textAlign: 'center' }}>Đăng ký người dùng mới</h3>
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
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Register;