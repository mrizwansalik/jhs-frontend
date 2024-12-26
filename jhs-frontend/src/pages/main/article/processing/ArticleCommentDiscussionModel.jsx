/* eslint-disable */
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useSelector } from "react-redux";

import Modal from "../../../../components/Modal";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import moment from "moment";
import { send, OpenSocket } from "config/websocket";
import { getArticleUserInfo, isUserOnline } from "helpers/globalHelpers";
import { getDiscussionReply } from "store/main/articleDiscussion/actions";
import axios from "axios";
import { config as mainConfig } from "../../../../config/config";
import { convertDateTime } from "helpers";

const initials = {
  activeType: "general",
  logggedInUser: null,
  typing: false,
};

const ArticleCommentDiscussionModel = ({ articleId }) => {
  let msgSeen = "";
  const dispatch = useDispatch();
  const [state, setState] = useState(initials);
  const [counter, setCounter] = useState(0);
  const discussionRef = useRef(null);

  const articleComment = useSelector((state) => state.article.commentReplies);

  const articleDiscussionTypes = useSelector(
    (state) => state.articleDiscussion.types
  );
  const socketConn = useSelector((state) => state.articleDiscussionSocket.conn);
  const socketSession = useSelector((state) => state.articleDiscussionSocket);
  const profile = useSelector((state) => state.profile.profile);
  const typing = useSelector((state) => state.articleDiscussion.isTyping);
  const currUser = JSON.parse(localStorage.getItem("auth"));
  const [uploadImage, setUploadImage] = useState([]);

  const today = moment()?.format("MM-DD-YYYY");
  const yesterday = moment().subtract(1, "days")?.format("MM-DD-YYYY");
  let messages = useSelector((state) => state.articleDiscussion.replies);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (discussionRef.current) discussionRef.current.scrollTop = discussionRef.current.scrollHeight;
  }, [messages]);

  let token = localStorage.getItem("accessToken");
  useEffect(() => {
    if (!socketConn) {
      new OpenSocket({ token, url: "articleDiscussion" });
    }
  }, [socketConn]);

  useEffect(() => {
    let interval = null;
    if (socketSession.status) {
      dispatch(
        send(socketSession, "SET_ARTICLE_DISCUSSION_TYPE", {
          articleId,
          commentId: articleComment?._id,
        })
      );
      interval = setInterval(() => {
        dispatch(
          send(socketSession, "SET_ARTICLE_DISCUSSION_TYPE", {
            articleId,
            commentId: articleComment?._id,
          })
        );
      }, 2000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [socketSession.status]);

  const loadMessages = async (type, commentId) => {
    setState({ ...state, activeType: type });
    const data = {
      from: profile?._id,
      articleId: articleId,
      commentType: type,
      commentId: commentId,
    };
    dispatch(
      getDiscussionReply({
        body: { ...data },
        options: { loader: true, __module: "article", showToast: false },
      })
    );
    dispatch(send(socketSession, "SET_ARTICLE_DISCUSSION_SESSION", data));
  }; // end function

  const sendReply = (formData) => {
    if (uploadImage[0]?.preview !== "") {
      uploadImage &&
        uploadImage?.map((image) => {
          const appendForm = new FormData();
          appendForm.append("file", image.raw);
          appendForm.append("type", state?.activeType ?? "general");
          appendForm.append("commentId", articleComment?._id);
          appendForm.append("articleId", articleId);

          const url =
            import.meta.env.VITE_REACT_APP_API_URL +
            "article/commentAttachments";
          axios
            .post(url, appendForm, {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                ...mainConfig.data().defaultHeaders,
                //   'Content-Type': 'multipart/form-data'
              },
            })
            .then((response) => {
              dispatch({ type: "SEND_ARTICLE_DISCUSSION_REPLY", payload: response.data.data });
            })
            .catch((error) => {
              console.error(error);
            });
        });
    }
    dispatch(
      send(socketSession, "SEND_ARTICLE_DISCUSSION_REPLY", {
        message: formData.message,
        type: state.activeType ?? "general",
        commentId: articleComment?._id,
        articleId: articleId,
      })
    );
    reset();
    setUploadImage([]);
  }; // end function

  return (
    <Modal id={`showArticleCommentReplyModel`} className="modal-xl bg-gray">
      <Modal.Header className="py-4">
        <h3 className="fs-5 mb-0 text-capitalized">
          <i className="ai-message text-primary lead pe-1 me-2" />
          Article Discussion on comment
        </h3>
        <button
          className="btn-close"
          type="button"
          data-bs-dismiss="modal"
          aria-label="Close"
        />
      </Modal.Header>
      <Modal.Body>
        {/* Quotation */}
        <div className="card bg-secondary">
          <div className="card-body">
            <figure>
              <blockquote className="blockquote">
                <p className="text-sentence">{articleComment?.text} </p>
              </blockquote>
            </figure>
          </div>
        </div>
        <div className="card mt-3 mb-4 pb-1 border-0">
          <div className="row position-relative overflow-hidden gx-2 zindex-1">
            {/* Contacts list*/}
            <div className="col-xl-4">
              <div
                className="offcanvas-xl offcanvas-start position-absolute position-xl-relative h-100 bg-light rounded-5 border border-1"
                id="contactsList"
                data-bs-scroll="true"
                data-bs-backdrop="false"
              >
                <div className="rounded-5 overflow-hidden">
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
                            ref={discussionRef}
                            className="simplebar-content-wrapper"
                            tabIndex={0}
                            role="region"
                            aria-label="scrollable content"
                            style={{
                              height: "auto",
                              overflow: "hidden scroll",
                            }}
                          >
                            <div
                              className="simplebar-content"
                              style={{ padding: "4px 0px 0px" }}
                            >
                              {/* Article Discussion Types */}
                              {articleDiscussionTypes?.map((type, index) => {
                                return (
                                  <div
                                    key={`articleDiscussionTypesItem-${index}`}
                                    onClick={() =>
                                      loadMessages(type, articleComment?._id)
                                    }
                                    className={`d-flex align-items-center text-decoration-none px-4 py-3 pointer ${"General" == state.activeType
                                      ? "pe-none bg-gray"
                                      : ""
                                      }`}
                                  >
                                    <div className="position-relative flex-shrink-0 my-1">
                                      <img
                                        className="rounded-circle"
                                        src={`/assets/img/avatar/user.png`}
                                        width={48}
                                        alt="Avatar"
                                      />
                                    </div>
                                    <div className="d-flex justify-content-between w-100 ps-2 ms-1 my-1">
                                      <div className="me-3">
                                        <div className="h6 mb-1 text-capitalize">
                                          {type.replace("_", " ")}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
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
                          display: "block",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Chat window*/}
            <div className="col-xl-8">
              <div className="card h-100 border-1">
                {/* Hader*/}
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
                        src="/assets/img/avatar/user.png"
                        width={48}
                        alt="Avatar"
                      />
                    </div>
                    <div className="h6 ps-2 ms-1 mb-0 text-capitalize">
                      {state.activeType?.replace("_", " ")}
                    </div>
                  </div>
                </div>
                {/* Body*/}
                <div
                  className="card-body pb-0 pt-4"
                  data-simplebar="init"
                  style={{ maxHeight: 500 }}
                >
                  <div
                    className="simplebar-wrapper"
                    style={{ margin: "-24px -38px 0px" }}
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
                          <div
                            className="simplebar-content"
                            style={{ padding: "24px 38px 0px" }}
                          >
                            {messages?.length != 0 ? (
                              <>
                                {/* Message*/}
                                {messages
                                  ?.filter(
                                    (message) =>
                                      message.receiverId ===
                                      state?.activeChat?._id ||
                                      message.senderId ===
                                      state?.activeChat?._id ||
                                      message.senderId === profile?._id ||
                                      message.receiverId === profile?._id
                                  )
                                  .map((message, index, arr) => {
                                    let previousDay = "";
                                    let currentDay = "";
                                    let previousTime = "";
                                    let currentTime = "";
                                    const messageDate = moment(
                                      message.createdAt
                                    )?.format("MM-DD-YYYY");

                                    if (index > 0) {
                                      previousDay = convertDateTime(
                                        arr[index - 1].createdAt,
                                        "date"
                                      );
                                      currentDay = convertDateTime(
                                        message.createdAt,
                                        "date"
                                      );
                                      previousTime = convertDateTime(
                                        arr[index - 1].createdAt,
                                        "dateTime"
                                      );
                                      currentTime = convertDateTime(
                                        message.createdAt,
                                        "dateTime"
                                      );
                                    }
                                    if (
                                      arr.length - 1 === index &&
                                      message.myself == false
                                    ) {
                                      msgSeen = message;
                                      // setMsgSeen(message)
                                    }

                                    return message.sender != profile?._id ? (
                                      <div key={`messageItem-${index}`}>
                                        {previousDay !== currentDay ||
                                          index == 0 ? (
                                          <div className="text-muted text-center mb-4">
                                            {messageDate === today ? (
                                              "Today"
                                            ) : messageDate === yesterday ? (
                                              "Yesterday"
                                            ) : (
                                              <>
                                                {moment(message.createdAt).format("MM-DD-YYYY")}
                                              </>
                                            )}
                                          </div>
                                        ) : (
                                          ""
                                        )}
                                        <div
                                          className="mb-3"
                                          style={{ maxWidth: 392 }}
                                        >
                                          <div className="d-flex align-items-end mb-1">
                                            <div className="flex-shrink-0 pe-2 me-1">
                                              <img
                                                className="rounded-circle"
                                                src={`${getArticleUserInfo(message.sender)?.file
                                                  ? `${import.meta.env
                                                    .VITE_REACT_APP_URL
                                                  }/public/uploads/${getArticleUserInfo(message.sender)?.file}`
                                                  : "/assets/img/avatar/user.png"
                                                  }`}
                                                width={48}
                                                alt="Avatar"
                                              />
                                            </div>
                                            {message.type === "image" ? (
                                              <div className="d-flex align-items-end justify-content-start mb-1">
                                                <img
                                                  className="border border-1 rounded-2 m-2 p-2 center-block"
                                                  style={{ width: "80%" }}
                                                  src={`${import.meta.env
                                                    .VITE_REACT_APP_URL
                                                    }/public/uploads/${message?.message}`}
                                                />
                                              </div>
                                            ) : message.type === "file" ? (
                                              <div className="message-box-start text-dark">
                                                <a
                                                  className="d-flex align-items-top text-decoration-none pb-2"
                                                  href="#"
                                                >
                                                  <i className="ai-file text-black display-6 mt-1 pe-1 me-2"></i>
                                                  <div className="order-sm-1 pe-sm-3 me-xl-4">
                                                    <p className="mb-1 st text-black">
                                                      <strong>
                                                        File : {message.message}
                                                      </strong>
                                                    </p>
                                                    <a
                                                      className="btn btn-link p-0"
                                                      href={`${import.meta.env
                                                        .VITE_REACT_APP_URL
                                                        }/public/uploads/${message?.message
                                                        }`}
                                                      target="_blank"
                                                      rel="Click to Download file"
                                                    >
                                                      Download{" "}
                                                      <i className="ai-download ms-2"></i>
                                                    </a>
                                                  </div>
                                                </a>
                                              </div>
                                            ) : (
                                              <div className="message-box-start text-dark">
                                                {message.message}
                                              </div>
                                            )}
                                          </div>
                                          <div className="fs-xs text-muted text-end">
                                            {getArticleUserInfo(message.sender).name}
                                            &nbsp;-
                                            &nbsp;
                                            <>
                                              {moment(message?.createdAt).format(
                                               "hh:mm A" 
                                              )}
                                            </>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div key={`messageItem-${index}`}>
                                        {previousDay !== currentDay ||
                                          index == 0 ? (
                                          <div className="text-muted text-center mb-4">
                                            {messageDate === today ? (
                                              "Today"
                                            ) : messageDate === yesterday ? (
                                              "Yesterday"
                                            ) : (
                                              <>
                                                {moment(message.createdAt).format("MMM DD, YYYY")}
                                              </>
                                            )}
                                          </div>
                                        ) : (
                                          ""
                                        )}
                                        {/* Message*/}
                                        <div
                                          className="ms-auto mb-3"
                                          style={{ maxWidth: 392 }}
                                        >
                                          <div className="d-flex align-items-end mb-1">
                                            {message.type === "image" ? (
                                              <div className="d-flex align-items-end justify-content-end mb-1">
                                                <img
                                                  className="border border-1 rounded-2 m-2 p-2 center-block"
                                                  style={{ width: "80%" }}
                                                  src={`${import.meta.env
                                                    .VITE_REACT_APP_URL
                                                    }/public/uploads/${message?.message}`}
                                                />
                                              </div>
                                            ) : message.type === "file" ? (
                                              <div className="message-box-end bg-primary text-white">
                                                <a
                                                  className="d-flex align-items-top text-decoration-none pb-2"
                                                  href="#"
                                                >
                                                  <i className="ai-file text-white display-6 mt-1 pe-1 me-2"></i>
                                                  <div className="order-sm-1 pe-sm-3 me-xl-4">
                                                    <p className="mb-1 fs-sm text-white">
                                                      <strong>
                                                        File : {message.message}
                                                      </strong>
                                                    </p>
                                                    <a
                                                      className="btn btn-link text-white p-0"
                                                      href={`${import.meta.env
                                                        .VITE_REACT_APP_URL
                                                        }/public/uploads/${message?.message
                                                        }`}
                                                      target="_blank"
                                                      rel="Click to Download file"
                                                    >
                                                      Download{" "}
                                                      <i className="ai-download ms-2"></i>
                                                    </a>
                                                  </div>
                                                </a>
                                              </div>
                                            ) : (
                                              <div className="message-box-end bg-primary text-white">
                                                {message.message}
                                              </div>
                                            )}
                                          </div>
                                          {/* message.lastMessageViewed!==null */}
                                          <div className="fs-xs text-muted d-flex align-items-end justify-content-end">
                                            {getArticleUserInfo(message.sender).name}
                                            &nbsp;-
                                            &nbsp;
                                            <span
                                              className="mr-3"
                                              format="hh:mm A "
                                            >
                                              {moment(message?.createdAt).format("hh:mm A ")}
                                            </span>
                                            &nbsp;
                                            <i
                                              className={`${isUserOnline(
                                                state?.activeChat?._id
                                              ) ||
                                                message.lastMessageViewed !==
                                                null
                                                ? "ai-checks"
                                                : "ai-check"
                                                }  text-${message.lastMessageViewed !==
                                                  null
                                                  ? "primary"
                                                  : "muted"
                                                } fs-xl mt-n1`}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                              </>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="simplebar-placeholder"
                      style={{ width: "auto", height: 800 }}
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
                        display: "block",
                      }}
                    />
                  </div>
                </div>
                {/* Footer (Textarea)*/}

                <form autoComplete="off" onSubmit={handleSubmit(sendReply)}>
                  <div className="card-footer w-100 border-0 mx-0 px-1">
                    <div className="d-flex align-items-end border rounded-3 pb-2 pe-3 mx-sm-2">
                      <input
                        type="text"
                        autoComplete="off"
                        onClick={handleClick}
                        onKeyDown={() => {
                          isTyping(true);
                        }}
                        onKeyUp={() => {
                          isTyping(false);
                        }}
                        {...register("message", { required: true })}
                        className="form-control border-0"
                        rows={3}
                        placeholder="Type a message"
                        style={{ resize: "none" }}
                        defaultValue={""}
                      // style={{ }}
                      />
                      <div className="nav flex-nowrap align-items-center">
                        <label htmlFor="upload-avatar-pic">
                          <div
                            htmlFor="upload-avatar-pic"
                            className="nav-link text-muted p-1 me-1 pointer"
                          >
                            <i className="ai-paperclip fs-xl" />
                            <input
                              id="upload-avatar-pic"
                              multiple
                              type="file"
                              hidden
                              onChange={handleImage}
                            />
                          </div>
                        </label>
                        <button
                          className="btn btn-sm btn-secondary ms-3"
                          type="submit"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                    <div className="d-flex align-items-end flex-wrap">
                      {uploadImage && uploadImage?.length
                        ? uploadImage?.map((image, index) => {
                          return (
                            <div
                              key={`input_upload_file_view_${index}`}
                              className="position-relative flex-shrink-0 my-1"
                            >
                              <img
                                className="border border-1 rounded-2 m-2 p-2 center-block"
                                style={{ height: "100px", width: "100px" }}
                                src={image?.preview ? image.preview : ""}
                              />
                              <span
                                className="position-absolute bottom-0 end-0 rounded-circle me-1 bg-primary btn-close"
                                style={{
                                  width: "0.625rem",
                                  height: "0.625rem",
                                }}
                                onClick={() => removeImage(image)}
                              />
                            </div>
                          );
                        })
                        : ""}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ArticleCommentDiscussionModel;
