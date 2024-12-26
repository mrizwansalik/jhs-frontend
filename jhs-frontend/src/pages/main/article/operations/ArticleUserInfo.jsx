/* eslint-disable */
import React from 'react';

const ArticleUserInfo = ({ userID }) => {

        let userInformation;

        const authorList = useSelector((state) => state.article.singleAuthorList);
        const editorList = useSelector((state) => state.article.singleEditorList);
        const reviewerList = useSelector((state) => state.article.singleReviewerList);

        if (authorList.filter(e => e.id === userID).length > 0) {
                userInformation = authorList.find((obj) => {
                        return obj.id === userID;
                });
        }
        if (editorList.filter(e => e.id === userID).length > 0) {
                userInformation = editorList.find((obj) => {
                        return obj.id === userID;
                });
        }
        if (reviewerList.filter(e => e.id === userID).length > 0) {
                userInformation = reviewerList.find((obj) => {
                        return obj.id === userID;
                });
        }

        return userInformation;
};

export default ArticleUserInfo;