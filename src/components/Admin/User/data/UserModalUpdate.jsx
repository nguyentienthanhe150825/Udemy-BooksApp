import React, { useEffect, useState } from "react";
import { Form, Divider, Modal, message, Input, notification } from "antd";
import { callUpdateUser } from "../../../../services/api";


const UserModalUpdate = (props) => {
    const { openModalUpdate, setOpenModalUpdate } = props;
    const { dataUpdate, setDataUpdate } = props;
    const [isSubmit, setIsSubmit] = useState(false);

    //https://ant.design/components/form#formuseform
    const [formHook] = Form.useForm();

    const onFinish = async (values) => {
        //Lấy ra giá trị mà điền ở trong Form
        const { fullName, _id, phone } = values;
        setIsSubmit(true);
        const res = await callUpdateUser(fullName, _id, phone);
        console.log('>>> check data update user: ', res);
        if (res && res.data) {
            message.success("Cập Nhật user thành công");
            setOpenModalUpdate(false);
            await props.fetchUser();
        } else {
            notification.error({
                message: 'Đã Có lỗi xảy ra',
                description: res.message,
            })
        }

        setIsSubmit(false);
    };

    //[setFieldsValue] phải để SỐ NHIỀU: gán cho tất cả các trường data
    //KHÁC VỚI [setFieldValue]: chỉ gán cho 1 trường data cụ thể
    useEffect(() => {
        //gán data để hiển thị khi ấn "UPDATE"
        //LƯU Ý
        //dataUpdate: lấy props từ bên [UserTable] có các trường _id, fullName, email, phone
        //thì ở bên [UserModalUpdate] trong [Form] có
        // các trường name="_id", name="fullName", ...tên phải giống bên [UserTable]

        formHook.setFieldsValue(dataUpdate)
    }, [dataUpdate])

    return (
        <>
            <Modal title="Cập Nhật người dùng"
                open={openModalUpdate}
                onOk={() => { formHook.submit() }}
                onCancel={() => {
                    setOpenModalUpdate(false);
                    setDataUpdate(null);
                }}
                okText={"Cập Nhật"}
                cancelText={"Hủy"}
                confirmLoading={isSubmit}
            >
                <Divider />
                <Form
                    //Gán Hook- [useForm()] sau này có thể truy cập Form từ nơi khác để nhận submit
                    form={formHook}
                    name="basic"
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        hidden
                        labelCol={{ span: 24 }}
                        label="Id"
                        name="_id"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập id',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Tên Hiển Thị"
                        name="fullName"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tên hiển thị',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập email',
                            },
                        ]}
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Số Điện Thoại"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập số điện thoại',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default UserModalUpdate;