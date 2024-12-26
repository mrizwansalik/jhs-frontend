//*Dropzone.js*//

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

function Dropzone({ handleImage }) {
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
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif']
        },
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
            handleImage(acceptedFiles.map(file => Object.assign(file)));
        }
    });
    const img = acceptedFiles.map(file => (
        <img key={file.name} alt={file.name} className='single-file-image' src={URL.createObjectURL(file)} />
    ));

    return (
        <div {...getRootProps({ className: 'dropzone' })}>
            <input id="fileInput" className="input-zone" {...getInputProps()} />
            {
                files.length ? (
                    img
                ) : (
                    <div className="text-center p-5 card card-lifted shadow py-5">
                        <div className="dropzone-content py-5">
                            <div className="media-uploader-content">
                                <p className="reg">
                                    JOHS supports <strong>PNG</strong>, <strong>JPEG</strong> file types. <br />
                                    Our recommended figure size is at least 1600 pixels wide. <br />
                                    View <a href="#" > figure formatting tools </a>
                                </p>
                                <div className="fs-xl pb-2 mb-3 mb-lg-4">
                                    <i className="h1 text-nav fw-large ai-cloud-upload pt-1" /> Drag & Drop Figure here or select from computer
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Dropzone;