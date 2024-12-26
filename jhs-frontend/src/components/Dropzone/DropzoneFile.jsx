//*Dropzone.js*//

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

function DropzoneFile({ handlePDF }) {
    // ** State
    const [files, setFiles] = useState([])

    // ** Hooks
    const {
        getRootProps,
        getInputProps,
        acceptedFiles, // Ref to the `<div>`
        inputRef // Ref to the `<input>`
    } = useDropzone({
        multiple: false,
        accept: 'application/pdf',
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles);
            handlePDF(acceptedFiles.map(file => Object.assign(file)));
        }
    });
    const img = acceptedFiles.map(file => (
        file.path
    ));

    return (
        <div {...getRootProps({ className: 'dropzone' })}>
            <input id="fileInput" className="input-zone" {...getInputProps()} />
            {
                files.length ? (
                    <a
                        className="card card card-lifted border-1 h-100 text-decoration-none"
                        href="#"
                    >
                        <div className="card-body">
                            <i className="display-4 card-title mt-0 ai-file-text"></i>
                            <h3 className="h4 card-title mt-0">PDF File For Article</h3>
                            <p className="card-text mt-0">
                               {img} .
                            </p>
                        </div>
                    </a>

                ) : (
                    <div className="text-center p-5 card card-lifted shadow py-5">
                        <div className="dropzone-content py-5">
                            <div className="media-uploader-content">
                                <p className="reg">
                                    JOHS supports <strong>PDF</strong> file types. <br />
                                </p>
                                <div className="fs-xl pb-2 mb-3 mb-lg-4">
                                    <i className="h1 text-nav fw-large ai-cloud-upload pt-1" /> Drag & Drop PDF here or select from computer
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default DropzoneFile;