/* eslint-disable */
const Header = () => null;
const Body = () => null;
const Footer = () => null;

const Modal = ({ children, id = 'modalId', className = 'modal-lg' }) => {
    const header = children.find((el) => el.type === Header);
    const body = children.find((el) => el.type === Body);
    const footer = children.find((el) => el.type === Footer);
    return (
        <>
            <div className={`modal fade ${className}`} id={id} tabIndex={-1} role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header py-4">
                            <>{header ? header.props.children : null}</>
                        </div>
                        {body ? (<div className="modal-body pb-2 pt-3"> { body.props.children } </div>): null}
                        {footer ? (<div className="modal-footer flex-column flex-sm-row py-3"> {footer.props.children} </div>): null}
                    </div>
                </div>
            </div>
        </>
    );
};

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;
export default Modal;
