import React, { useState, useEffect } from "react";
import { Form, Select, Row, Divider, Modal, message, Input, notification, Col, InputNumber, Upload } from "antd";
import { callCreateBook, callFetchCategory, callUploadBookImg } from "../../../services/api";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

const BookModalCreate = (props) => {
    const { openModalCreate, setOpenModalCreate } = props;
    const [isSubmit, setIsSubmit] = useState(false);

    const [listCategory, setListCategory] = useState([]);
    //https://ant.design/components/form#formuseform
    const [formHook] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [loadingSlider, setLoadingSlider] = useState(false);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [imageUrl, setImageUrl] = useState("");
    const [dataThumbnail, setDataThumbnail] = useState([]);
    const [dataSlider, setDataSlider] = useState([]);

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

    const onFinish = async (values) => {
        console.log(">>> check values: ", values);
        console.log(">>> check data thumbnail: ", dataThumbnail);
        console.log(">>> check data slider: ", dataSlider);
        return;
        if (dataThumbnail.length === 0) {
            notification.error({
                message: 'Lỗi validate',
                description: 'Vui lòng upload ảnh thumbnail'
            })
            return;
        }
        if (dataSlider.length === 0) {
            notification.error({
                message: 'Lỗi validate',
                description: 'Vui lòng upload ảnh slider'
            })
            return;
        }

        //Lấy ra giá trị mà điền ở trong Form
        const { mainText, author, price, sold, quantity, category } = values;
        const thumbnail = dataThumbnail[0].name;
        const slider = dataSlider.map(item => item.name);

        setIsSubmit(true);
        const res = await callCreateBook(thumbnail, slider, mainText, author, price, sold, quantity, category);
        if (res && res.data) {
            message.success('Tạo mới book thành công')
            formHook.resetFields();
            setOpenModalCreate(false);

            await props.fetchBook();
        } else {
            notification.error({
                message: 'Đã Có lỗi xảy ra',
                description: res.message,
                // duration: 2
            })
        }
        setIsSubmit(false);
    }

    const onClose = () => {
        setOpenModalCreate(false)
    }

    const handleChange = (info, type) => {
        if (info.file.status === 'uploading') {
            type ? setLoadingSlider(true) : setLoading(true)
            return;
        }

        if (info.file.status === 'done') {
            type ? setLoadingSlider(false) : setLoading(false)
            setImageUrl(url)
        }
    }

    const beforeUpload = () => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
        //Sau khi call api để upload ảnh thì cần lưu ảnh vào state của React 
        //để sau rồi khi tạo mới 1 book sẽ lấy dc thông tin ảnh của sách từ state của React
        const res = await callUploadBookImg(file);
        console.log(">>> check res call upload Thumbnail <BookModalCreate>", res);
        if (res && res.data) {
            setDataThumbnail([{
                name: res.data.fileUploaded,
                uid: file.uid
            }])
            onSuccess('ok')
        } else {
            onError('Đã có lỗi khi upload file')
        }
    }

    const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
        //Sau khi call api để upload ảnh thì cần lưu ảnh vào state của React 
        //để sau rồi khi tạo mới 1 book sẽ lấy dc thông tin ảnh của sách từ state của React
        const res = await callUploadBookImg(file);
        if (res && res.data) {
            //Vì slider sẽ phải upload nhiều ảnh nên trong 1 lần upload nhiều ảnh thì
            //phải lưu lại state của ảnh trước đó nếu ko khi upload sẽ chỉ lên dc DUY NHẤT 1 ảnh mà thôi
            //coppy previous state => upload multiple mages
            setDataSlider((dataSlider) => [...dataSlider, {
                name: res.data.fileUploaded,
                uid: file.uid
            }])
            onSuccess('ok')
        } else {
            onError('Đã có lỗi khi upload file')
        }
    }

    const handleRemoveFile = (file, type) => {
        if (type === 'thumbnail') {
            setDataThumbnail([])
        }
        //filer 1 mảng: lấy những ảnh slider (còn lại) có uid khác với uid của slider mà user bấm xóa
        //filter: bỏ đi ảnh cần xóa
        if (type === 'slider') {
            // const newSlider = dataSlider.filter(sliderImage => sliderImage.uid !== file.uid);
            // setDataSlider(newSlider);
            setDataSlider([])
        }
    }

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    //coppy antd sẽ khác so với bên BookViewDetail
    const handlePreview = async (file) => {
        getBase64(file.originFileObj, (url) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        })
    };

    return (
        <>
            <Modal title="Thêm mới Sách"
                open={openModalCreate}
                onOk={() => { formHook.submit() }}
                onCancel={onClose}
                okText={"Tạo mới"}
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
                                    customRequest={handleUploadFileThumbnail}
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                    onRemove={(file) => handleRemoveFile(file, "thumbnail")}
                                    onPreview={handlePreview}
                                >
                                    <div>
                                        {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
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
                                    customRequest={handleUploadFileSlider}
                                    beforeUpload={beforeUpload}
                                    onChange={(infor) => handleChange(infor, 'slider')}
                                    onRemove={(file) => handleRemoveFile(file, "slider")}
                                    onPreview={handlePreview}
                                >
                                    <div>
                                        {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
            <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={() => setPreviewOpen(false)}
            >
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    )
}

export default BookModalCreate;