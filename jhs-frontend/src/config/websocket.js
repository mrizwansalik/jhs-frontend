/* eslint-disable class-methods-use-this */
/* eslint-disable  */
import { w3cwebsocket as W3cwebsocket } from 'websocket';
import { config as mainConfig } from './config';
import { store } from '../store/index';
import { param } from 'jquery';

// import { logout } from '../store/auth/actions';
// import { History } from '../routes/NavigationSetter';
// import { setIsLoading } from '../helpers/globalHelpers';

export class OpenSocket {
  constructor(options = {}) {
    this.token = options.token
    this.url = options.url;
    this.setSocketURL();
    this.setSocketService();
    this.connect();
    this.client.onerror = (error) => this.onError({ client: this.client, error });
    this.client.onclose = (closeEvent) => this.onClose({ client: this.client, closeEvent });
    this.client.onopen = () => this.onOpen({ client: this.client });
    this.client.onmessage = (message) => this.onMessage({ client: this.client, message });
  }

  setSocketURL() {
    if (this.url === 'chat') this.socketUrl = mainConfig.data().CHAT_SOCKET_URL;
    if (this.url === 'articleProcessing') this.socketUrl = mainConfig.data().ARTICLE_PROCESSING_SOCKET_URL;
    if (this.url === 'articleDiscussion') this.socketUrl = mainConfig.data().ARTICLE_DISCUSSION_SOCKET_URL;
    if (this.url === 'notification') this.socketUrl = mainConfig.data().NOTIFICATION_SOCKET_URL;
    return this.socketUrl;
  }

  connect() {
    // let headers = mainConfig.data().defaultHeaders;
    // headers['Cookie'] = "cookie"
    if (this.client) {
      this.client.close();
      delete this.client;
      this.client = null;
      store.dispatch({
        type: `SET_${this.socketService}_SOCKET_CONNECTION`,
        payload: null,
      });
    }
    this.client = new W3cwebsocket(this.socketUrl, `${this.token}`);
  }

  setSocketService() {
    if (this.url === 'chat') this.socketService = 'CHAT';
    if (this.url === 'notification') this.socketService = 'NOTIFICATION';
    if (this.url === 'articleProcessing') this.socketService = 'ARTICLE_PROCESSING';
    if (this.url === 'articleDiscussion') this.socketService = 'ARTICLE_DISCUSSION';
    return this.socketService;
  }
  onOpen(params) {
    // this.client.setRequestHeader('Cookie', 'myCookie=value');
    store.dispatch({
      type: `SET_${this.socketService}_SOCKET_CONNECTION`,
      payload: params.client,
    });
    if (this.url !== 'chat') {
      store.dispatch({ type: `SET_${this.socketService}_SOCKET_STATUS`, payload: true });
    }
  }

  onMessage(params) {
    // const state = store.getState();
    const response = JSON.parse(params.message.data);
    // if (response.method === 'CONFIGURATIONS') {
    //   store.dispatch({
    //     type: `SET_SOCKET_CONFIGURATIONS`,
    //     payload: response.data,
    //   });
    //   store.dispatch({ type: `SET_SOCKET_STATUS`, payload: true });
    // }

    if (response.status === 200) {

      store.dispatch({ type: `SET_${this.socketService}_SOCKET_STATUS`, payload: true });
    }

    // if (response.method === 'HEARTBEAT') {
    //   params.client.send(JSON.stringify({ method: 'HEARTBEAT', alive: true }));
    // }
    // Pong to server
    if (response.method === 'PING') {
      params.client.send(JSON.stringify({ method: 'PONG', isAlive: true }));
    }
    if (response.status === 401) {
      // store.dispatch(logout());
      // History.navigate('/login');
    } else store.dispatch(this.socketResponse(response));
  }

  onError(params) {
    store.dispatch({ type: `SET_${this.socketService}_SOCKET_STATUS`, payload: false });
    console.error('[socket] Error:', params.error);
  }

  onClose(params) {
    console.info(
      ` Socket is closed. Reconnect will be attempted in 1 second.`,
      params.closeEvent.reason
    );
    store.dispatch({ type: `SET_${this.socketService}_SOCKET_STATUS`, payload: false });
    const interval = setInterval(() => {
      if (navigator.onLine) {
        this.connect();
        const readyStateInterval = setInterval(() => {
          if (this.client.readyState == 1) {
            this.onOpen({ client: this.client });
            store.dispatch({ type: `SET_${this.socketService}_SOCKET_STATUS`, payload: true });
            clearInterval(readyStateInterval);
          }
        }, 1000);
        clearInterval(interval);
      }
    }, 1000);
  }

  close(params) {
    const socketUrl = mainConfig.data().CHAT_SOCKET_URL;
    const client = new W3cwebsocket(socketUrl + params.options.url);
    client.disconnect(); //Not working method
    store.dispatch({ type: `SET_${this.socketService}_SOCKET_STATUS`, payload: false });
  }

  socketResponse(response) {
    return async (dispatch) => {
      if (response.status !== 200) {
        switch (response.status) {
          case 412:
          case 422: {
            dispatch({
              type: 'SET_FORM_ERRORS',
              payload: response,
            });
            break;
          }
          default:
            return 0;
        }
      } else if (response.status === 200) {
        // if (response.accessToken)
        //   localStorage.setItem('accessToken', response.accessToken);
        // dispatch({ type: 'RESET_FORM_ERRORS' });
        dispatch({
          type: response.method,
          payload: response.data,
        });
      }
    };
  }
}

export const send = (socket, method, data = {}, options = {}) => {
  return async () => {
    socket.conn.send(JSON.stringify({ method, ...data }));
  };
};


