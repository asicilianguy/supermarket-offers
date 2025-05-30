import { configureStore } from "@reduxjs/toolkit"
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux"
import authReducer from "./features/auth/authSlice"
import { userApiSlice } from "./features/user/userApiSlice"
import { offersApiSlice } from "./features/offers/offersApiSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    [offersApiSlice.reducerPath]: offersApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApiSlice.middleware, offersApiSlice.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
