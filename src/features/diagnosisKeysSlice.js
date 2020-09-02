import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'
const { DateTime } = require("luxon");

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
    keys: {},
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
      const exportVersion = is_ios ? payload_json.ExportVersion : 1
      const exposures = is_ios ? payload_json.ExposureChecks : payload_json
      const filtered_exposures = {}
      // loop twice through exposure: first time to get all hashes, second time to get all matches
      // rationale: also report 0 matches for a file where matches have been reported at another check instance
      exposures.map( e => {
        const files = exportVersion > 1 ? e.Files : [e]
        files.map( f => {
          const matchCount = is_ios ? f.MatchCount : f.matchesCount
          if (matchCount > 0) {
            const hash = is_ios ? f.Hash.toLowerCase() : Buffer.from(f.hash, 'base64').toString('hex').toLowerCase()
            if( !(hash in filtered_exposures) ) {
              const keysInFileCount = is_ios ? f.RandomIDCount : f.KeyCount
              filtered_exposures[hash] = {date: state.keys[hash], keysInFileCount: keysInFileCount, matches: []}
            }
          }
        })
      })
      exposures.map( e => {
        const files = exportVersion > 1 ? e.Files : [e]
        files.map( f => {
          const matchCount = is_ios ? f.MatchCount : f.matchesCount
          const hash = is_ios ? f.Hash.toLowerCase() : Buffer.from(f.hash, 'base64').toString('hex').toLowerCase()
          if (matchCount > 0 || hash in filtered_exposures) {
            let timestamp = null
            if(is_ios) {
              timestamp = DateTime.fromFormat(e.Timestamp, "yyyy-MM-dd HH:mm:ss ZZZ").toISO()
            } else {
              if (e.timestamp.includes('.')) {
                timestamp = DateTime.fromFormat(e.timestamp, "dd. LLLL yyyy, HH:mm").toISO()
              } else {
                timestamp = DateTime.fromFormat(e.timestamp, "d LLLL yyyy, HH:mm").toISO()
              }
            }
            filtered_exposures[hash].matches.push({timestamp: timestamp, count: matchCount})
          }
        })
      })
      Object.entries(filtered_exposures).map( ([hash, exp]) => {
        exp.matches = exp.matches.sort( (a,b) => {return a.timestamp > b.timestamp ? 1 : -1})
        state.exposures[hash] = exp
      })
      state.enastatus = 'loaded'
    },
    [readENALog.rejected]: (state, action) => { state.enastatus = 'error' },
  }
})

const { resetENA } = diagnosisKeysSlice.actions
export { fetchKeys, readENALog, resetENA }
export default diagnosisKeysSlice.reducer
