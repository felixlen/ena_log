import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const fetchKeys = createAsyncThunk(
  'fetchKeys',
  async () => {
      return {'26c8e16d66f0fc1679bcf9a97183337afd854cd72bf4938ec43b2df4ceaee5f2': '2020-08-08',
        'f7249967a905848a41aa56c4b99befc5a4763f88635ffa89c97256752187fe8c': '2020-08-09',
        '254aad2606244a9b0ee948d7f529cef82eb0d79d7c4676bd032d72d47790b5c4': '2020-08-10',
        'a18e806f1ceff5943a93a1ad4057286209e59b7b30cd627dbf695d5de5ea5bc2': '2020-08-11',
        '3bd10320781c1e71d844ad787c7b5f3bf34fc9ac19ee4ddb85abf6736b2cfbeb': '2020-08-12',
        '9834e005a724ec22de70e2cc43e3a2d4a9b8eeefbe5819db8106dbc282e31747': '2020-08-13',
        'c2abbd2edfe0b6142b276772dc7827970bda7d1c5db0a29bb3b9324168cafda2': '2020-08-14',
        '181702660f5033305b36e34f014322d1d76ec86cf378eaf1f6e36aadd8892d89': '2020-08-15',
        '6e8a32a45be0ec51e325a5f3a8e7b5b9a4b3a766f2cb2df732746abdbdff03f0': '2020-08-16',
        '3cc13d8e735eef8fb37845f0c212fa9472300342e02370ad8b21fb7200f0f0a2': '2020-08-17',
        '43bd6d975c57daf38ea570975c3e0d6dbe7d9f750ea3243af84aa552031a2d81': '2020-08-18',
        '8f95f9299978f59e938cf8a3eb8ce8df76518835a45ee6e43250f9c20e866bdd': '2020-08-19',
        '332c6ab2a071450aa9eca5d2d633ff5dfaf8d216dc16191beecb009e5508039b': '2020-08-20',
        '0e7d88851c86b53f9054aee9a978a88d58439e638cd86d7b34bc3d5598bb3afc': '2020-08-21',
        '66a963f473ca62e4ae272c1592b2c45f7adef47a1b9fe82cd77db5988788aa23': '2020-08-07',
        'd34545397e3cceaa63241be346d55d83ab3f5c8b841464a7701138b3e033b756': '2020-08-06',
        '8c9b1750b841c0438f59de8a24a757c607293e143513895b2debeb2365f5ffc0': '2020-08-05',
        'fc11a5902e8af6b0d553fa3efe177fe58f274c8b9c2f8cd8599ce731d3d94033': '2020-08-04',
        '833616c7f071a6588c27cab55a817f5fff827a432fe9515d9f92cc7468241371': '2020-08-03',
        'a7397d370364d7161218210e99eeac01036894cee5552c5d92be644c33d3a0dd': '2020-08-02',
        '56af64d46d311333b8cee0430a0b7ef87ca04fc4369aa719674f7bdbfe8c30aa': '2020-08-01',
        '21c9ff4b16973c0c9d48a8db37d728014f41827fe745511e01fae683589cdffe': '2020-07-31',
        'f090f7eb8b51d96064c8d04267b0f4dd251884ba88e2f602758a3713c597ba36': '2020-07-30',
        '742b557cc3340276581cda249bf32974da216a73608a93c7ca71af6780dedbb1': '2020-07-29',
        '75432f9ac4f9795d55c0cfe8792372bb8c439a81b36e2c67592ed3e84941b842': '2020-07-28',
        '681d0bb41e33c3659e6528abe9736371800569fead906b68fb86175cfbdea65f': '2020-07-27',
        'd06f689afb6b040f5022ca22cb468ae4d0e3a1ca96f1638271270c85bbb52448': '2020-07-26',
        '29d6d1d12b665615aab90fcaae7381a7bec5c94b486c4c1db2b58187709d9f73': '2020-07-25',
        'c6a03d8f5c9489d5a8e3d07ecb333ebb3e753759b81887787bd1eb8c8193fb25': '2020-07-24',
        'e5448879d9be533290587d1177e3a2e64df06c7cd785b17e5d8fe3769dbe0b0b': '2020-07-23',
        '895f811a97d2312d73bbd145e33af01202a2b10ac9dcd7173952d16cac50e748': '2020-07-22',
        '4cdeabf45b7cb9b55ea8ca8c0ae7197defbd71dcca517b590d1faacd537449c2': '2020-07-21',
        'd2ade77c14a72ef9f1cb6e1b058bf5aeba987849d1de5134550e0465f6a0664e': '2020-07-20',
        'fca34e5d5e096a0fb20507367a5ca29f9fb588d489b663a1b764cd65965114b0': '2020-07-19',
        '049ebd8512a01c1f09e4e2c1b45e1d30542f7b5eec6950ac024cd7882f2425d3': '2020-07-18',
        '88a1cbb8947ea2e0c09219e0de51afc5a862661fb7aa1001c91122461b3219f5': '2020-07-17',
        'bc56375270a17d8875be95b9dcbfe9a9c14058296a6358417e01039ab878310d': '2020-07-16',
        '9967f91b1a858b4fa495ecafa53796b366b4e7ad040003a40555001e0cb2b0c6': '2020-07-15',
        '2d44fd03b0c7b2d5e7b91037aacd2529008373f267b7afb71c823917104e0e29': '2020-07-14',
        '638c8e711b63d8a99d6ea597f0359921fae894b029c6da7d08e56b15c764d17e': '2020-07-13',
        'd7f52d05797de8a3e4f11f30b371431230f461b3d69e88a0da88173131c763b7': '2020-07-12',
        '83cf4fb420b3853d57902619b1e9f2b263fc7b8c164980da96abe165b0111310': '2020-07-11',
        '3915d776c7dbb1e270e6ae9a208b0ba54806642de8a68d8ceb6042e623026183': '2020-07-10',
        '94b8fe9cd7c80c854aaabc0846febeee886c5336412e9b2c49d122725fb0a276': '2020-07-09',
        'bcf4faf20c0121e47c8e764303b2537509fb1594f66b61c1ba8c68f9ad7156ea': '2020-07-08',
        '4260d0054ad4ed046687792fcc7f5af7e3c95df858ef6348d9da86ff905f09f2': '2020-07-07',
        'de774a8811990298a0d2eb9e6abbfb1bbd39723cc5de25528ac8c9b7f9727426': '2020-07-06',
        '50324dc3f671099049e694ae5e90baa144e2aca10cb16173affef67444efac75': '2020-07-05',
        '8d32bc260a0c5fc662f474f7750008a374628a8bc79aa6541eef4a6b1890f579': '2020-07-04',
        '42e5015a7e48248b77f540c15d5c1e853341cf57b072576f4193e968c1483fbc': '2020-07-03',
        'f5a823e08898de23a6f1976285f6b4e1f9fe51c4aa4261683186ef27b16b4e97': '2020-07-02',
        '3718d4f1c65880f45ad7a2831864570526fac408d98cd8c9738639155aec9a06': '2020-07-01',
        '2064759a6c457046d28cce87f3a325be7df1aefe82ac9f34d65d2d193d86fcaa': '2020-06-30',
        '15851d1345471a71aa4c32af3613e3a75908c6777144e8fb6bc8b01a7083d020': '2020-06-29',
        '7f8a901375a46c6da02a57040a861efee2bb7d581f661c52c0fdbd3ea3fe6460': '2020-06-28',
        'e7cbe87cb3a7f590e4dfc08db2e4f6842796548e06c19ebf999e27a9b5bde8f0': '2020-06-27',
        '17c8d19fc3255130d60d1aa06946cf2a8114d906a2bf1fcfd4876c23792b039a': '2020-06-26',
        '9615cf8d5978f0722c9d2fdf96ae2511ffb476976a9526c222770d105c0ada03': '2020-06-25',
        'fc612a4e62dda3b5931849e56a397d126320e94cdaea6282f6ad06897c9f09e3': '2020-06-24',
        'eb55e20c170eb44190aaa5fb26c2da6b2660574d219b4b0afdfd76a373cdd1e5': '2020-06-23'}
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
