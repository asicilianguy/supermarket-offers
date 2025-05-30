import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { User } from "@/types"

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      const { user, token } = action.payload
      state.user = user
      state.token = token
      state.isAuthenticated = true

      // Store token in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token)
      }
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false

      // Remove token from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
      }
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
  },
})

export const { setCredentials, logout, updateUser } = authSlice.actions

export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user
export const selectToken = (state: { auth: AuthState }) => state.auth.token
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated

export default authSlice.reducer
