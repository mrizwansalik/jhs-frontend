/* eslint-disable */
import { copyToClipboard } from '../../helpers/globalHelpers';
import React from 'react';
const ConfirmationDetails = ({
    title,
    message,
    payAmount,
    currencyCode,
    charges,
    chargesCurrencyCode,
    transactionId,
    transactionDate,
    handleFlow,
    getAmount,
    chargeCurrencyCode,
    rate,
    type,
    status,
    payAmountMessage,
    getAmountMessage,
}) => {
    // Function
    return (
        <>
            <div className="col-md-7">
                <div className="row d-flex">
                    <div className="col-md-6 col-6">
                        <h2 className="fs-3 p-color mt-5 f-bold">{title}</h2>
                    </div>
                    <div className="col-md-6 col-6 text-end">
                        <button className="btn-deposit rad-5 p-3 mt-4">
                            <img className="me-3" src="/assets/images/share-icon.svg" />
                            Share
                        </button>
                    </div>
                </div>
                <div className="d-flex flex-column justify-content-center align-items-center mt-5">
                    {status === 'processed' ? (
                        <lottie-player
                            src="https://assets3.lottiefiles.com/packages/lf20_behmvekz.json"
                            background="transparent"
                            speed={1}
                            style={{ width: '130px', height: '130px' }}
                            loop
                            autoPlay
                        />
                    ) : (
                        <lottie-player
                            src="https://assets8.lottiefiles.com/packages/lf20_sgotli97.json"
                            background="transparent"
                            speed={1}
                            style={{ width: '120px', height: '120px' }}
                            loop
                            autoPlay
                        />
                    )}
                    <p className="fs-3 fw-bold mt-5 mb-5">{status === 'processed' ? 'Successful !' : 'Failed !'}</p>
                </div>
                {(type === 'convert' || type == 'buyCrypto') && status === 'processed' ? (
                    <div className="dark-gray-bg rad-3 p-4 mt-5">
                        <div className="d-flex mb-5">
                            <div className="conversion-icon light-gray-bg">
                                <p>
                                    <img src="assets/images/bitcoin-icon.png" alt="" className="img-fluid w-22px" />
                                </p>
                                <p>
                                    <img src="assets/images/converstion-icon.svg" alt="" className="img-fluid py-4" />
                                </p>
                                <p>
                                    <img src="assets/images/eth-icon.png" alt="" className="img-fluid w-22px mx-auto" />
                                </p>
                            </div>
                            <div className="conversion-details ps-5 position-relative">
                                <div className="pb-2">
                                    <strong className="light_gray-color fs-5 d-block mb-3">{payAmountMessage}</strong>
                                    <span className="fs-4 p-color f-bold">
                                        {payAmount} <i className="f-reg fs-5">{currencyCode}</i>
                                    </span>
                                </div>
                                <div className="position-absolute top-50 start-50 translate-middle black-border bor-btm w-100"> </div>
                                <div className=" mt-5">
                                    <strong className="light_gray-color fs-5 d-block mb-3">{getAmountMessage}</strong>
                                    <span className="fs-4 p-color f-bold">
                                        {getAmount} <i className="f-reg fs-5">{chargeCurrencyCode}</i>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex light-gray-bg rad-3 p-4 justify-content-between bor-btm">
                            <span className="fs-5 p-color">Rate</span>
                            <span className="fs-5 p-color">
                                (1 {currencyCode} = {rate} {chargeCurrencyCode})
                            </span>
                        </div>
                        <div className="d-flex light-gray-bg rad-3 p-4 justify-content-between">
                            <span className="fs-5 p-color">Transaction Fees</span>
                            <span className="fs-5 p-color">
                                {charges} {chargesCurrencyCode}
                            </span>
                        </div>
                    </div>
                ) : (
                    ''
                )}
                <div className="dark-gray-bg rad-3 p-4 mt-5">
                    {type === 'depositFiat' ? (
                        <div className="d-flex">
                            <img className="border-icon" src="/assets//images/bitcoin-icon.png" />
                            <div className="mt-2 ms-3">
                                <span className="fs-4 fw-bold">
                                    {payAmount} {currencyCode}
                                </span>
                                <p className="fs-5 mt-2">{message}</p>
                            </div>
                        </div>
                    ) : (
                        ''
                    )}
                    <div className="mt-4 light-gray-bg rad-3 p-3">
                        <div className="row w-100 bor-btm">
                            <div className="col-6 d-flex align-items-center pb-3">
                                <p className="fs-5">Transaction ID</p>
                            </div>
                            <div
                                id="uid"
                                className="col-6 d-flex align-items-center justify-content-end pb-3 pointer position-relative"
                                onClick={(e) => {
                                    copyToClipboard('clipboard', 'uid');
                                }}>
                                <p id="transactionId" className="pe-4 fs-5">
                                    <span id="clipboard">{transactionId}</span>
                                </p>
                                <img className="img-fluid" src="/assets/images/copy-2.svg" />
                                <span className="custom-tooltip">copied!</span>
                            </div>
                        </div>
                        <div className="row w-100 mt-3">
                            <div className="col-6 d-flex align-items-center pb-3">
                                <p className="fs-5">Transaction Date</p>
                            </div>
                            <div className="col-6 d-flex align-items-center justify-content-end pb-3">
                                <p className="fs-5">{transactionDate}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mb-4 mt-5 d-grid ">
                    <button onClick={(e) => handleFlow('')} type="button" className="btn orange-bg p-color fs-4 f-bold min-h-45px">
                        Done
                    </button>
                </div>
            </div>
        </>
    );
};
export default ConfirmationDetails;
