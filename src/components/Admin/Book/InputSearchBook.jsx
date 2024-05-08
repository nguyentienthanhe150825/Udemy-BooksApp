import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, theme } from 'antd';

const InputSearchBook = (props) => {
    const { token } = theme.useToken();
    const [form] = Form.useForm();

    const formStyle = {
        maxWidth: 'none',
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        padding: 10,
    };

    const onFinish = (values) => {
        console.log('Received values of form<Input Search Book>: ', values);

        let query = "";

        if (values.mainText) {
            query += `&mainText=/${values.mainText}/i`;
        }

        if (values.author) {
            query += `&author=/${values.author}/i`;
        }

        if (values.category) {
            query += `&category=/${values.category}/i`;
        }

        if (query) {
            props.setFilter(query);
        }
    }

    return (
        <Form
            form={form}
            name="advanced_search"
            style={formStyle}
            onFinish={onFinish}
        >
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        name={`mainText`}
                        label={`Tên Sách`}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        name={`author`}
                        label={`Tác Giả`}
                    >
                        <Input />
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        name={`category`}
                        label={`Thể Loại`}
                    >
                        <Input />
                    </Form.Item>
                </Col>

            </Row>
            <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                    <Button type="primary" htmlType="submit">
                        Search
                    </Button>
                    <Button
                        style={{ margin: '0 8px' }}
                        onClick={() => {
                            form.resetFields();
                            props.setFilter("");
                        }}
                    >
                        Clear
                    </Button>
                </Col>
            </Row>
        </Form>
    )
}

export default InputSearchBook;