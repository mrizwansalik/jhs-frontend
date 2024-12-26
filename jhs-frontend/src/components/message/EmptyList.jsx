import { Link } from "react-router-dom";

/* eslint-disable */
const Header = () => null;
const Body = () => null;
const Footer = () => null;

const EmptyList = ({ children }) => {
    const header = children.find((el) => el.type == Header);
    const body = children.find((el) => el.type == Body);
    const footer = children.find((el) => el.type == Footer);
    return (
        <>
            <div className='card card-lifted shadow py-5 my-4'>
                <div
                    className="text-center pt-4 mt-lg-2"
                >
                    {header ? <h1 className="h2 fs-3 text">{header.props.children}</h1> : null}
                    <p className="fs-xl pb-2 mb-3 mb-lg-4">
                        {
                            body ?
                                (<>{body.props.children}</>)
                                :
                                `You do not have any articles. Would you like to start a new one?`
                        }
                    </p>
                    {
                        footer ?
                            (<> {footer.props.children} </>)
                            :
                            <Link
                                className={`btn btn-lg btn-primary`}
                                to={"/main/dashboard"}
                            >
                                <i className="ai-home fs-lg opacity-90 me-2" />
                                Go to Dashboard
                            </Link>
                    }
                </div>
            </div>
        </>
    );
};

EmptyList.Header = Header;
EmptyList.Body = Body;
EmptyList.Footer = Footer;
export default EmptyList;
