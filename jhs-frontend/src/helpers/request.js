/* eslint-disable  */
import { setErrors } from 'store/general/actions';
import axios from '../config/apiRequest';
import { store } from '../store/index.js';
import { setIsLoading, setComponentIsLoading, setbtnLoader, setToast, setResponse, setUpToast, getModulePrefix, setformErrors, logOutUser, setGeneralErr } from './globalHelpers';

export const request = {
    async makeRequest(requestType = 'POST', url, data = {}, options = {}, appendFilters = true) {
        try {
            // Append filters
            if (appendFilters && requestType == 'GET' && options.pagination ) {
                const state = store.getState();
                data = { ...state.filters, ...data };
            }

            if (options.coordinates && navigator.geolocation && requestType == 'GET') {
                const coordinates = store?.getState()?.coordinates;
                data = { ...coordinates, ...data };
            }

            // Do Before Request Tasks
            doBeforeRequestTasks(options);

            let newRequest = null;
            url = getModulePrefix(url, options?.__module);
            switch (requestType) {
                case 'GET':
                    newRequest = axios.get(url, { params: data });
                    break;
                case 'POST':
                    newRequest = axios.post(url, data);
                    break;
                case 'PUT':
                    newRequest = axios.put(url, data);
                    break;
                case 'PATCH':
                    newRequest = axios.patch(url, data);
                    break;
                case 'DELETE':
                    newRequest = axios.delete(url, { data });
                    break;
                default:
                    newRequest = axios.post(url, data);
            }
            const resp = await newRequest;

            doOnOKResponseTasks(resp, options);

            return setResponse(resp);
        } catch (error) {
            doOnErrorResponseTasks(error, options);
            if (error.response) {
                if (error.response.status === 422) {
                  setformErrors(error.response.data);
                    return {
                         status: error.response.status,
                         message: error.response.data.message,
                         errors: error.response.data.data.errors,
                    };
                } else if (error.response.status === 400) {
                    setformErrors(error.response.data, options);
                    return error.response.data;
                }
                 else if (error.response.status === 403) {
                   setGeneralErr(error.response.data)
                }
                else {
                    setformErrors(error.response.data, options);
                    return error.response.data;
                }
            } else if (error.request) {
                
                return error;
            } else {
                return error;
            }
        } finally {
            setIsLoading(false);
            setbtnLoader(false);
        }
    },
};

const doBeforeRequestTasks = (options) => {
    /**
     * Show Full Page Loader
     */
    if (options.loader) setIsLoading(options.loader);

    /**
     * Show component loader
     */
    if (options.componentLoader) setComponentIsLoading(options.componentLoader);

    /**
     * Set loader on submit button(s)
     */
    if (options.btnLoader) setbtnLoader(options.btnLoader);
};

const doOnOKResponseTasks = (resp, options) => {
    // If toast enabled
    if (options.showToast) setToast(setUpToast(resp));
};

const doOnErrorResponseTasks = (error, options) => {
    /**
     * Set Toast(s) if enabled
     */
    if (options.showToast && error?.response) setToast(setUpToast(error?.response));
    else if (options.showToast && error?.request){
        setToast(
            setUpToast({
                status: 400,
                type: 'error',
                data: { message: 'Server could not respond.' },
            })
        );
    }
    /**
     * Set Toast(s) if enabled
     */
    if (options.loader && error?.response) setErrors(setUpToast(error?.response));
    else if (options.loader && error?.request){
        setToast(
            setUpToast({
                status: 400,
                type: 'error',
                data: { message: 'Server could not respond.' },
            })
        );
    }
    /**
     * Log the user out IF status code is 401
     */
     if (error.response?.status === 401) {
        logOutUser();
    }
};