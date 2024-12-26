/* eslint-disable react/no-array-index-key */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const Toasts = () => {
    const toasts = useSelector((state) => state.toasts);
    useEffect(() => {
        if (toasts?.length) {
            const toastElList = [].slice.call(document.querySelectorAll('.toast'));
            const toastList = toastElList.map((toast) => {
                return new window.bootstrap.Toast(toast);
            });
            toastList.forEach((toast) => toast.show());
        }
    }, [toasts.length]);
    return (
        
        <div className="toast-container position-fixed top-0 end-0 mt-4 me-5">
        {toasts && toasts.length
                ? toasts.map((toast, index) => {
                    return (
                    
                        <div id={`mytoast-${index}`}  key={`mytoast-${index}`} className="toast" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false">
                        <div className={`toast-header bg-${toast.type} text-white`}>
                            <i className="ai-bell fs-lg me-2" />
                            <span className="fw-medium me-auto">  {toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}!</span>
                            <button type="button" className="btn-close btn-close-white ms-2" data-bs-dismiss="toast" aria-label="Close" />
                        </div>
                        <div className={`toast-body text-${toast.type}`}>{toast.message}</div>
                    </div>
                        
                        
                    );
                })
                : ''}
        </div>
    );
};

export default Toasts;
