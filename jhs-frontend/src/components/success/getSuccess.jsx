/* eslint-disable */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAccountTypes } from '../../store/transfer/actions';
import { convertDateTime } from '../../helpers/globalHelpers';
const GetSuccess = ({ transferAmount, changingStatus }) => {
    const dispatch = useDispatch();
    const transferData = useSelector((state) => state.transfer);

    useEffect(() => {
        dispatch(
            fetchAccountTypes({
                body: {},
                options: { loader: false, __module: 'banking-engine' },
            })
        );
    }, []);

    const handleDone = () => {
        changingStatus(false);
    };

    return (
        <>
            <div className="col-md-7">
                <div className="row d-flex">
                    <div className="col-md-6 col-6">
                        <h2 className="fs-3 p-color mt-5 f-bold">Confirm Transfer</h2>
                    </div>
                    <div className="col-md-6 col-6 text-end">
                        <button className="btn-deposit rad-5 p-3 mt-4">
                            <img className="me-3" src="/assets/images/share-icon.svg" />
                            Share
                        </button>
                    </div>
                </div>
                <div className="d-flex flex-column justify-content-center align-items-center mt-5">
                    <lottie-player
                        src="https://assets3.lottiefiles.com/packages/lf20_behmvekz.json"
                        background="transparent"
                        speed={1}
                        style={{ width: '130px', height: '130px' }}
                        loop
                        autoPlay
                    />
                    <p className="fs-3 fw-bold mt-5 mb-5">Transfer Successful !</p>
                </div>
                <div className="dark-gray-bg rad-3 p-4 mt-5">
                    <div className="d-flex">
                        <img className="border-icon" src="/assets//images/bitcoin-icon.png" />
                        <div className="mt-2 ms-3">
                            <span className="fs-4 fw-bold">{transferAmount} USDT</span>
                            <p className="fs-5 mt-2">Transfered in your wallet</p>
                        </div>
                    </div>
                    <div className="mt-4 light-gray-bg rad-3 p-3">
                        <div className="row w-100 bor-btm">
                            <div className="col-6 d-flex align-items-center pb-3">
                                <p className="fs-5">Transaction ID</p>
                            </div>
                            <div className="col-6 d-flex align-items-center justify-content-end pb-3 pointer">
                                <p id="transactionId" className="pe-4 fs-5">
                                    {transferData?.successTransfer?.transaction?.transactionId}
                                </p>
                                <img className="img-fluid" src="/assets/images/copy-2.svg" />
                            </div>
                        </div>
                        <div className="row w-100 bor-btm mt-3">
                            <div className="col-6 d-flex align-items-center pb-3">
                                <p className="fs-5">Transaction Date</p>
                            </div>
                            <div className="col-6 d-flex align-items-center justify-content-end pb-3">
                                <p className="fs-5">{convertDateTime(transferData?.successTransfer?.transaction?.transactionTime)}</p>
                            </div>
                        </div>
                        <div className="row w-100 mt-3">
                            <div className="col-6 d-flex align-items-center pb-3">
                                <p className="fs-5">Payment Status</p>
                            </div>
                            <div className="col-6 d-flex align-items-center justify-content-end pb-3">
                                <p className="fs-5">{transferData?.successTransfer?.transaction?.paymentStatus}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mb-4 mt-5 d-grid ">
                    <button onClick={handleDone} type="button" className="btn orange-bg p-color fs-4 f-bold min-h-45px">
                        Done
                    </button>
                </div>
            </div>
        </>
    );
};

export default GetSuccess;
