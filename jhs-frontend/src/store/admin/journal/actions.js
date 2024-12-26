/* eslint-disable */
import { History } from '../../../routes/NavigationSetter';
import { request } from '../../../helpers/request';

export const getJournal = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `getJournal`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_JOURNAL', payload: response.data });
    }
};

export const getJournalWithManager = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'getJournalWithManager', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_JOURNAL', payload: response.data });
    }
};

export const updateJournal = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `updateJournal`, payload.body, payload.options);
    if (response.status === 200) {
        History.push('/system/journal')
    }
};