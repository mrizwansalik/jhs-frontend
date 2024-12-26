/* eslint-disable consistent-return */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const Loading = () => {
    // Data
    const general = useSelector((state) => state.general);

    // Hooks
    useEffect(() => {}, []);

    // Functions

    // JSX

    const showLoading = () => {
        if (general?.isLoading) {
            return (
                <div className="overlay_bg">
                    <div className="loading">
                        <lottie-player
                            style={{ width: '150px', height: '150px' }}
                            src="https://assets6.lottiefiles.com/private_files/lf30_3xla8fsn.json"
                            background="transparent"
                            speed={1}
                            className="animation-box"
                            autoPlay="true"
                            loop="true"
                        />
                    </div>
                </div>
            );
        }
    };
    return <>{showLoading()}</>;
};

export default Loading;
