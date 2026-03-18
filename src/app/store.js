import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../components/auth/authSlice';
import auditReducer from '../features/audit/auditSlice';
import schoolReducer from '../school/schoolSlice';
import { adminApi } from '../api/adminApi'; 

export const setupStore = (preloadedState) => {
return configureStore({
    reducer: {
        auth: authReducer,
        school: schoolReducer,
        audit: auditReducer,
        [adminApi.reducerPath]: adminApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(adminApi.middleware),
    preloadedState
});
}
export const store = setupStore();