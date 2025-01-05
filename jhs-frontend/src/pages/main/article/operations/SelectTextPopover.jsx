
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import HighlightPopover from 'components/Popover/HighlightPopover';
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

        const handleHover = (event) => {
            console.log(event);
        }

        documentSelectWithId.addEventListener('mouseup', handleSelection);
        document.addEventListener('hover', handleHover);

        return () => {
            document.addEventListener('hover', handleHover);
            documentSelectWithId.removeEventListener('mouseup', handleSelection);
        };
    }, []);

    return (
        <>
            {showPopover && (
                <HighlightPopover id='selectTextPopover' top={popoverPosition.top} left={popoverPosition.left}>
                    <button type="button" className="btn" style={{ background: 'transparent', border: 'none', padding: '0px' }} onClick={() => {
                        setShowPopover(false);
                        toggleModal('#addCommentModel')
                    }}>
                        <FontAwesomeIcon icon={faPencil} />
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