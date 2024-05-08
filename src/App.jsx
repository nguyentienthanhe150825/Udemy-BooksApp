import React, { useEffect, useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import LoginPage from "./pages/login/index.jsx";
import ContactPage from "./pages/contact/index.jsx";
import BookPage from "./pages/book/index.jsx";
import Header from "./components/Header/index.jsx";
import Footer from "./components/Footer/index.jsx";
import Home from "./components/Home/index";
import Register from './pages/register/index.jsx';
import Loading from './components/Loading/index.jsx';
import NotFound from './components/NotFound/index.jsx';
import AdminPage from './pages/admin/index.jsx';
import { callFetchAccount } from './services/api.js';
import { useDispatch, useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute/index.jsx';
import { doGetAccountAction } from './redux/account/accountSlice.js';

import LayoutAdmin from './components/Admin/LayoutAdmin.jsx';
import './styles/reset.scss';
import UserTable from './components/Admin/User/UserTable.jsx';
import BookTable from './components/Admin/Book/BookTable.jsx';
import BookViewDetail from './components/Admin/Book/BookViewDetail.jsx';

const Layout = () => {
  return (
    <div className='layout-app'>
      <Header />
      {/* Chính là children, là phần bị thay đổi còn Header và Footer giữ nguyên */}
      <Outlet />
      <Footer />
    </div>
  )
}


export default function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.account.isLoading);

  //Khi gọi API thành công thì nạp data vào Redux
  const getAccount = async () => {

    //ko gọi api ở tab network
    if (
      window.location.pathname === '/login'
      || window.location.pathname === '/register'
    ) return;

    //chỉ cần truyền Bearer <Token> thì khi gọi tới callFetchAccount sẽ lấy dc thông tin user
    //Để truyền Bearer <Token> thì cần phải gán access_token vào LocalStorage ở video trước
    //muốn gọi tới callFetchAccount cần xử lý code ở axios-customize
    //Mục Đích của Api callFetchAccount (khi sử dụng token) để lấy infor user mỗi lần F5
    const res = await callFetchAccount();
    console.log(">>> check res callFetchAccount: ", res);
    if (res && res.data && res.data.user) {
      dispatch(doGetAccountAction(res.data.user))
    }
  }

  useEffect(() => {
    getAccount();
  }, [])

  const routerMainPage = createBrowserRouter([

    //================User====================
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound />,

      //Outlet
      children: [
        /* index: true  => mặc định sẽ vào trang Home */
        { index: true, element: <Home /> },
        {
          path: "contact",
          element: <ContactPage />,
        },
        {
          path: "book",
          element: <BookPage />,
        },
      ],
    },

    //================Admin====================
    {
      path: "/admin",
      element: <LayoutAdmin />,
      errorElement: <NotFound />,
      children: [
        {
          index: true, element:
            <ProtectedRoute>
              {/* props.children: là children của ProtectedRoute*/}
              <AdminPage />
            </ProtectedRoute>,
        },
        {
          path: "user",
          element: <UserTable />,
        },
        {
          path: "book",
          element: <BookTable />,
        },
      ],
    },

    //================Login====================
    {
      path: "/login",
      element: <LoginPage />,
    },

    //================Register====================
    {
      path: "/register",
      element: <Register />,
    },
  ]);

  return (
    <>
      {isLoading === false
        || window.location.pathname === '/login'
        || window.location.pathname === '/register'
        || window.location.pathname === '/'
        // || window.location.pathname === '/admin'
        ?
        <RouterProvider router={routerMainPage} />
        :
        <Loading />
      }
    </>


  )
}

