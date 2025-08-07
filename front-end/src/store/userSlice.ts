import { createSlice } from '@reduxjs/toolkit'
const token = localStorage.getItem("token");


interface AuthState {
  authenticated:boolean
}

const initialState: AuthState = {
  authenticated: !!token,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state) => {
      state.authenticated = true;
    },
    logout(state) {
      state.authenticated = false;
    },
  },
})

export const { logout, login } = userSlice.actions
export default userSlice.reducer
