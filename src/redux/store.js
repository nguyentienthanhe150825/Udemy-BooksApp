import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../redux/counter/counterSlice';
import accountReducer from '../redux/account/accountSlice';

//Store: Nơi lưu trữ dữ liệu của Redux
export const store = configureStore({
  //Ở Store lúc này khai báo 2 Reducer(Công nhân): counter và account
  //Reducer: Xử lý dữ liệu của Redux sau đấy nạp dữ liệu vào State(Redux)
  reducer: {
    counter: counterReducer,
    account: accountReducer,
  },
});
