/* eslint-disable */
import { store } from "../store";
import { logout } from "../store/auth/actions";
import { createToasts } from "../store/notifications/actions";
import { setLoading, setBtnLoading, setComponentLoading } from "../store/general/actions";
import { setFormErrors } from "../store/form/actions";
import { History } from "../routes/NavigationSetter";
import moment from "moment";

import { useGeolocated } from "react-geolocated";

import('@citation-js/plugin-enw');
import('@citation-js/plugin-refworks');
import('@citation-js/plugin-ris');
import('@citation-js/plugin-bibtex');

import { Cite } from "@citation-js/core";
import { Diff, diff_match_patch } from 'diff-match-patch';
import 'diff-match-patch-line-and-word'; // import globally to  enhanse the class.

export const setIsLoading = (value) => {
  store.dispatch(setLoading(value));
};

export const setformErrors = (errors = []) => {
  store.dispatch(setFormErrors(errors));
};
export const setGeneralErr = (errors = '') => {
  store.dispatch({ type: 'SET_ERR_RESPONSE', payload: errors });
};

export const setComponentIsLoading = (value) => {
  store.dispatch(setComponentLoading(value));
};

export const setbtnLoader = (value) => {
  store.dispatch(setBtnLoading(value));
};

export const setToast = (toast) => {
  store.dispatch(createToasts(toast));
};

export const setUpToast = (resp) => {
  let type = null;
  if (resp && resp.status >= 200 && resp.status < 300) type = "success";
  else if (resp.status >= 400 && resp.status < 500) type = "warning";
  else if (resp.status >= 500) type = "error";
  else type = "error";
  return {
    type,
    message: resp.data.message,
    // position: "right_btm",
  };
};

export const logOutUser = (resp) => {
  store.dispatch(logout());
  History.navigate("/login");
  return true;
};

export const setResponse = (resp) => {
  let response = null;
  if (resp?.status === 401) {
    store.dispatch(logout());
    History.navigate("/login");
    response = { data: { data: null, paginationData: null }, status: 0 };
  } else if (resp?.status === 422) {
    store.dispatch(setformErrors(resp));
  } else {
    response = { ...resp?.data, code: resp?.status };
  }

  return response;
};

export const getUrl = (slug) => {
  const url = "/";
  if (!slug) return url;
  const endPoints = {};
  const localUrl = endPoints[slug];
  if (!localUrl) return url;
  return url + localUrl;
};

export const getModulePrefix = (endpoint = "", module = "") => {
  if (module === "home") return `${module}/${endpoint}`;

  if (module === "auth") return `${module}/${endpoint}`;
  if (module === "profile") return `${module}/${endpoint}`;
  if (module === "user") return `${module}/${endpoint}`;
  if (module === "permission") return `${module}/${endpoint}`;
  if (module === "role") return `${module}/${endpoint}`;
  if (module === "services") return `${module}/${endpoint}`;
  if (module === "invoice") return `${module}/${endpoint}`;
  if (module === "journal") return `${module}/${endpoint}`;
  if (module === "company") return `${module}/${endpoint}`;
  if (module === "department") return `${module}/${endpoint}`;
  if (module === "category") return `${module}/${endpoint}`;
  if (module === "articleStatus") return `${module}/${endpoint}`;
  if (module === "articleMeta") return `${module}/${endpoint}`;
  if (module === "articleType") return `${module}/${endpoint}`;
  if (module === "article") return `${module}/${endpoint}`;
  if (module === "articlePublished") return `${module}/${endpoint}`;
  if (module === "articleRevision") return `${module}/${endpoint}`;
  if (module === "articleLanguageCorrection") return `${module}/${endpoint}`;
  if (module === "task") return `${module}/${endpoint}`;
  if (module === "articleProcessing") return `${module}/${endpoint}`;
  if (module === "author") return `${module}/${endpoint}`;
  if (module === "chat") return `${module}/${endpoint}`;
  if (module === "notifications") return `ns/${endpoint}`;
  return endpoint;
};

export const toggleModal = (id) => {
  const myModalEl = document.querySelector(id);
  const modal = window.bootstrap.Modal.getOrCreateInstance(myModalEl);
  modal.toggle();
};
export const togglePopover = (id) => {
  const myPopoverEl = document.querySelector(id);
  const popover = window.bootstrap.Popover.getOrCreateInstance(myPopoverEl);
  //console.log(popover);
  popover.toggle();
};

export const num = (number = 0.0, fix = 8) =>
  Number(number).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: fix,
  });

export const formateNum = (number = 0.0, fix = 8) =>
  Number(number).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: fix,
  });

export const convertDateTime = (dateTime, returnType = "dateTime") => {
  // {'date', 'dateTime'}
  if (!dateTime) return;
  const createdDate = new Date(dateTime);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const year = createdDate.getFullYear();
  const month = months[createdDate.getMonth()];
  const date = createdDate.getDate();
  const hour = createdDate.getHours();
  const min = createdDate.getMinutes();
  const sec = createdDate.getSeconds();
  let time = null;
  if (returnType === "dateTime") {
    time = `${date},${month} ${year} ${hour}:${min}:${sec}`;
  } else {
    time = `${date}-${month}-${year}`;
  }
  return time;
};

export const fixedDecimalValues = (value) => {
  if (!value === 0) return value.toFixed(7);
  return value;
};

export const copyToClipboard = (id, selector) => {
  const copyText = document.getElementById(id);
  document.querySelector(`#${selector} > span.custom-tooltip`).style.display =
    "inline";
  navigator.clipboard.writeText(copyText.innerHTML);
  setTimeout(function () {
    document.querySelector(`#${selector} > span.custom-tooltip`).style.display =
      "none";
  }, 1000);

  // ------------ add span tag in code to show tooltip + make its parent postion relative -------------
  //          <span id="custom-tooltip">copied!</span>
  // ------------ add span tag in code to show tooltip + make its parent postion relative -------------
};

const countDecimals = (value) => {
  if (Math.floor(value) === value) return 0;
  return value.toString().split(".")[1].length || 0;
};

export const percentage = (percent, total) => {
  return (percent / 100) * total;
};

export const checkFeaturePermission = (feature) => {
  const permissions = store?.getState()?.profile?.role;
  return permissions?.includes(feature);
};

export const checkArticleManagerPermission = (feature) => {
  const articleInfo = store?.getState()?.article?.single;
  const profileInfo = store?.getState()?.profile?.profile;

  if (articleInfo?.managedBy == profileInfo?._id) {
    return true;
  }

  let reviewerList = articleInfo?.reviewerList ?? [];
  let authorList = articleInfo?.authorList ?? [];
  let editorList = articleInfo?.editors ?? [];

  let users = reviewerList.concat(authorList);
  users = users.concat(editorList);
  users.push(articleInfo?._author);

  if (users.includes(profileInfo?._id)) {
    return false;
  }

  const permissions = store?.getState()?.profile?.role;
  return permissions?.includes(feature);
};

export const checkArticleEditorPermission = (feature) => {
  const articleInfo = store?.getState()?.article?.single;
  const profileInfo = store?.getState()?.profile?.profile;

  let editors = articleInfo?.editors ?? [];

  return editors.includes(profileInfo?._id);
};

export const checkArticleReviewerPermission = (feature) => {
  const articleInfo = store?.getState()?.article?.single;
  const profileInfo = store?.getState()?.profile?.profile;

  let reviewerList = articleInfo.reviewerList;
  return reviewerList.includes(profileInfo?._id);
};

export const checkArticleAuthorPermission = (feature) => {
  const articleInfo = store?.getState()?.article?.single;
  const profileInfo = store?.getState()?.profile?.profile;

  let authorList = articleInfo?.authorList ?? [];
  authorList.push(articleInfo?._author);

  return authorList.includes(profileInfo?._id);
};

export const checkAdministration = () => {
  const role = store?.getState()?.profile;
  return role?.profile?.role === "administration";
};

export const isUserOnline = (userId) => {
  const connectedUsers = store?.getState()?.chat?.connectedUsers;
  if (connectedUsers?.some((user) => user === userId)) {
    return true;
  } else {
    return false;
  } // end else
};

export const userLastSeenDateTime = (date) => {
  if (date === null || date === "") return "";

  const today = moment()?.format("MM-DD-YYYY");
  const yesterday = moment()?.subtract(1, "days").format("MM-DD-YYYY");
  let incomingDate = moment(date)?.format("MM-DD-YYYY");
  if (incomingDate === today) {
    return `Last seen Today at ${moment(date)?.format("hh:mm A")}`;
  } // end if
  if (incomingDate === yesterday) {
    return `Last seen Yesterday at ${moment(date)?.format("hh:mm A")}`;
  } else {
    return `Last seen ${moment(date)?.format("MMM DD, YYYY hh:mm A")}`;
  } // end else
};

export const setGeoLocation = () => {
  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
  });

  return coords;
};

export const getArticleUserInfo = (userId) => {
  let userInformation;

  const authorList = store?.getState()?.article?.singleAuthorList;
  const editorList = store?.getState()?.article?.singleEditorList;
  const reviewerList = store?.getState()?.article?.singleReviewerList;

  if (authorList.find((item) => item.id === userId)) {
    userInformation = authorList.find((item) => item.id === userId);
  } // end if
  if (editorList.find((item) => item.id === userId)) {
    userInformation = editorList.find((item) => item.id === userId);
  } // end if
  if (reviewerList.find((item) => item.id === userId)) {
    userInformation = reviewerList.find((item) => item.id === userId);
  } // end if

  return userInformation;
};

export const getArticleUserTitle = (userId) => {
  let userInformation = "Editor";

  const authorList = store?.getState()?.article?.singleAuthorList;
  const editorList = store?.getState()?.article?.singleEditorList;
  const reviewerList = store?.getState()?.article?.singleReviewerList;

  if (authorList.find((item) => item.id === userId)) {
    userInformation = "Author";
  } // end if
  if (editorList.find((item) => item.id === userId)) {
    userInformation = "Editor";
  } // end if
  if (reviewerList.find((item) => item.id === userId)) {
    userInformation = "Reviewer";
  } // end if

  return userInformation;
};

export const getCitation = async (reference) => {

  const referenceData = {
    id: "JOHS2021000329",
    "citation-key": "JOHS2021000329",
    author: reference?.authors,
    page: reference?.pages,
    volume: reference?.volume,
    issue: reference?.issue,
    year: reference?.year,
    'container-title': reference?.journal,
    title: reference?.title,
    issued: reference?.issued,
    type: reference?.type,
    DOI: reference?.doi,
    ISSN: reference?.issn,
    URL: reference?.url
  }


  const data = await Cite.async(referenceData);

  var citation = data.format('bibliography', {
    format: "text"
  });

  return citation;
};

export const calculateChanges = (oldContent, newContent) => {
  const diff = new diff_match_patch();

  const diffResult = diff.diff_main(oldContent, newContent);
  diff.diff_cleanupSemantic(diffResult);

  const html = [];

  diffResult?.forEach((part) => {
    let classInfo = part[0] === 0 ? 'noChange' : (part[0] === -1 ? 'highlightRemoved' : 'highlightAdded');
    html.push(`<span class="change ${classInfo}">${part[1]}</span>`)
  });

  return html.join('');
};
