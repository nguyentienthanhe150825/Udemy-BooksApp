import React, { useState } from "react";
import { Form, Divider, Modal, message, Input, notification } from "antd";
import { callCreateUser } from "../../../services/api";

const UserModalCreate = (props) => {
    const { openModalCreate, setOpenModalCreate } = props;
    const [isSubmit, setIsSubmit] = useState(false);

    //Vì nút submit nằm ở Modal chứ ko nằm trong Form
    //Nên để bắt sự kiện khi submitForm thì sử dụng hook - [useForm()]

    //https://ant.design/components/form#formuseform
    const [formHook] = Form.useForm();

    const onFinish = async (values) => {
        //Lấy ra giá trị mà điền ở trong Form
        const { fullName, email, password, phone } = values;
        //Gọi tới API Tạo mới user
        setIsSubmit(true);
        const res = await callCreateUser(fullName, email, password, phone);
        console.log('>>> check data create user: ', res);
        if (res && res.data) {
            message.success("Tạo mới user thành công");

            //Sau khi thêm mới user thì khi bấm lại nút thêm mới
            //=> xóa data cũ
            formHook.resetFields();
            setOpenModalCreate(false);

            await props.fetchUser();
        } else {
            notification.error({
                message: 'Đã Có lỗi xảy ra',
                description: res.message,
                // duration: 2
            })
        }

        setIsSubmit(false);
    };

    return (
        <>
            <Modal title="Thêm mới người dùng"
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
                    onFinish={onFinish}
                    autoComplete="off"
                >
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
                        <Input />
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Mật Khẩu"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập mật khẩu',
                            },
                        ]}
                    >
                        <Input.Password />
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

export default UserModalCreate;