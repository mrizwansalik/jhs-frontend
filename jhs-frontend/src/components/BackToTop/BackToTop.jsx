const BackToTop = () => {

    return (
        <a className="btn-scroll-top" href="#top" data-scroll="">
            <svg
                viewBox="0 0 40 40"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle
                    cx={20}
                    cy={20}
                    r={19}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit={10}
                    style={{ strokeDasharray: "118.611", strokeDashoffset: 0 }}
                />
            </svg>
            <i className="ai-arrow-up" />
        </a>
    );
};
export default BackToTop;



