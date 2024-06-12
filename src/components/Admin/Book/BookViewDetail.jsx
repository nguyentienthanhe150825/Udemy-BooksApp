import React, { useEffect, useState } from 'react';
import { Drawer, Descriptions, Badge, Divider, Upload, Modal } from 'antd';
import moment from 'moment/moment';
import { v4 as uuidv4 } from 'uuid';

const BookViewDetail = (props) => {
    const { openViewDetail, setOpenViewDetail } = props;
    const dataViewDetail = props.dataViewDetail;

    const onClose = () => {
        setOpenViewDetail(false);
    };

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [fileList, setFileList] = useState([]);
    //status có 3 trạng thái: done, uploading, error

    //Part 5 - video 42
    useEffect(() => {
        console.log('>>> check data view detail <BookViewDetail>: ', dataViewDetail);
        if (dataViewDetail) {
            let imgThumbnail = {};
            let imgSlider = [];
            if (dataViewDetail.thumbnail) {
                imgThumbnail = {
                    uid: uuidv4(),   //Dùng thư viện để tạo ra ID độc Nhất theo form của Upload<Antd>
                    name: dataViewDetail.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataViewDetail.thumbnail}`,
                }
            }

            if (dataViewDetail.slider && dataViewDetail.slider.length > 0) {
                dataViewDetail.slider.map(item => {
                    imgSlider.push({
                        uid: uuidv4(),   //Dùng thư viện để tạo ra ID độc Nhất theo form của Upload<Antd>
                        name: item,
                        status: 'done',
                        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                    })
                })
            }
            //Lấy imgThumbnail để lên đẩu tiên sau đó coppy lại mảng imgSlider
            setFileList([imgThumbnail, ...imgSlider])
        }
    }, [dataViewDetail])

    const handleCancel = () => {
        setPreviewOpen(false)
    };

    const handlePreview = async (file) => {
        setPreviewImage(file.url || (file.preview));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }

    return (
        <>
            <Drawer
                title="Chức Năng Xem Chi Tiết"
                width={"50%"}
                onClose={onClose}
                open={openViewDetail}
            >
                <Descriptions
                    title="Thông Tin Book"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="Id">{dataViewDetail._id}</Descriptions.Item>
                    <Descriptions.Item label="Tên Sách">{dataViewDetail.mainText}</Descriptions.Item>
                    <Descriptions.Item label="Tác Giả">{dataViewDetail.author}</Descriptions.Item>
                    <Descriptions.Item label="Giá Tiền">
                        {new Intl.NumberFormat('vi-VN', {style: 'currency', currency : 'VND'}).format(dataViewDetail.price)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Số Lượng">{dataViewDetail.quantity}</Descriptions.Item>
                    <Descriptions.Item label="Đã Bán">{dataViewDetail.sold}</Descriptions.Item>
                    <Descriptions.Item label="Thể Loại" span={2}>
                        <Badge status="processing" text={dataViewDetail.category} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {moment(dataViewDetail.createdAt).format("DD-MM-YYYY HH:mm:ss")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {moment(dataViewDetail.updatedAt).format("DD-MM-YYYY HH:mm:ss")}
                    </Descriptions.Item>
                </Descriptions>
                <Divider orientation="left">Ảnh Books</Divider>

                <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    showUploadList={
                        { showRemoveIcon: false }
                    }
                >
                </Upload>

                <Modal
                    open={previewOpen}
                    title={previewTitle}
                    footer={null}
                    onCancel={handleCancel}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </Drawer>
        </>
    );
}

export default BookViewDetail;