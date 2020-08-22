import { configureStore } from '@reduxjs/toolkit';
import diagnosisKeysReducer from '../features/diagnosisKeysSlice';

export default configureStore({
  reducer: {
    diagnosisKeys: diagnosisKeysReducer,
  },
});
