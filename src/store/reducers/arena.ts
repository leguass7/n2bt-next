import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { IArena } from '~/server-side/useCases/arena/arena.dto'

export interface IArenaAppState {
  readonly loading: boolean
  readonly arenaId: number
  readonly name?: string | null
  readonly error?: string | null
  readonly options?: IArena[]
}

const initialState: IArenaAppState = {
  loading: false,
  arenaId: 0,
  name: '',
  error: null,
  options: []
}

export const slice = createSlice({
  name: '@arena',
  initialState,
  reducers: {
    setArena: (state, { payload }: PayloadAction<Partial<IArenaAppState>>) => {
      Object.keys(payload).forEach(k => {
        state[k] = payload[k]
      })
    },
    clearArena: state => {
      Object.keys(initialState).forEach(k => {
        state[k] = initialState[k]
      })
    }
  }
})

export const { setArena, clearArena } = slice.actions
export default slice.reducer
