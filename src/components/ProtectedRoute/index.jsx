import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from "react-router-dom";
import AdminPage from '../../pages/admin/index.jsx';
import NotPermitted from './NotPermitted.jsx';

//=================PHÂN QUYỀN ADMIN======================
//Khi người dùng đăng nhập rồi thì cần check quyền của người dùng ấy
//Ở đây là check quyền ADMIN
const RoleBaseRoute = (props) => {
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    const user = useSelector(state => state.account.user);
    const userRole = user.role;

    //Nếu user đang cố tình vào trang có miền (/admin) và người dùng chính là admin
    if (isAdminRoute && userRole === 'ADMIN') {
        return (<>{props.children}</>)
    } else {
        return (<NotPermitted />)
    }

}


const ProtectedRoute = (props) => {

    const isAuthenticated = useSelector(state => state.account.isAuthenticated);

    return (
        <>
            {isAuthenticated === true ?
                //Cách 1:  Gắn Hẳn AdminPage ở ProtectedRoute thì ở App.js phải xóa bỏ
                //<AdminPage />

                //Cách 2: 
                <RoleBaseRoute>
                    {props.children}
                </RoleBaseRoute>  //Chính là AdminPage
                :
                <Navigate to='/login' replace />
                // window.location.href = '/login'
            }
        </>
    )
}

export default ProtectedRoute;