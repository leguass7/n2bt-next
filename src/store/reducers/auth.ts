import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IAuthAppState {
  readonly loading: boolean
  readonly token: string
  readonly expiration?: Date | null
  readonly userName?: string | null
  readonly level?: number
}

const initialState: IAuthAppState = {
  loading: false,
  token: '',
  expiration: null,
  userName: null,
  level: 0
}

export const slice = createSlice({
  name: '@auth',
  initialState,
  reducers: {
    setAuth: (state, { payload }: PayloadAction<Partial<IAuthAppState>>) => {
      Object.keys(payload).forEach(k => {
        state[k] = payload[k]
      })
    },
    clearAuth: state => {
      const ignore = ['groupId', 'parentId']
      Object.keys(initialState).forEach(k => {
        if (!ignore.includes(k)) state[k] = initialState[k]
      })
    }
  }
})

export const { setAuth, clearAuth } = slice.actions
export default slice.reducer
