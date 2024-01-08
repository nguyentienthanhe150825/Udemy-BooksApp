import React, { useState } from 'react';
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

const Layout = () => {
  return (
    <div className='layout-app'>
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export default function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <div>404 Not Found</div>,
      children: [
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
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

