import React, { useState } from 'react';
import { Badge, Descriptions } from 'antd';
import { Drawer } from "antd";
import moment from 'moment/moment';

const UserViewDetail = (props) => {

    const openViewDetail = props.openViewDetail;
    const setOpenViewDetail = props.setOpenViewDetail;
    const dataViewDetail = props.dataViewDetail;

    const onClose = () => {
        setOpenViewDetail(false);
    };

    return (
        <>
            <Drawer title="Chức Năng Xem Chi Tiết"
                width={"50vw"}
                onClose={onClose}
                open={openViewDetail}
            >
                <Descriptions
                    title="Thông tin user"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="Id">{dataViewDetail._id}</Descriptions.Item>
                    <Descriptions.Item label="Tên Hiển Thị">{dataViewDetail.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Email">{dataViewDetail.email}</Descriptions.Item>
                    <Descriptions.Item label="Số Điện Thoại">{dataViewDetail.phone}</Descriptions.Item>
                    <Descriptions.Item label="Role" span={2}>
                        <Badge status="processing" text={dataViewDetail.role} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {moment(dataViewDetail.createdAt).format("DD-MM-YYYY HH:mm:ss")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {moment(dataViewDetail.updatedAt).format("DD-MM-YYYY HH:mm:ss")}
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    )
}

export default UserViewDetail;