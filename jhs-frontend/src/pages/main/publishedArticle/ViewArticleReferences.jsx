/* eslint-disable */
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const ViewArticleReferences = () => {
    const singleReferencesTextList = useSelector((state) => state.home.singleReferencesTextList);
    return (
        <>
            {
                <span
                    style={{
                        textAlign: "justify",
                        textJustify: "inter-word",
                    }}
                    dangerouslySetInnerHTML={{
                        __html: singleReferencesTextList,
                    }}
                />
            }
        </>
    );
};

export default ViewArticleReferences;
