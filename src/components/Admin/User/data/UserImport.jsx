import React, { useState } from "react";
import { Modal, Table, notification } from "antd";
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import * as XLSX from 'xlsx';
import { callBulkCreateUser } from "../../../../services/api";

//Để React Vite đọc được file download thì cần import
//Phần 4 - video 44
import templateFile from './template.xlsx?url';

const { Dragger } = Upload;

const UserImport = (props) => {
    const { setOpenModalImport, openModalImport } = props;
    const [dataExecl, setDataExecl] = useState([]);

    //https://stackoverflow.com/questions/51514757/action-function-is-required-with-antd-upload-control-but-i-dont-need-it
    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 1000);
    };


    const propsUpload = {
        name: 'file',
        multiple: false,   //Chỉ upload 1 file
        maxCount: 1,       //Giới hạn phần tử muốn upload
        //Định dạng file muốn upload => xem trên link bên dưới
        accept: ".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        //https://stackoverflow.com/questions/11832930/html-input-file-accept-attribute-file-type-csv

        customRequest: dummyRequest,

        onChange(info) {
            console.log('>>>check info <UserImport>: ', info);

            const { status } = info.file;

            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }

            //convert file execl => json format
            //https://stackoverflow.com/questions/66171804/importing-xlsx-and-parsing-to-json
            if (status === 'done') {
                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj;  //console.log(info)
                    const reader = new FileReader();
                    reader.readAsArrayBuffer(file);

                    reader.onload = function (e) {
                        let data = new Uint8Array(reader.result);

                        let workbook = XLSX.read(data, { type: 'array' });
                        console.log('>>>check workbook <UserImport>: ', workbook);

                        let sheet = workbook.Sheets[workbook.SheetNames[0]];
                        console.log('>>>check sheet <UserImport>: ', sheet);

                        // convert to json format
                        const json = XLSX.utils.sheet_to_json(sheet, {
                            header: ["fullName", "email", "phone"],
                            range: 1  //skip header row
                        });
                        console.log('>>>check json <UserImport>: ', json);

                        if (json && json.length > 0) {
                            setDataExecl(json);
                        }
                    };

                }
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    }

    const handleSubmit = async () => {
        const data = dataExecl.map(item => {
            item.password = '1234567'
            return item;
        })

        console.log('>>>Check data <UserImport>: ', data);

        const res = await callBulkCreateUser(data);
        console.log('>>>Check res <UserImport>: ', res);
        if (res.data) {
            notification.success({
                description: `Success: ${res.data.countSuccess}, Error: ${res.data.countError}`,
                message: "Upload thành công",
            })
            setDataExecl([]);
            setOpenModalImport(false)
            props.fetchUser();
        } else {
            notification.error({
                description: res.message,
                message: "Đã có lỗi xảy ra",
            })
        }
    }

    return (
        <>
            <Modal title="Import Data User"
                width={"50vw"}
                open={openModalImport}
                onOk={() => handleSubmit()}
                onCancel={() => {
                    setOpenModalImport(false);
                    setDataExecl([]);
                }}
                okText="Import data"
                okButtonProps={{
                    //Nếu ko có dữ liệu thì length = 0
                    //=> button sẽ disable
                    disabled: dataExecl.length < 1
                }}
                //do not close Popup when user click outside
                maskClosable={false}
            >
                <Dragger
                    {...propsUpload}
                    //Chỉ show ra file Upload khi có dữ liệu
                    showUploadList={dataExecl.length > 0}
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single upload. Only accept .csv, .xls, .xlsx . or
                        &nbsp; <a onClick={e => e.stopPropagation()} href={templateFile} download>Download Sample File</a>
                    </p>
                </Dragger>
                <div style={{ paddingTop: 30 }}>
                    <Table
                        dataSource={dataExecl}
                        title={() => <span>Dữ liệu Upload:</span>}
                        columns={[
                            { dataIndex: 'fullName', title: 'Tên hiển thị' },
                            { dataIndex: 'email', title: 'Email' },
                            { dataIndex: 'phone', title: 'Số điện thoại' },
                        ]}
                    />
                </div>



            </Modal>
        </>
    )
}

export default UserImport;