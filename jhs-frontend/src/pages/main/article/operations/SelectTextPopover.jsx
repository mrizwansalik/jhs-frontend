
import React, { useEffect, useRef, useState } from "react";

import Popover from 'components/Popover';
import { toggleModal } from "helpers/globalHelpers";

const SelectTextPopover = ({ children, id = 'SelectTextPopoverData', setSelectedCategory, setSelectedText}) => {
    const [showPopover, setShowPopover] = useState(false);
    // const [selectedText, setSelectedText] = useState('');
    const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

    const popoverRef = useRef(null);

    useEffect(() => {
        const documentSelectWithId = document.getElementById(id)
        const handleSelection = () => {
            const selection = window.getSelection();
            const selectedText = selection.toString().trim();
            if (selectedText !== '') {
                const range = selection.getRangeAt(0);
                const selectedNode = range.startContainer;
                const selectedElement = selectedNode.nodeType === Node.ELEMENT_NODE
                    ? selectedNode
                    : selectedNode.parentElement;

                const startOffset = range.startOffset;
                const endOffset = range.endOffset;
                const elementWithId = selectedElement.closest('[id]'); // Finds the nearest element with an ID

                if (elementWithId) {
                    let selectedArea = elementWithId.id;
                    setSelectedCategory({selectedArea, startOffset, endOffset});

                }
                const rect = range.getBoundingClientRect();

                setPopoverPosition({
                    top: rect.top + window.pageYOffset + rect.height, // Adjust position for popover
                    left: rect.left + window.pageXOffset + rect.width / 2,
                });

                setSelectedText(selectedText);
                setShowPopover(true);
            } else {
                setShowPopover(false);
            }
        };

        documentSelectWithId.addEventListener('mouseup', handleSelection);

        return () => {
            documentSelectWithId.removeEventListener('mouseup', handleSelection);
        };
    }, []);

    return (
        <>
            {showPopover && (
                <Popover id='selectTextPopover' top={popoverPosition.top} left={popoverPosition.left}>
                <div class="container mt-5" >
                <div class="toolbar">
                    <i class="fas fa-pencil-alt" onClick={() => {
                        setShowPopover(false);
                        toggleModal('#addCommentModel')
                     }}></i>
                </div></div></Popover>
                // <Popover id='selectTextPopover' top={popoverPosition.top} left={popoverPosition.left}>
                //     <p>Add comment for discussion</p>
                //     <button type="button" className="btn btn-success mb-2 me-2" onClick={() => {
                //         setShowPopover(false);
                //         toggleModal('#addCommentModel')
                //     }}>
                //         <i className="ai-message me-2" /> Add Comment
                //     </button>
                // </Popover>
            )}
            <div ref={popoverRef} id={id}>
                {children}
            </div>
        </>
    );
};

export default SelectTextPopover;