import React, { useState } from 'react';
import { FaReact } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { VscSearchFuzzy } from "react-icons/vsc";
import { Divider, Badge, Drawer, message, Avatar } from 'antd';
import './header.scss';
import { useDispatch, useSelector } from 'react-redux';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { callLogout } from '../../services/api';
import { doLogoutAction } from '../../redux/account/accountSlice';

const Header = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const isAuthenticated = useSelector(state => state.account.isAuthenticated);
    const user = useSelector(state => state.account.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        const res = await callLogout();
        console.log('check res logout HomePage: ', res);
        if (res && res.data) {
            //Tại sao phải dispatch khi logout???
            //Để reset lại dữ liệu trong redux (thông tin như username, email,...)
            //Và để xóa bỏ access_token
            dispatch(doLogoutAction());
            message.success("Đăng xuất thành công");
            navigate("/")
        }
    }



    let items = [
        {
            label: <label
                style={{ cursor: 'pointer' }}
            >Quản Lý Tài Khoản</label>,
            key: 'account',
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Đăng Xuất</label>,
            key: 'logout',
        },
    ];

    if (user?.role === 'ADMIN') {
        items.unshift({
            label: <Link to='/admin'>Trang quản trị</Link>,
            key: 'admin',
        })
    }

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;

    return (
        <>
            <div className='header-container'>
                <header className='page-header'>
                    <div className='page-header_top'>
                        <div className='page-header_toggle' onClick={() => {
                            setOpenDrawer(true)
                        }}>OPEN</div>
                        <div className='page-header_logo'>
                            <span className='logo'>
                                <FaReact className='rotate icon-react'>ABC DEF</FaReact>
                                <VscSearchFuzzy className='icon-search' />
                            </span>
                            <input
                                className='input-search' type={'text'}
                                placeholder="Bạn Tìm gì hôm nay"
                            />
                        </div>
                    </div>
                    <nav className='page-header_bottom'>
                        <ul id="navigation" className='navigation'>
                            <li className='navigation_item'>
                                <Badge
                                    count={5}
                                    size={"small"}
                                >
                                    <FiShoppingCart className='icon-cart' />
                                </Badge>
                            </li>
                            <li className='navigation_item mobile'><Divider type='vertical' /></li>
                            <li className='navigation_item mobile'>
                                {isAuthenticated === true ?
                                    <Dropdown menu={{ items }} trigger={['click']}>
                                        <a onClick={(e) => e.preventDefault()}>
                                            <Space>
                                                <Avatar src={urlAvatar} />
                                                {user?.fullName}
                                                <DownOutlined />
                                            </Space>
                                        </a>
                                    </Dropdown>
                                    :
                                    <span onClick={() => navigate('/login')}>Tài Khoản</span>
                                }
                            </li>
                        </ul>
                    </nav>
                </header>
            </div>
            <Drawer
                title="Menu Chức Năng"
                placement='left'
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
            >
                <p>Quản lý tài khoản</p>
                <Divider />

                <p>Đăng xuất</p>
                <Divider />
            </Drawer>
        </>
    )
}

export default Header;