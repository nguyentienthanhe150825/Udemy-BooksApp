import React, { useState, useEffect } from "react";
import { Table, Row, Col, Button } from "antd";
import InputSearch from "./InputSearch";
import { Drawer, Descriptions, Popconfirm, message, notification } from "antd";
import {
    CloudUploadOutlined,
    DeleteTwoTone,
    EditTwoTone,
    ExportOutlined,
    PlusOutlined,
    ReloadOutlined

} from '@ant-design/icons';
import { callDeleteUser, callFetchListUser } from "../../../services/api";
import UserModalCreate from "./UserModalCreate";
import UserViewDetail from "./UserViewDetail";
import UserImport from "./data/UserImport";
import * as XLSX from 'xlsx';
import UserModalUpdate from "./data/UserModalUpdate";

// https://stackblitz.com/run?file=demo.tsx

const UserTable = () => {

    const [listUser, setListUser] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);

    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("");

    const [openModalCreate, setOpenModalCreate] = useState(false);

    const [dataUpdate, setDataUpdate] = useState([]);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);

    const [dataViewDetail, setDataViewDetail] = useState("");
    const [openViewDetail, setOpenViewDetail] = useState(false);

    const [openModalImport, setOpenModalImport] = useState(false);

    //Mỗi lần biến current hay pageSize thay đổi thì fetchUser() sẽ dc gọi
    //Đồng nghĩa với việc là re-render
    useEffect(() => {
        fetchUser();
    }, [current, pageSize, filter, sortQuery]);

    const fetchUser = async () => {
        setIsLoading(true);

        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `${filter}`;
        }

        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        const res = await callFetchListUser(query);
        if (res && res.data) {
            setListUser(res.data.result);
            setTotal(res.data.meta.total);
        }
        setIsLoading(false);
    }

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',  //đặt tên "_id" đúng theo database
            //Hàm Render() Columns cung cấp 1 param: record
            //record => chính là data tại cái row mà nó render ra
            render: (text, record, index) => {
                return (
                    <a href="#" onClick={() => {
                        setDataViewDetail(record);
                        setOpenViewDetail(true);
                    }}>{record._id}</a>
                )
            }
        },
        {
            title: 'Tên Hiển Thị',
            dataIndex: 'fullName', //đặt tên "fullName" đúng theo database
            sorter: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',  //đặt tên "email" đúng theo database
            sorter: true,
        },
        {
            title: 'Số Điện thoại',
            dataIndex: 'phone',  ////đặt tên "phone" đúng theo database
            sorter: true,
        },
        {
            title: 'Action',
            width: 100,
            render: (text, record, index) => {
                return (
                    <>
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa user"}
                            description={"Bạn có chắc chắn muốn xóa user này ?"}
                            onConfirm={() => handleDeleteUser(record._id)}
                            onText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <DeleteTwoTone
                                twoToneColor="#ff4d4f"
                            />
                        </Popconfirm>
                        <EditTwoTone
                            twoToneColor="#f57800"
                            style={{ cursor: "pointer", paddingLeft: 20 }}
                            onClick={() => {
                                setOpenModalUpdate(true);
                                setDataUpdate(record);
                            }}
                        />
                    </>
                )
            }
        },
    ];


    const onChange = (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
            //fetchUser(): Nếu để ở đây thì biến state(current) và hàm fetchUser()
            //sẽ dc gọi song song với nhau do đó biến current sẽ chưa dc cập nhật
            // => sai logic (cần cập nhật state trước sau đó mới gọi tới fetchUser())
        }

        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1)
        }

        if (sorter && sorter.field) {
            const q = sorter.order === 'ascend' ? `sort=${sorter.field}`  //field = dataIndex ở columns [dataIndex = param ở trong back-end]
                : `sort=-${sorter.field}`;
            setSortQuery(q);
        }

        console.log('check params', pagination, filters, sorter, extra);
    };

    const handleDeleteUser = async (userId) => {
        const res = await callDeleteUser(userId);
        console.log('check res DELETE USER: ', res);
        if (res && res.data) {
            message.success('Xóa user thành công');
            fetchUser();
        } else {
            notification.error({
                message: 'Có lỗi xày ra',
                description: res.message
            });
        }

    }

    const handleExportData = () => {
        //https://stackoverflow.com/questions/70871254/how-can-i-export-a-json-object-to-excel-using-nextjs-react
        if (listUser.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(listUser);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            //Có thể xuất ra định dạng file .xlsx
            XLSX.writeFile(workbook, "ExportUser.csv");
        }
    }

    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Table List Users</span>
                <span style={{ display: 'flex', gap: 20 }}>
                    <Button
                        icon={<ExportOutlined />}
                        type="default"
                        onClick={() => handleExportData()}
                    >Export</Button>

                    <Button
                        icon={<CloudUploadOutlined />}
                        type="primary"
                        onClick={() => setOpenModalImport(true)}
                    >Import</Button>

                    <Button
                        icon={<PlusOutlined />}
                        type="dashed" danger
                        onClick={() => setOpenModalCreate(true)}
                    >Thêm mới</Button>

                    <Button
                        type='ghost'
                        onClick={() => {
                            setFilter("")
                            setSortQuery("")
                        }}
                    >
                        <ReloadOutlined />
                    </Button>
                </span>
            </div>
        )
    }

    const handleSearch = (queryaa) => {
        setFilter(queryaa)
    }

    return (
        <>
            <Row>
                <Col span={24}>
                    <InputSearch
                        handleSearchProps={handleSearch}
                        setFilter={setFilter}
                    />
                </Col>
                <Col span={24}>
                    <Table
                        title={renderHeader}
                        loading={isLoading}

                        columns={columns}
                        dataSource={listUser}
                        onChange={onChange}
                        rowKey="_id"
                        pagination={
                            {
                                current: current,
                                pageSize: pageSize,
                                total: total,
                                showSizeChanger: true,
                                //showTotal: To display the total number and range
                                showTotal: (total, range) => {
                                    return (
                                        <div>
                                            {range[0]} - {range[1]} trên {total} rows
                                        </div>
                                    )
                                }

                            }
                        }
                    />
                </Col>
            </Row>
            <UserModalCreate
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                fetchUser={fetchUser}
            />

            <UserModalUpdate
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                fetchUser={fetchUser}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />

            <UserViewDetail
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
            />

            <UserImport
                openModalImport={openModalImport}
                setOpenModalImport={setOpenModalImport}
                fetchUser={fetchUser}
            />
        </>
    )
}

export default UserTable;