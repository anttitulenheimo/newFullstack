import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotify: (state, action) => {
      return action.payload
    },
    emptyNotify: (state, action) => {
      return ''
    }
  }
})

export const { setNotify, emptyNotify } = notificationSlice.actions
export default notificationSlice.reducer