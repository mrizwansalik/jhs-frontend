
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/free-solid-svg-icons'
import HighlightPopover from 'components/Popover/HighlightPopover';
import { toggleModal } from "helpers/globalHelpers";

const SelectTextPopover = ({ children, id = 'SelectTextPopoverData', setSelectedCategory, setSelectedText}) => {
    const [showPopover, setShowPopover] = useState(false);
    // const [selectedText, setSelectedText] = useState('');
    const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

    const popoverRef = useRef(null);
    console.log(id);
    // useEffect(() => {
    //     const documentSelectWithId = document.getElementById(id)
    //     const handleSelection = (e) => {
    //         e.stopPropagation();
    //         const selection = window.getSelection();
    //         const selectedText = selection.toString().trim();
    //         if (selectedText !== '') {
    //             const range = selection.getRangeAt(0);
    //             const selectedNode = range.startContainer;
    //             const selectedElement = selectedNode.nodeType === Node.ELEMENT_NODE
    //                 ? selectedNode
    //                 : selectedNode.parentElement;

    //             const startOffset = range.startOffset;
    //             const endOffset = range.endOffset;
    //             const elementWithId = selectedElement.closest('[id]'); // Finds the nearest element with an ID
    //             console.assert(startOffset, endOffset, 'No element with ID found');
    //             if (elementWithId) {
    //                 let selectedArea = elementWithId.id;
    //                 setSelectedCategory({selectedArea, startOffset, endOffset});

    //             }
    //             const rect = range.getBoundingClientRect();

    //             setPopoverPosition({
    //                 top: rect.top + window.pageYOffset -60, // Adjust position for popover
    //                 left: rect.left + window.pageXOffset + (rect.width / 2) - 20, // Adjust position for popover
    //             });

    //             setSelectedText(selectedText);
    //             setShowPopover(true);
    //         } else {
    //             setShowPopover(false);
    //         }
    //     };

    //     const handleHover = (event) => {
    //         console.log(event.target)
    //         if (event.target.tagName === 'path' || event.target.className.includes('popover-body')) {
    //             return true;
    //         }
    //         setShowPopover(false);
    //     }

    //     documentSelectWithId.addEventListener('mouseup', handleSelection);
    //     document.addEventListener('mouseup', handleHover);

    //     return () => {
    //         document.addEventListener('mouseup', handleHover);
    //         documentSelectWithId.removeEventListener('mouseup', handleSelection);
    //     };
    // }, []);

    useEffect(() => {
        const documentSelectWithId = document.getElementById(id);
        const handleSelection = (e) => {
            e.stopPropagation();
            const selection = window.getSelection();
            const selectedText = selection.toString().trim();
            if (selectedText !== '') {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
    
                // For better positioning, calculate the start and end positions
                const startOffset = rect.left;
                const endOffset = rect.right;
    
                const selectedNode = range.startContainer;
                const selectedElement = selectedNode.nodeType === Node.ELEMENT_NODE
                    ? selectedNode
                    : selectedNode.parentElement;
    
                // Find the element containing the selected text (with an ID)
                const elementWithId = selectedElement.closest('[id]');
                if (elementWithId) {
                    let selectedArea = elementWithId.id;
                    setSelectedCategory({selectedArea, startOffset, endOffset});
                }
    
                setPopoverPosition({
                    top: rect.top + window.pageYOffset -60, // Adjust position for popover
                    left: rect.left + window.pageXOffset + (rect.width / 2) - 20, // Adjust position for popover
                });

                setSelectedText(selectedText);
                setShowPopover(true);
            } else {
                setShowPopover(false);
            }
        };
    
        const handleHover = (event) => {
            if (event.target.tagName === 'path' || event.target.className.includes('popover-body')) {
                return true;
            }
            setShowPopover(false);
        }
    
        documentSelectWithId.addEventListener('mouseup', handleSelection);
        document.addEventListener('mouseup', handleHover);
    
        return () => {
            document.removeEventListener('mouseup', handleHover);
            documentSelectWithId.removeEventListener('mouseup', handleSelection);
        };
    }, []);
    
    return (
        <>
            {showPopover && (
                <HighlightPopover id='selectTextPopover' top={popoverPosition.top} left={popoverPosition.left}>
                    <button type="button" className="btn btn-highlight-button" style={{ background: 'transparent', border: 'none', padding: '0px' }} onClick={() => {
                        setShowPopover(false);
                        toggleModal('#addCommentModel')
                    }}>
                        <FontAwesomeIcon icon={faComment} size="lg" style={{ color: 'white' }} />
                    </button>
                </HighlightPopover>
            )}
            <div ref={popoverRef} id={id}>
                {children}
            </div>
        </>
    );
};

export default SelectTextPopover;