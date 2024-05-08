import axios from "axios";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const instance = axios.create({
  baseURL: baseUrl,
  //Tham số để Axios auto set Cookies (Chapter 2 - video 23)
  //axios not set cookies 
  withCredentials: true,
});

//Bước 1: gán access token vào axios:  (Chapter 2 - video 24)
//Đối vs Axios mặc định mỗi Request thì đều gán token và token thì lấy ở localStorage
instance.defaults.headers.common = { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }

//Bước 2: Nạp lại data cho redux khi mỗi lần load lại trang
//   => Viết hàm 'useEffect' trong App.jsx

//Bước 3: Sau khi dùng callFetchAccount để lấy thông tin user, sẽ nạp ngược lại Redux
//   => viết hàm 'doGetAccountAction' trong 'accountSlice'
//   => Tại hàm 'getAccount()' của App.jsx => Dùng dispatch để nạp dũ liệu user vào Redux thông qua 'doGetAccountAction'


//Video 29 - Phần 3: Axios Retry: Lấy lại access_token khi hết hạn
const handleRefreshToken = async () => {
  //Gọi tới API của refresh_token của back-end (Lấy token mới)
  const res = await instance.get('/api/v1/auth/refresh');
  console.log('>>> check handleRefreshToken: ', res);
  if (res && res.data) return res.data.access_token;
  else null;
}



//interceptor: là cách mà can thiệp vào request trước khi user nhận được phản hồi
instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

//Dòng 57 và 63 để tránh vòng lặp ở tab Network
const NO_RETRY_HEADER = 'x-no-retry';

//interceptor: là cách mà can thiệp vào request trước khi user nhận được phản hồi
instance.interceptors.response.use(function (response) {
  console.log('>>> check response axios customize: ', response);
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response && response.data ? response.data : response;
}, async function (error) {

  //+error.response.status: để khi trả về chuỗi string sẽ convert sang số nguyên rồi mới so sánh dc
  if (error.config && error.response
    && +error.response.status === 401
    && !error.config.headers[NO_RETRY_HEADER]
  ) {

    //Lấy token mới
    const access_token = await handleRefreshToken();

    error.config.headers[NO_RETRY_HEADER] = 'true';

    if (access_token) {
      //Gán vào request hiện tại => set lại token mới
      error.config.headers['Authorization'] = `Bearer ${access_token}`;
      //Ghi đè token mới lên
      localStorage.setItem('access_token', access_token)
      return instance.request(error.config);
    }

  }

  //Video 30 - Phần 3: fix lỗi khi hết hạn cookies: refresh_token
  if (error.config && error.response
    && +error.response.status === 400
    && error.config.url === '/api/v1/auth/refresh'
  ) {
    //Cho đăng nhập lại là lấy dc access_token
    window.location.href = '/login';
  }


  return error?.response?.data ?? Promise.reject(error);
});


export default instance;