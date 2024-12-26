/* eslint-disable  */
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getChats } from '../../../../store/main/chat/actions';
import { send, OpenSocket } from 'config/websocket';
import { useForm } from "react-hook-form";
import { getChat, attachments } from 'store/chat/actions';
import moment from 'moment';
import { debounce } from 'lodash';
import { isUserOnline, userLastSeenDateTime } from 'helpers/globalHelpers';
import { config as mainConfig } from '../../../../config/config';
import { convertDateTime } from 'helpers';
import axios from 'axios';
import { useDropzone } from 'react-dropzone'
import { Link } from 'react-router-dom';


const initials = {
  activeChat: null,
  logggedInUser: null,
  typing: false
}
const Chat = () => {
  let msgSeen = "";
  const dispatch = useDispatch();
  const [state, setState] = useState(initials);
  const [counter, setCounter] = useState(0);
  const chatRef = useRef(null);
  const chats = useSelector((state) => state.chat.list);
  const socketConn = useSelector((state) => state.chatSocket.conn);
  const socketSession = useSelector((state) => state.chatSocket);
  const chatUsers = useSelector((state) => state.chat.list);
  const profile = useSelector((state) => state.profile.profile);
  const typing = useSelector((state) => state.chat.isTyping);
  const currUser = JSON.parse(localStorage.getItem('auth'));
  const [uploadImage, setUploadImage] = useState([]);

  const today = moment()?.format('MM-DD-YYYY');
  const yesterday = moment()?.subtract(1, 'days')?.format('MM-DD-YYYY');
  let messages = useSelector((state) => state.chat.messages);

  const { register, handleSubmit, reset, formState: { errors }, } = useForm({
    reValidateMode: "onChange",
  });
  // useEffect(() => {
  //     window.scrollTo(0, 0);
  //     dispatch(
  //         getChats({
  //             body: {},
  //             options: { __module: 'chat' },
  //         })
  //     );
  // }, [dispatch]);

  useEffect(() => {
    //bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;

  }, [messages]);


  useEffect(() => {
    let interval = null;
    if (socketSession.status) {
      dispatch(
        send(socketSession, 'SET_CHAT_USERS')
      );
      interval = setInterval(() => {
        dispatch(
          send(socketSession, 'SET_CHAT_USERS')
        );
      }, 2000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [socketSession.status]);

  let token = localStorage.getItem('accessToken')

  useEffect(() => {
    if (!socketConn) new OpenSocket({ token, url: 'chat' });
  }, [socketConn?.readyState]);

  const loadMessages = async (receiver) => {
    setState({ ...state, activeChat: receiver });
    const data = {
      from: profile?._id,
      to: receiver?._id
    }
    dispatch(
      getChat({
        body: { ...data },
        options: { loader: true, __module: 'chat', showToast: false },
      }));

    dispatch(
      send(socketSession, 'SET_SESSION', {
        receiverId: receiver?._id,
        userId: profile?._id
      })
    );
  }

  const sendMessages = (formData) => {
    if (uploadImage[0]?.preview !== '') {
      uploadImage && uploadImage?.map((image) => {

        const appendForm = new FormData();
        appendForm.append("file", image.raw);
        appendForm.append("userId", profile?._id);
        appendForm.append("receiverId", state.activeChat._id);

        const url = import.meta.env.VITE_REACT_APP_API_URL + 'article/commentAttachments';
        axios.post(url, appendForm, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            ...mainConfig.data().defaultHeaders,
            //   'Content-Type': 'multipart/form-data'
          }
        })
          .then(response => {
            dispatch({ type: 'SEND_MESSAGE', payload: response.data.data });
          })
          .catch(error => {
            console.error(error);
          });
      });
    }

    dispatch(
      send(socketSession, 'SEND_MESSAGE', {
        message: formData.message,
      })
    );
    reset();
    setUploadImage([])
  };

  const debounceTyping = debounce((value) => {
    if (value == false) setState({ ...state, typing: false })
    dispatch(
      send(socketSession, 'TYPING', {
        userId: profile?._id,
        typing: value
      })
    )
  }, 300);

  const isTyping = (typing) => {
    if (state.typing === false) {
      dispatch(
        send(socketSession, 'TYPING', {
          userId: profile?._id,
          typing: typing
        })
      )
      setState({ ...state, typing: typing })
    } // end if
    debounceTyping(typing);
  } // end function isTyping

  const handleClick = () => {
    if (msgSeen.myself == false) {
      dispatch(
        send(socketSession, 'SEEN_MESSAGE', { uuid: msgSeen.uuid })
      )
    } // end if 
  } // end function

  const handleImage = (e) => {
    if (e.target.files.length) {
      let images = [];
      for (let i = 0; i < e.target.files.length; i++) {
        images.push({ preview: URL.createObjectURL(e.target.files[i]), raw: e.target.files[i] })
      }

      setUploadImage(images);
      // setUploadImage({
      //   preview: URL.createObjectURL(e.target.files[0]),
      //   raw: e.target.files[0]
      // });
    }
  }

  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div className="col-lg-12 pt-4 pb-2 pb-sm-4">
      <div className="row position-relative overflow-hidden gx-2 zindex-1">
        {/* Contacts list*/}
        <div className="col-xl-4">
          <div
            className="offcanvas-xl offcanvas-start position-absolute position-xl-relative h-100 bg-light rounded-5 border border-xl-0"
            id="contactsList"
            data-bs-scroll="true"
            data-bs-backdrop="false"
          >
            <div className="rounded-5 overflow-hidden">
              <div className="card-header w-100 border-0 px-4 pt-4 pb-3">
                <div className="d-flex d-xl-none justify-content-end mt-n2 mb-2">
                  <button
                    className="btn btn-outline-secondary border-0 px-3 me-n2"
                    type="button"
                    data-bs-dismiss="offcanvas"
                    data-bs-target=" #contactsList"
                  >
                    <i className="ai-cross me-2" />
                    Close
                  </button>
                </div>
                <div className="position-relative">
                  <input
                    className="form-control pe-5"
                    type="text"
                    placeholder="Search by name or email"
                  />
                  <i className="ai-search fs-lg text-nav position-absolute top-50 end-0 translate-middle-y me-3" />
                </div>
              </div>
              <div
                className="card-body px-0 pb-4 pb-xl-0 pt-1"
                data-simplebar="init"
                style={{ maxHeight: 700 }}
              >
                <div
                  className="simplebar-wrapper"
                  style={{ margin: "-4px 0px 0px" }}
                >
                  <div className="simplebar-height-auto-observer-wrapper">
                    <div className="simplebar-height-auto-observer" />
                  </div>
                  <div className="simplebar-mask">
                    <div
                      className="simplebar-offset"
                      style={{ right: 0, bottom: 0 }}
                    >
                      <div
                        className="simplebar-content-wrapper"
                        tabIndex={0}
                        role="region"
                        aria-label="scrollable content"
                        style={{ height: "auto", overflow: "hidden scroll" }}
                      >
                        <div className="simplebar-content" style={{ padding: '4px 0px 0px' }}>
                          {/* Contact*/}
                          {chatUsers.map((user) => {
                            return (
                              <div key={`userListItem-${user?.user?._id}`} onClick={() => loadMessages(user.user)} className={`d-flex align-items-center text-decoration-none px-4 py-3 pointer ${user?.user?._id == state.activeChat?._id ? 'pe-none bg-gray' : ''}`}>
                                <div className="position-relative flex-shrink-0 my-1"><img className="rounded-circle" src={`${user?.user?.file ? `${import.meta.env.VITE_REACT_APP_URL}/public/uploads/profile/${user?.user?.file}` : '/assets/img/avatar/user.png'}`} width={48} alt="Avatar" /><span className={`position-absolute bottom-0 end-0  border border-white rounded-circle me-1 ${isUserOnline(user?.user?._id) ? 'bg-success' : 'bg-secondary'}`} style={{ width: '.625rem', height: '.625rem' }} /></div>
                                <div className="d-flex justify-content-between w-100 ps-2 ms-1 my-1">
                                  <div className="me-3">
                                    <div className="h6 mb-1"> {user?.user?.full_name ?? user?.user?.email}</div>
                                    <p className="text-body fs-sm mb-0">
                                      {
                                        typing?.typing && typing.sender === user?.user?._id && typing.sender !== state?.activeChat._id ? <strong className='text-primary'>typing...</strong> :
                                          user?.message?.lastMessageViewed !== null || user?.message?.chatusers[0] === currUser?.user?.id ? user?.message?.message : <strong> {user?.message?.message}</strong>
                                      }
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )
                          })}

                        </div>

                      </div>
                    </div>
                  </div>
                  <div
                    className="simplebar-placeholder"
                    style={{ width: "auto", height: 884 }}
                  />
                </div>
                <div
                  className="simplebar-track simplebar-horizontal"
                  style={{ visibility: "hidden" }}
                >
                  <div
                    className="simplebar-scrollbar"
                    style={{ width: 0, display: "none" }}
                  />
                </div>
                <div
                  className="simplebar-track simplebar-vertical"
                  style={{ visibility: "visible" }}
                >
                  <div
                    className="simplebar-scrollbar"
                    style={{
                      height: 554,
                      transform: "translate3d(0px, 0px, 0px)",
                      display: "block"
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Chat window*/}
        <div className="col-xl-8">
          {state?.activeChat === null ?
            <div className="card h-100 border-0">
              {/* Body*/}
              <div
                className="card-body pb-0 pt-4"
                data-simplebar="init"
                style={{ maxHeight: 580 }}
              >
                Click To Chat
              </div>
            </div>
            :
            <div className="card h-100 border-0">
              {/* Header*/}
              <div className="navbar card-header w-100 mx-0 px-4">
                <div className="d-flex align-items-center w-100 px-sm-3">
                  <button
                    className="navbar-toggler d-xl-none me-3 me-sm-4"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#contactsList"
                    aria-controls="contactsList"
                    aria-label="Toggle contacts list"
                  >
                    <span className="navbar-toggler-icon" />
                  </button>
                  <div className="position-relative flex-shrink-0">
                    <img
                      className="rounded-circle"
                      src={`${state?.activeChat?.file ? `${import.meta.env.VITE_REACT_APP_URL}/public/uploads/profile/${state?.activeChat?.file}` : '/assets/img/avatar/user.png'}`}
                      width={48}
                      alt="Avatar"
                    />
                    <span
                      className={`position-absolute bottom-0 end-0 ${isUserOnline(state?.activeChat?._id) ? 'bg-success' : 'bg-secondary'} border border-white rounded-circle me-1`}
                      style={{ width: ".625rem", height: ".625rem" }}
                    />
                  </div>
                  <div className="d-flex justify-content-between w-100 ps-2 ms-1 my-1">
                    <div className="me-3">
                      <div className="h6 mb-1">{state?.activeChat?.full_name ?? state?.activeChat?.email}</div>
                      <p className="text-body fs-sm mb-0">{typing?.typing && typing.sender === state?.activeChat?._id ? <strong className='text-primary'>typing...</strong> : isUserOnline(state?.activeChat?._id) ? 'online' : `${userLastSeenDateTime(state?.activeChat?.lastActiveAt)}`}</p>
                    </div>
                  </div>

                  <div className="dropdown ms-auto">
                    <button
                      className="btn btn-icon btn-sm btn-outline-secondary border-0 rounded-circle me-n2"
                      type="button"
                      data-bs-toggle="dropdown"
                    >
                      <i className="ai-dots-vertical fs-4 fw-bold" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Body*/}
              <div className="card-body pb-0 pt-4" data-simplebar="init" style={{ maxHeight: 580 }}  >
                <div
                  className="simplebar-wrapper"
                  style={{ margin: "-24px -38px 0px" }}
                >
                  <div className="simplebar-height-auto-observer-wrapper">
                    <div className="simplebar-height-auto-observer" />
                  </div>
                  <div className="simplebar-mask">
                    <div className="simplebar-offset" style={{ right: 0, bottom: 0 }}>
                      <div ref={chatRef}
                        className="simplebar-content-wrapper"
                        tabIndex={0}
                        role="region"
                        aria-label="scrollable content"
                        style={{ height: "auto", overflow: "hidden scroll" }}>
                        <div
                          className="simplebar-content"
                          style={{ padding: "24px 38px 0px" }}
                        >
                          {/* Message*/}
                          {messages?.filter((message) => message.receiverId === state?.activeChat?._id || message.senderId === state?.activeChat?._id || message.senderId === profile?._id || message.receiverId === profile?._id).map((message, index, arr) => {
                            let previousDay = "";
                            let currentDay = "";
                            let previousTime = "";
                            let currentTime = "";
                            const messageDate = moment(message.createdAt)?.format('MM-DD-YYYY');

                            if (index > 0) {
                              previousDay = convertDateTime(arr[index - 1].createdAt, 'date');
                              currentDay = convertDateTime(message.createdAt, 'date');
                              previousTime = convertDateTime(arr[index - 1].createdAt, 'dateTime')
                              currentTime = convertDateTime(message.createdAt, 'dateTime')
                            }
                            if (arr.length - 1 === index && message.myself == false) {
                              msgSeen = message
                              // setMsgSeen(message)
                            };

                            return (
                              message.myself == false ?
                                <div key={`messageItem-${index}`} >
                                  {previousDay !== currentDay || index == 0 ?
                                    <div className="text-muted text-center mb-4">
                                      {messageDate === today ? 'Today' : messageDate === yesterday ? 'Yesterday' : <>{moment(message.createdAt).format('MM-DD-YYYY')}</>}
                                    </div> :
                                    ''}
                                  <div className="mb-3" style={{ maxWidth: 392 }}>
                                    <div className="d-flex align-items-end mb-2">
                                      <div className="flex-shrink-0 pe-2 me-1">
                                        <img
                                          className="rounded-circle"
                                          src={`${state?.activeChat?.file ? `${import.meta.env.VITE_REACT_APP_URL}/public/uploads/profile/${state?.activeChat?.file}` : '/assets/img/avatar/user.png'}`}
                                          width={48}
                                          alt="Avatar"
                                        />
                                      </div>
                                      {
                                        message.type === 'image' ?
                                          <div className="d-flex align-items-end justify-content-start mb-2">
                                            <img style={{ width: '80%' }}
                                              src={`${import.meta.env.VITE_REACT_APP_URL}/public/uploads/${message?.message}`} />
                                          </div>
                                          :
                                          (
                                            (message.type === 'file') ?
                                              <div className="message-box-start text-dark">
                                                <a className="d-flex align-items-top text-decoration-none pb-2" href="#">
                                                  <i className="ai-file text-black display-6 mt-1 pe-1 me-2"></i>
                                                  <div className="order-sm-1 pe-sm-3 me-xl-4">
                                                    <p className="mb-1 st text-black"><strong>File : {message.message}</strong></p>
                                                    <a className="btn btn-link p-0" href={`${import.meta.env.VITE_REACT_APP_URL}/public/uploads/${message?.message}`} target="_blank" rel="Click to Download file">
                                                      Download <i className="ai-download ms-2"></i>
                                                    </a>
                                                  </div>
                                                </a>
                                              </div>
                                              :
                                              <div className="message-box-start text-dark">
                                                {message.message}
                                              </div>
                                          )
                                      }
                                    </div>
                                    <div className="fs-xs text-muted text-end"> <>{moment(message?.createdAt).format("hh:mm A")}</></div>
                                  </div>
                                </div>
                                :
                                <div key={`messageItem-${index}`} >
                                  {previousDay !== currentDay || index == 0 ?
                                    <div className="text-muted text-center mb-4">
                                      {messageDate === today ? 'Today' : (messageDate === yesterday ? 'Yesterday' : <>{moment(message.createdAt).format('MM DD, YYYY')}</>)}
                                    </div> :
                                    ''}
                                  {/* Message*/}
                                  <div className="ms-auto mb-3" style={{ maxWidth: 392 }}>
                                    <div className="d-flex align-items-end mb-2">
                                      {
                                        message.type === 'image' ?
                                          <div className="d-flex align-items-end justify-content-end mb-2">
                                            <img style={{ width: '80%' }}
                                              src={`${import.meta.env.VITE_REACT_APP_URL}/public/uploads/${message?.message}`} />
                                          </div>
                                          :
                                          (
                                            (message.type === 'file') ?
                                              <div className="message-box-end bg-primary text-white">
                                                <a className="d-flex align-items-top text-decoration-none pb-2" href="#">
                                                  <i className="ai-file text-white display-6 mt-1 pe-1 me-2"></i>
                                                  <div className="order-sm-1 pe-sm-3 me-xl-4">
                                                    <p className="mb-1 st text-white"><strong>File : {message.message}</strong></p>
                                                    <a className="btn btn-link text-white p-0" href={`${import.meta.env.VITE_REACT_APP_URL}/public/uploads/${message?.message}`} target="_blank" rel="Click to Download file">
                                                      Download <i className="ai-download ms-2"></i>
                                                    </a>
                                                  </div>
                                                </a>
                                              </div>
                                              :
                                              <div className="message-box-end bg-primary text-white">
                                                {message.message}
                                              </div>
                                          )
                                      }

                                    </div>
                                    {/* message.lastMessageViewed!==null */}
                                    <div className="fs-xs text-muted d-flex align-items-end justify-content-end">
                                      <>{moment(message?.createdAt).format("hh:mm A ")}</>&nbsp;
                                      <i className={`${isUserOnline(state?.activeChat?._id) || message.lastMessageViewed !== null ? 'ai-checks' : 'ai-check'}  text-${message.lastMessageViewed !== null ? 'primary' : 'muted'} fs-xl mt-n1`} />
                                    </div>
                                  </div>
                                </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="simplebar-placeholder"
                    style={{ width: "auto", height: 842 }}
                  />
                </div>
                <div
                  className="simplebar-track simplebar-horizontal"
                  style={{ visibility: "hidden" }}
                >
                  <div
                    className="simplebar-scrollbar"
                    style={{ width: 0, display: "none" }}
                  />
                </div>
                <div
                  className="simplebar-track simplebar-vertical"
                  style={{ visibility: "visible" }}
                >
                  <div
                    className="simplebar-scrollbar"
                    style={{
                      height: 399,
                      transform: "translate3d(0px, 0px, 0px)",
                      display: "block"
                    }}
                  />
                </div>
              </div>
              {/* Footer (Textarea)*/}
              <div className="card-footer w-100 border-0 mx-0 px-4">
                <div className="d-flex align-items-end border rounded-3 pb-3 pe-3 mx-sm-3">
                  <form autoComplete='off' onSubmit={handleSubmit(sendMessages)}>
                    {
                      uploadImage && uploadImage?.length ? uploadImage?.map((image, index) => {
                        return (
                          <img key={`message_input_files_${index}`} className='m-1' style={{ height: '100px', width: '100px' }} src={image?.preview ? image.preview : ''} />
                        )
                      }) : <></>
                    }

                    {/* <div style={{width: '20px', height: '50px',  backgroundImage: `url(${uploadImage.preview ? uploadImage.preview :``})`}}></div> */}
                    <input type="text" autoComplete='off'
                      onClick={handleClick} onKeyDown={() => { isTyping(true) }} onKeyUp={() => { isTyping(false) }}
                      {...register('message', { required: true })}
                      className="form-control border-0"
                      rows={3}
                      placeholder="Type a message"
                      style={{ resize: "none" }}
                      defaultValue={""}
                    // style={{ }}
                    />
                    <div className="nav flex-nowrap align-items-center">
                      <label htmlFor="upload-avatar-pic">
                        <div htmlFor="upload-avatar-pic" className="nav-link text-muted p-1 me-1 pointer">
                          <i className="ai-paperclip fs-xl" />
                          <input id="upload-avatar-pic" multiple type="file" hidden onChange={handleImage} />
                        </div>
                      </label>

                      <a className="nav-link text-muted p-1" href="#">
                        <i className="ai-emoji-smile fs-xl" />
                      </a>
                      <button className="btn btn-sm btn-secondary ms-3" type="submit">
                        Send
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          }
        </div>

      </div>
    </div>

  );
};

export default Chat;