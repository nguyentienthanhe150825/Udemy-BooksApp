import axios from '../utils/axios-customize';

export const callRegister = (fullName, email, password, phone) => {
    return axios.post('/api/v1/user/register', { fullName, email, password, phone })
}

export const callLogin = (username, password) => {
    return axios.post('/api/v1/auth/login', { username, password })
}

//Mục Đích của API callFetchAccount (khi sử dụng token) để lấy infor user mỗi lần F5
//API chỉ truyền lên Bearer token (còn body trống)
export const callFetchAccount = () => {
    return axios.get('/api/v1/auth/account')
}


export const callLogout = () => {
    return axios.post('/api/v1/auth/logout')
}

export const callFetchListUser = (query) => {
    // current=1&pageSize=5
    return axios.get(`/api/v1/user?${query}`)
}

export const callDeleteUser = (query) => {
    return axios.delete(`/api/v1/user/${query}`)
}


export const callCreateUser = (fullName, email, password, phone) => {
    return axios.post('/api/v1/user', { fullName, email, password, phone })
}

export const callUpdateUser = (fullName, _id, phone) => {
    return axios.put('/api/v1/user', { fullName, _id, phone })
}


export const callBulkCreateUser = (data) => {
    return axios.post('/api/v1/user/bulk-create', data)
}

export const callFetchListBook = (query) => {
    return axios.get(`/api/v1/book?${query}`)
}

export const callFetchCategory = () => {
    return axios.get('/api/v1/database/category')
}

export const callUploadBookImg = (fileImg) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileImg', fileImg);
    // return axios.post('/api/v1/file/upload')
    return axios({
        method: 'post',
        url: '/api/v1/file/upload',
        data: bodyFormData,
        headers: {
            "Content-Type" : "multipart/form-data",
            "upload-type" : "book"
        }
    })
}