import React, { useState, useEffect } from "react";
import { Table, Row, Col, Button } from "antd";
import InputSearch from "./InputSearchBook";
import { Drawer, Descriptions, Popconfirm, message, notification } from "antd";
import {
    CloudUploadOutlined,
    DeleteTwoTone,
    EditTwoTone,
    ExportOutlined,
    PlusOutlined,
    ReloadOutlined
} from '@ant-design/icons';

import * as XLSX from 'xlsx';
import InputSearchBook from "./InputSearchBook";
import { callFetchListBook } from "../../../services/api";
import BookViewDetail from "./BookViewDetail";
import BookModalCreate from "./BookModalCreate";
import moment from 'moment/moment';


const BookTable = () => {

    const [listBook, setListBook] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);

    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("");

    const [openModalCreate, setOpenModalCreate] = useState(false);

    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [dataViewDetail, setDataViewDetail] = useState("")

    useEffect(() => {
        fetchBook();
    }, [current, pageSize, sortQuery, filter]);

    const fetchBook = async () => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;

        if (filter) {
            query += `${filter}`;
        }

        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        const res = await callFetchListBook(query);
        console.log('>>> check res book <BookTable>: ', res);
        if (res && res.data) {
            setListBook(res.data.result);
            setTotal(res.data.meta.total);
        }
        setIsLoading(false);
    }

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
            render: (text, record, index) => {
                return (
                    <a href="#"
                        onClick={() => {
                            setDataViewDetail(record);
                            setOpenViewDetail(true);
                        }}
                    >
                        {record._id}
                    </a>
                )
            }
        },
        {
            title: 'Tên Sách',
            dataIndex: 'mainText',
            sorter: true,
        },
        {
            title: 'Thể Loại',
            dataIndex: 'category',
            sorter: true,
        },
        {
            title: 'Tác Giả',
            dataIndex: 'author',
            sorter: true,
        },
        {
            title: 'Giá Tiền',
            dataIndex: 'price',
            sorter: true,
            //https://stackoverflow.com/questions/37985642/vnd-currency-formatting
            render: (text, record, index) => {
                return (
                    <>{new Intl.NumberFormat('vi-VN', {style: 'currency', currency : 'VND'}).format(record.price)}</>
                )
            }
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            sorter: true,
            render: (text, record, index) => {
                return (
                    <>{moment(record.updatedAt).format("DD-MM-YYYY")}</>
                )
            }
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
                            // onConfirm={() => handleDeleteUser(record._id)}
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
            const q = sorter.order === 'ascend' ? `sort=${sorter.field}` : `sort=-${sorter.field}`;
            setSortQuery(q);
        }

        console.log('check params', pagination, filters, sorter, extra);
    };


    const renderHeader = () => {
        return (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Table List Book</span>
                <span style={{ display: "flex", gap: 20 }}>
                    <Button
                        icon={<ExportOutlined />}
                        type="default"
                    >Export</Button>

                    <Button
                        icon={<CloudUploadOutlined />}
                        type="primary"
                    >Import</Button>

                    <Button
                        icon={<PlusOutlined />}
                        type="dashed" danger
                        onClick={() => setOpenModalCreate(true)}
                    >Thêm mới</Button>

                    <Button
                        type='ghost'
                    >
                        <ReloadOutlined />
                    </Button>
                </span>
            </div>
        )
    }

    return (
        <>
            <Row>
                <Col span={24}>
                    <InputSearchBook
                        setFilter={setFilter}
                    />
                </Col>
                <Col span={24}>
                    <Table
                        title={renderHeader}
                        loading={isLoading}
                        columns={columns}
                        dataSource={listBook}
                        onChange={onChange}
                        rowKey="_id"
                        pagination={
                            {
                                current: current,
                                pageSize: pageSize,
                                total: total,
                                showSizeChanger: true,
                                //API của Pagination
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
            <BookViewDetail
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
            />
            <BookModalCreate
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                fetchBook={fetchBook}
            />
        </>
    )
}

export default BookTable;