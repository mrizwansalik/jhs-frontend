import { getHighlightColorById } from "helpers";
import { getArticleUserInfo } from "helpers/globalHelpers";
import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import ArticleCommentActions from "./processing/ArticleCommentActions";

const BlogWithOverlayHighlight = ({ children }) => {
  const [highlightBoxes, setHighlightBoxes] = useState([]);
  const [hoveredBox, setHoveredBox] = useState(null); // Track which box is hovered
  const comments = useSelector((state) => state.article.comments);

  const blogRef = useRef();

  useEffect(() => {
    if (!comments || comments.length === 0) return;

    const highlights = comments.map((comment) => {
      const commentUserInfo = getArticleUserInfo(comment.addBy);
      return {
        _id: comment._id,
        highlight: comment.highlight,
        text: comment.text, // Text to display in the tooltip
        startOffset: comment.startOffset,
        endOffset: comment.endOffset,
        forArea: comment.forArea,
        color: getHighlightColorById(comment.addBy)?.background,
        borderColor: getHighlightColorById(comment.addBy)?.borderColor,
        ...commentUserInfo,
      };
    });

    setHighlightBoxes(highlights);
    handleHighlight(highlights);
  }, [comments]);

  const escapeRegex = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const handleHighlight = (terms) => {
    if (!terms || terms.length === 0) {
      setHighlightBoxes([]);
      return;
    }

    const blogContainer = blogRef.current;
    if (!blogContainer) return;

    const textNodes = [];
    const boxes = [];

    const walker = document.createTreeWalker(
      blogContainer,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node);
    }

    let currentOffset = 0; // Track the overall offset in the content
    textNodes.forEach((node) => {
      const nodeStart = currentOffset;
      const nodeEnd = currentOffset + node.nodeValue.length;

      terms.forEach((term) => {
        if (term.startOffset >= nodeStart && term.endOffset <= nodeEnd) {
          // Term fully contained in this node
          const range = document.createRange();
          range.setStart(node, term.startOffset - nodeStart);
          range.setEnd(node, term.endOffset - nodeStart);

          const rects = range.getClientRects();
          for (let rect of rects) {
            const containerRect = blogContainer.getBoundingClientRect();

            boxes.push({
              top: rect.top - containerRect.top,
              left: rect.left - containerRect.left,
              width: rect.width,
              height: rect.height,
              color: term.color, // Highlight color
              borderColor: term.borderColor, // Border color
              text: term.text, // Tooltip text
              name: term.name,
              ...term,
            });
          }
        }
      });

      currentOffset += node.nodeValue.length;
    });

    setHighlightBoxes(boxes);
  };

  return (
    <div style={{ position: "relative" }}>
      {highlightBoxes.map((box, index) => (
        <div
          key={index}
          className="highlight-overlay"
          style={{
            position: "absolute",
            top: box.top,
            left: box.left,
            width: box.width,
            height: box.height,
            backgroundColor: box.color,
            borderTop: `2px solid ${box.borderColor}`,
            borderBottom: `2px solid ${box.borderColor}`,
            pointerEvents: "all", // Allow hover events
            zIndex: 10,
          }}
          onMouseEnter={() => setHoveredBox(box)} // Track hover start
          onMouseLeave={() => setHoveredBox(null)} // Track hover end
        />
      ))}
      {/* Render comment box dynamically */}
      {hoveredBox && commentBox(hoveredBox)}

      <div
        ref={blogRef}
        style={{
          position: "relative",
          lineHeight: "1.6",
          fontSize: "18px",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default BlogWithOverlayHighlight;

const commentBox = (commentItem) => (
  <div
   //  className="accordion-item shadow border-1 bg-white"
    className="comment-box"
    style={{
       position: "absolute",
       top: commentItem.top + commentItem.height + 5, // Position below the highlight
       left: commentItem.left,
       backgroundColor: "white",
       border: `1px solid ${commentItem.borderColor}`,
       borderRadius: "4px",
       padding: "8px",
       boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
       zIndex: 20,
    }}
  >
    <h3 className="accordion-header" id={"commentItemInfo"}>
      <button
        className="accordion-button"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target={"#collapseCommentItemInfo"}
        aria-expanded="true"
        aria-controls={"collapseCommentItemInfo"}
      >
        <div className="d-flex align-items-top pb-0 mb-0">
          <div
            className="rounded-circle bg-size-cover bg-position-center flex-shrink-0"
            style={{
              border: `3px solid ${
                getHighlightColorById(commentItem.addBy)?.borderColor
              }`, // Use dynamic border color from the function
              width: "48px", // Adjust width for larger size
              height: "48px", // Adjust height to match width
              padding: "8px", // Padding to create distance between border and image
              backgroundImage: `url(${
                commentItem?.file
                  ? `${
                      import.meta.env.VITE_REACT_APP_URL
                    }/public/uploads/profile/${commentItem.file}`
                  : "/assets/img/avatar/user.png"
              })`,
              backgroundSize: "cover", // Ensure image covers the area
              backgroundPosition: "center", // Center the image
              boxShadow: `0 8px 13px ${
                getHighlightColorById(commentItem.addBy)?.background
              }`, // Add a shadow based on border color
            }}
            alt="Comment author"
          />

          <div className="ps-3">
            <h6 className="mb-0">{commentItem?.name ?? "System User"}</h6>
            <span className="fs-sm text-muted mb-0">
              {commentItem.commenterType}
            </span>
          </div>
        </div>
      </button>
    </h3>

        <div className="row mt-sm-n1 mb-0">
          <div className="col-11">
            <p
              className="pb-2 mb-0 text-break lh-base"
              style={{ textJustify: "inter-word" }}
            >
              {commentItem.text}
            </p>
          </div>
          <div className="col-1">
            <div className="d-flex flex-row-reverse mt-sm-n1 pt-2 mb-0 mb-lg-1 mb-xl-3">
              <a
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="fas fa-ellipsis-v" />
              </a>
              <div className="dropdown dropdown-menu dropdown-menu-end my-1">
                <button
                  className="dropdown-item"
                  //   onClick={() => {
                  //     articleCommentRepliesHandler(
                  //       commentItem._id
                  //     );
                  //   }}
                >
                  <i className="ai-dashboard me-2"></i> Show Comment Discussion
                </button>
                <ArticleCommentActions
            //   socket={socketSession}
              articleId={commentItem?._id}
              article={commentItem}
              comment={commentItem}
              ActionType="dropdown-item"
            />
              </div>
            </div>
          </div>
        </div>
    
  </div>
);
