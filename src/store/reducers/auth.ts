import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IAuthAppState {
  readonly loading: boolean
  readonly allowedContact?: boolean | null
  readonly token: string
  readonly expiration?: Date | null
  readonly nick?: string | null
  readonly level?: number
  readonly completed?: boolean
  readonly error?: string | null
  readonly recoverCode?: string | null
}

const initialState: IAuthAppState = {
  loading: false,
  token: '',
  expiration: null,
  nick: null,
  level: 0,
  completed: false,
  error: null,
  recoverCode: null,
  allowedContact: null
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
