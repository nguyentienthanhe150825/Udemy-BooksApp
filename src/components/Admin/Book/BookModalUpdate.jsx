import React, { useEffect, useState } from "react";
import { Form, Select, Row, Divider, Modal, message, Input, notification, Col, InputNumber, Upload } from "antd";
import { callFetchCategory } from "../../../services/api";


const BookModalUpdate = (props) => {

    const { openModalUpdate, setOpenModalUpdate } = props;
    const { dataUpdate, setDataUpdate } = props;
    const [isSubmit, setIsSubmit] = useState(false);

    const [listCategory, setListCategory] = useState([]);

    //https://ant.design/components/form#formuseform
    const [formHook] = Form.useForm();

    const onFinish = async (values) => {
        setIsSubmit(true);


        setIsSubmit(false);
    };

    const fetchCategory = async () => {
        const res = await callFetchCategory();
        console.log('>>> check res fetchCategory <BookModalUpdate>: ', res);
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
        formHook.setFieldsValue(dataUpdate);
        fetchCategory();
    }, [dataUpdate])

    return (
        <>
            <Modal title="Cập Nhật Book"
                open={openModalUpdate}
                onOk={() => { formHook.submit() }}
                onCancel={() => {
                    setOpenModalUpdate(false);
                    setDataUpdate(null);
                }}
                okText={"Cập Nhật"}
                cancelText={"Hủy"}
                confirmLoading={isSubmit}
                width={700}
            >
                <Divider />
                <Form
                    //Gán Hook- [useForm()] sau này có thể truy cập Form từ nơi khác để nhận submit
                    form={formHook}
                    name="basic"
                    style={{ width: '100%' }}
                    onFinish={onFinish}
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
                                    showSearch
                                    allowClear
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
                                initialValue={0}
                            >
                                <InputNumber min={0} defaultValue={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Ảnh Thumbnail"
                                name="thumbnail"
                            >
                                <Upload
                                    name="thumbnail"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    //Cho upload chỉ 1 ảnh
                                    maxCount={1}
                                    multiple={false}
                                // customRequest={handleUploadFileThumbnail}
                                // beforeUpload={beforeUpload}
                                // onChange={handleChange}
                                // onRemove={(file) => handleRemoveFile(file, "thumbnail")}
                                // onPreview={handlePreview}
                                >
                                    {/* <div>
                                        {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div> */}
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Ảnh Slider"
                                name="slider"
                            >
                                <Upload
                                    //Cho upload nhiều ảnh
                                    multiple
                                    name="slider"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                // customRequest={handleUploadFileSlider}
                                // beforeUpload={beforeUpload}
                                // onChange={(infor) => handleChange(infor, 'slider')}
                                // onRemove={(file) => handleRemoveFile(file, "slider")}
                                // onPreview={handlePreview}
                                >
                                    {/* <div>
                                        {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div> */}
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>



                </Form>
            </Modal>
        </>
    )
}

export default BookModalUpdate;