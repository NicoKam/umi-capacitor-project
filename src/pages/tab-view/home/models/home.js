import { fetch } from '../services';

const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));

export default {
  namespace: 'home',
  state: {
    title: '...',
  },
  effects: {
    *fetch(_, { call, put }) {
      const { data } = yield call(fetch);
      yield delay('1000');
      yield put({ type: 'update', title: data || 'world' });
    },
  },
  reducers: {
    update: (state, { type, ...newState }) => ({
      ...state,
      ...newState,
    }),
  },
};
