import UserReducer from "./User/UserReducer";

import { createStore } from "redux";


const store = createStore(UserReducer);

export default store;