/* eslint-disable */
import React, {
  useState,
} from "react";

import { useSelector } from "react-redux";
import moment from "moment";

import Modal from "../../../../components/Modal";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "axios";
import { config as mainConfig } from "../../../../config/config";
import { addCommentReply, getArticleCommentReplies } from "store/main/articles/actions";
import { getArticleUserInfo, getArticleUserTitle } from "helpers/globalHelpers";

const ArticleCommentReplyModel = ({ articleId }) => {
  const dispatch = useDispatch();
  const articleComment = useSelector((state) => state.article.commentReplies);
  const [uploadImage, setUploadImage] = useState([]);

  const today = moment()?.format("MM-DD-YYYY");
  const yesterday = moment().subtract(1, "days")?.format("MM-DD-YYYY");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    reValidateMode: "onChange",
  });

  const sendReply = (formData) => {
    if (uploadImage[0]?.preview !== "") {
      uploadImage &&
        uploadImage?.map((image) => {
          const appendForm = new FormData();
          appendForm.append("text", formData.text);
          appendForm.append("file", image.raw);
          appendForm.append("commentId", articleComment?._id);
          appendForm.append("articleId", articleId);

          const url =
            import.meta.env.VITE_REACT_APP_API_URL +
            `article/${articleId}/commentReplyAttachments`;
          axios
            .post(url, appendForm, {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                ...mainConfig.data().defaultHeaders,
                //   'Content-Type': 'multipart/form-data'
              },
            })
            .catch((error) => {
              console.error(error);
            });
        });
    }

    dispatch(
      addCommentReply({
        body: {
          "text": formData.text,
          "type": 'text',
          "commentId": articleComment?._id,
        },
        options: { id: articleId, btnLoader: true, __module: 'article', showToast: true },
      }));

    reset();
    setUploadImage([]);

    dispatch(getArticleCommentReplies({
      body: { commentId: articleComment?._id },
      options: { id: articleId, btnLoader: true, __module: 'article', showToast: false },
    }));
  }; // end function

  const handleImage = (e) => {
    if (e.target.files.length) {
      let images = uploadImage;
      for (let i = 0; i < e.target.files.length; i++) {
        images.push({
          preview: URL.createObjectURL(e.target.files[i]),
          raw: e.target.files[i],
        });
      }
      setUploadImage(images);
    }
  }; // end function
  
  const removeImage = (file) => {
    let images = uploadImage;
    images = images.filter(function (item) {
      return item.preview !== file.preview;
    });
    setUploadImage(images);
  }; // end function

  return (
    <Modal id={`showArticleCommentReplyModel`} className="modal-xl">
      <Modal.Header className="py-4">
        <h3 className="fs-5 mb-0 text-capitalized">
          <i className="ai-message text-primary lead pe-1 me-2" />
          Article comment replies
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
        <div className="card mb-4">
          <div className="card-body p-4">
            <figure>
              <blockquote className="blockquote m-0">
                <p className="text-sentence">{articleComment?.text} </p>
              </blockquote>
            </figure>
          </div>
        </div>
        <section
          className="container border-dashed border-2 rounded-3 p-2 mb-4"
          style={{
            overflowY: 'scroll',
            height: '50vh',
            maxHeight: '50vh',
            scrollBehavior: 'smooth',
          }}
          id="comments"
        >
          {
            articleComment?.replies?.map((repliesItem, index) => {

              let commentUserInfo = getArticleUserInfo(repliesItem.addBy);
              let commentUserTitle = getArticleUserTitle(repliesItem.addBy);
              
              const replyDate = moment(
                repliesItem.repliedAt
              )?.format("MM-DD-YYYY");

              return (
                <div className="d-flex align-items-top pb-1 mb-3">
                  <div className="rounded-circle bg-size-cover bg-position-center flex-shrink-0"
                    style={{
                      width: '48px',
                      height: '48px',
                      backgroundImage: `url(${(commentUserInfo?.file) ? `${import.meta.env.VITE_REACT_APP_URL}/public/uploads/profile/${commentUserInfo?.file}` : '/assets/img/avatar/user.png'})`
                    }}
                    alt="Comment author"
                  />
                  <div className="ps-3">
                    <h6 className="mb-0">{commentUserInfo?.name ?? "System User"}</h6>
                    {

                      repliesItem.type === "image" ? (
                        <>
                          <div className="d-flex align-items-end justify-content-start mb-1">
                            <img
                              className="border border-1 rounded-2 m-2 p-2 center-block"
                              style={{ width: "60%" }}
                              src={`${import.meta.env
                                .VITE_REACT_APP_URL
                                }/public/uploads/${repliesItem?.file}`}
                            />
                          </div>
                          <div className="fs-xs text-muted">
                            {repliesItem?.text}
                          </div>
                        </>
                      ) : repliesItem.type === "file" ? (
                        <div className="message-box-start text-dark">
                          <a
                            className="d-flex align-items-top text-decoration-none pb-2"
                            href="#"
                          >
                            <i className="ai-file text-black display-6 mt-1 pe-1 me-2"></i>
                            <div className="order-sm-1 pe-sm-3 me-xl-4">
                              <p className="mb-1 st text-black">
                                <strong>
                                  {repliesItem.text}
                                </strong>
                              </p>
                              <div className="fs-xs text-muted">
                                File: {repliesItem?.file}
                              </div>
                              <a
                                className="btn btn-link p-0"
                                href={`${import.meta.env.VITE_REACT_APP_URL}/public/uploads/${repliesItem?.file}`}
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
                          {repliesItem.text}
                        </div>
                      )
                    }
                    <span className="fs-sm text-muted">{commentUserTitle} -{` `}
                      {replyDate === today ? (
                        "Today"
                      ) : replyDate === yesterday ? (
                        "Yesterday"
                      ) : (
                        <>
                          {moment(repliesItem.repliedAt).format("MM-DD-YYYY")}
                        </>
                      )}
                    </span>
                  </div>
                </div>
              );

            })
          }
        </section>
        {/* Footer (Textarea)*/}
        <form autoComplete="off" onSubmit={handleSubmit(sendReply)}>
          <div className="card-footer w-100 border-0 mx-0 pb-4">
            <div className="d-flex align-items-center border rounded-3">
              <input
                type="text"
                autoComplete="off"
                {...register("text", { required: true })}
                className="form-control border-0"
                rows={3}
                placeholder="Type a text"
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
                  className="btn btn-sm btn-secondary m-2"
                  type="submit"
                >
                  Send
                </button>
              </div>
            </div>
            <div className="d-flex align-items-center flex-wrap">
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

      </Modal.Body>
    </Modal>
  );
};

export default ArticleCommentReplyModel;
