import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'

const fetchKeys = createAsyncThunk(
  'fetchKeys',
  async () => {
    const response = await axios.get('https://cors-anywhere.herokuapp.com/https://ctt.pfstr.de/json/filehashes.json')
    return response.data
  }
)

const readENALog = createAsyncThunk(
  'readENALog',
  async payload => {
    const filereader = new FileReader()

    return new Promise( (resolve, reject) => {
      filereader.onerror = () => {
        filereader.abort()
        reject(new DOMException("Error parsing input file."))
      }
      filereader.onload = () => {
        resolve(filereader.result)
      }
      filereader.readAsText(payload)
    })
  }
)

export const diagnosisKeysSlice = createSlice({
  name: 'diagnosisKeys',
  initialState: {
    keys: [],
    status: 'uninitialized',
    enastatus: 'uninitialized',
    exposures: {}
  },
  extraReducers: {
    [fetchKeys.pending]: (state, action) => { state.status = 'loading' },
    [fetchKeys.fulfilled]: (state, action) => {
      state.status = 'loaded'
      state.keys = action.payload
    },
    [fetchKeys.rejected]: (state, action) => { state.status = 'error' },
    [readENALog.pending]: (state, action) => { state.enastatus = 'loading' },
    [readENALog.fulfilled]: (state, action) => {
      const payload_json = JSON.parse(action.payload)
      const is_ios = 'DeviceProductType' in payload_json
      const exposures = is_ios ? payload_json.ExposureChecks : payload_json
      exposures.map( e => {
        const matchCount = is_ios ? e.MatchCount : e.matchesCount
        if (matchCount > 0) {
          const hash = is_ios ? e.Hash.toLowerCase() : Buffer.from(e.hash, 'base64').toString('hex').toLowerCase()
          const keysInFileCount = is_ios ? e.RandomIDCount : e.keyCount
          const timestamp = is_ios ? e.Timestamp : e.timestamp
          if( !(hash in state.exposures) ) {
            state.exposures[hash] = {date: state.keys[hash], keysInFileCount: keysInFileCount, matches: []}
          }
          state.exposures[hash].matches.push({timestamp: timestamp, count: matchCount})
        }
      })
      state.enastatus = 'loaded'
    },
    [readENALog.rejected]: (state, action) => { state.enastatus = 'error' },
  }
})

export { fetchKeys, readENALog }
export default diagnosisKeysSlice.reducer
