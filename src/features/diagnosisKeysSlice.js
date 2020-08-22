import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'

const fetchKeys = createAsyncThunk(
  'fetchKeys',
  async () => {
    const response = await axios.get('https://ctt.pfstr.de/json/filehashes.json')
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
  reducers: {
    resetENA(state, action) {
      state.exposures = {}
      state.enastatus = 'uninitialized'
    }
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
      // loop twice through exposure: first time to get all hashes, second time to get all matches
      // rationale: also report 0 matches for a file where matches have been reported at another check instance
      exposures.map( e => {
        const matchCount = is_ios ? e.MatchCount : e.matchesCount
        if (matchCount > 0) {
          const hash = is_ios ? e.Hash.toLowerCase() : Buffer.from(e.hash, 'base64').toString('hex').toLowerCase()
          if( !(hash in state.exposures) ) {
            const keysInFileCount = is_ios ? e.RandomIDCount : e.keyCount
            state.exposures[hash] = {date: state.keys[hash], keysInFileCount: keysInFileCount, matches: []}
          }
        }
      })
      exposures.map( e => {
        const matchCount = is_ios ? e.MatchCount : e.matchesCount
        const hash = is_ios ? e.Hash.toLowerCase() : Buffer.from(e.hash, 'base64').toString('hex').toLowerCase()
        if (matchCount > 0 || hash in state.exposures) {
          const timestamp = is_ios ? e.Timestamp : e.timestamp
          state.exposures[hash].matches.push({timestamp: timestamp, count: matchCount})
        }
      })
      state.enastatus = 'loaded'
    },
    [readENALog.rejected]: (state, action) => { state.enastatus = 'error' },
  }
})

const { resetENA } = diagnosisKeysSlice.actions
export { fetchKeys, readENALog, resetENA }
export default diagnosisKeysSlice.reducer
