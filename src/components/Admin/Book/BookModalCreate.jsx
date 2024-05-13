import React, { useState, useEffect } from "react";
import { Form, Select, Row, Divider, Modal, message, Input, notification, Col, InputNumber } from "antd";
import { callFetchCategory } from "../../../services/api";

const BookModalCreate = (props) => {
    const { openModalCreate, setOpenModalCreate } = props;
    const [isSubmit, setIsSubmit] = useState(false);

    const [listCategory, setListCategory] = useState([]);
    //https://ant.design/components/form#formuseform
    const [formHook] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [loadingSlider, setLoadingSlider] = useState(false);

    const [imageUrl, setImageUrl] = useState("");

    const fetchCategory = async () => {
        const res = await callFetchCategory();
        console.log('>>> check res fetchCategory <BookModalCreate>: ', res);
        if (res && res.data) {
            const category = res.data.map(item => {
                return {
                    label: item,
                    value: item
                }
            })
            setListCategory(category);
        }
    }

    useEffect(() => {
        fetchCategory();
    }, [])

    return (
        <>
            <Modal title="Thêm mới Sách"
                open={openModalCreate}
                onOk={() => { formHook.submit() }}
                onCancel={() => setOpenModalCreate(false)}
                okText={"Tạo mới"}
                cancelText={"Hủy"}
                confirmLoading={isSubmit}
            >
                <Divider />

                <Form
                    //Gán Hook- [useForm()] sau này có thể truy cập Form từ nơi khác để nhận submit
                    form={formHook}
                    name="basic"
                    style={{ width: '100%' }}
                    // onFinish={onFinish}
                    autoComplete="off"
                >
                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Tên Sách"
                                name="mainText"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên sách',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Tác Giả"
                                name="author"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên tác giả',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={12}>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Giá Tiền"
                                name="price"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập giá tiền',
                                    },
                                ]}
                            >
                                <InputNumber
                                    min={0}
                                    style={{ width: '100%' }}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    addonAfter="VND"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Thể Loại"
                                name="category"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập thể loại',
                                    },
                                ]}
                            >
                                <Select
                                    defaultValue=""
                                    showSearch    //cho phép hiển thị nút tìm kiếm thay vì select category
                                    allowClear    //hình dấu x cho phép xóa
                                    // onChange={handleChange}
                                    options={listCategory}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Số Lượng"
                                name="quantity"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập số lượng',
                                    },
                                ]}
                            >
                                <InputNumber min={1} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Đã Bán"
                                name="sold"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập số lượng đã bán đã bán',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                </Form>
            </Modal>
        </>
    )
}

export default BookModalCreate;