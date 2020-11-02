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

const fetchKeysEUR = createAsyncThunk(
  'fetchKeysEUR',
  async () => {
    const response = await axios.get('https://ctt.pfstr.de/json_EUR/filehashes.json')
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

const parseDate = (date_string, is_ios) => {
  let timestamp = null
  if(is_ios) {
    timestamp = DateTime.fromFormat(date_string, "yyyy-MM-dd HH:mm:ss ZZZ")
  } else {
    if (date_string.includes('.')) {
      timestamp = DateTime.fromFormat(date_string, "d. LLLL yyyy, HH:mm")
    } else {
      timestamp = DateTime.fromFormat(date_string, "d LLLL yyyy, HH:mm")
    }
  }
  return timestamp
}

export const diagnosisKeysSlice = createSlice({
  name: 'diagnosisKeys',
  initialState: {
    keys: {},
    status: 'uninitialized',
    statusEUR: 'uninitialized',
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
    [fetchKeysEUR.pending]: (state, action) => { state.statusEUR = 'loading' },
    [fetchKeysEUR.fulfilled]: (state, action) => {
      state.statusEUR = 'loaded'
      state.keysEUR = action.payload
    },
    [fetchKeysEUR.rejected]: (state, action) => { state.statusEUR = 'error' },
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
        let timestamp = parseDate(is_ios ? e.Timestamp : e.timestamp, is_ios)
        files.map( f => {
          if (timestamp.isValid) {
            timestamp = timestamp.plus({days: -1})
          }
          const matchCount = is_ios ? f.MatchCount : f.matchesCount
          if (matchCount > 0) {
            const hash = is_ios ? f.Hash.toLowerCase() : Buffer.from(f.hash, 'base64').toString('hex').toLowerCase()
            if( !(hash in filtered_exposures) ) {
              const keysInFileCount = is_ios ? (exportVersion > 1 ? f.KeyCount : f.RandomIDCount) : f.keyCount
              const keys_filtered_by_hash = []
              const keys_filtered_by_count = []
              state.keys.concat(state.keysEUR).map( el => {
                if(el.hash === hash) {
                  keys_filtered_by_hash.push(el.date)
                }
                if(el.keyCount === keysInFileCount) {
                  keys_filtered_by_count.push(el.date)
                }
              })
              const date = keys_filtered_by_hash.length > 0 ? keys_filtered_by_hash[0] : (keys_filtered_by_count.length > 0 ? keys_filtered_by_count[0] : null)
              filtered_exposures[hash] = {
                date: date,
                probable_date: timestamp.toFormat('yyyy-MM-dd'),
                keysInFileCount: keysInFileCount,
                matches: []}
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
            let timestamp = parseDate(is_ios ? e.Timestamp : e.timestamp, is_ios)
            if (!timestamp.isValid) {
              timestamp = e.timestamp
            }
            else {
              timestamp = timestamp.toISO()
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
export { fetchKeys, fetchKeysEUR, readENALog, resetENA }
export default diagnosisKeysSlice.reducer
