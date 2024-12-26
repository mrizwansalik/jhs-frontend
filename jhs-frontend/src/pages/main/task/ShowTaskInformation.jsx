/* eslint-disable */
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTaskDetail, markTaskAsComplete, markTaskAsDone } from 'store/main/task/actions';
import moment from 'moment';
import { checkFeaturePermission } from 'helpers/globalHelpers';

const ShowTaskInformation = () => {
    const dispatch = useDispatch();

    let { taskId } = useParams();

    const taskInfo = useSelector((state) => state.task.single);
    const currUser = useSelector((state) => state.profile.profile);

    useEffect(() => {
        dispatch(getTaskDetail({ body: {}, options: { id: taskId, btnLoader: true, __module: 'task', } }));
    }, [dispatch, taskId]);

    const markTaskAsCompleteHandler = (id) => {
        dispatch(
            markTaskAsComplete({
                body: {},
                options: { id: id, btnLoader: true, __module: 'article', showToast: true },
            }));
    }

    const markTaskAsDoneHandler = (id) => {
        dispatch(
            markTaskAsDone({
                body: {},
                options: { id: id, btnLoader: true, __module: 'article', showToast: true },
            }));
    }

    return (
        <>
            <div className="row">
                <div className='col-12 mt-3 mb-0'>
                    <div className="card border-0 border-start border-4 border-primary rounded-4 mb-3">
                        <div className="card-body">
                            <div className='row mt-sm-n1 mb-0'>
                                <div className='col-10'>
                                    <h1 className="h3 fw-normal lh-base">
                                        <span className="text-primary fw-semibold">{taskInfo?.title ?? "Untitled Task"}</span>
                                    </h1>
                                    <div className="d-flex flex-wrap align-items-center mt-n2">
                                        {
                                            taskInfo?.isCompleted === false && taskInfo?.isDone === false ?
                                                <>
                                                    <a
                                                        className="nav-link px-0 py-2 border-0 rounded-1 active"
                                                        href="#preview1"
                                                        data-bs-toggle="tab"
                                                        role="tab"
                                                        aria-controls="preview1"
                                                        aria-selected="true"
                                                    >
                                                        <strong className='text-warning'><i className="ai-bookmark fs-lg opacity-90 me-2" />Pending</strong>
                                                    </a>
                                                    <span className="fs-xs opacity-20 mt-2 mx-3">|</span>
                                                    <span className="badge bg-faded-warning text-nav fs-xs border border-1 border-warning text-warning mt-2">
                                                        {`${moment(taskInfo?.dueDate)?.format("LLL")}`}
                                                    </span>
                                                </>
                                                :
                                                taskInfo?.isDone === true ?
                                                    <>
                                                        <a
                                                            className="nav-link px-0 py-2 border-0 rounded-1 active"
                                                            href="#preview1"
                                                            data-bs-toggle="tab"
                                                            role="tab"
                                                            aria-controls="preview1"
                                                            aria-selected="true"
                                                        >
                                                            <strong className='text-success'><i className="ai-checks fs-lg opacity-90 me-2" />Done</strong>
                                                        </a>
                                                        <span className="fs-xs opacity-20 mt-2 mx-3">|</span>
                                                        <span className="badge bg-faded-success text-nav fs-xs border border-1 border-success text-success mt-2">
                                                            {moment(taskInfo?.isDoneAt)?.format("LLL")}
                                                        </span>
                                                    </>
                                                    :
                                                    <>
                                                        <a
                                                            className="nav-link px-0 py-2 border-0 rounded-1 active"
                                                            href="#preview1"
                                                            data-bs-toggle="tab"
                                                            role="tab"
                                                            aria-controls="preview1"
                                                            aria-selected="true"
                                                        >
                                                            <strong className='text-primary'><i className="ai-check fs-lg opacity-90 me-2" />Complete</strong>
                                                        </a>
                                                        <span className="fs-xs opacity-20 mt-2 mx-3">|</span>
                                                        <span className="badge bg-faded-primary text-nav fs-xs border border-1 border-primary text-primary mt-2">
                                                            {moment(taskInfo?.isCompletedAt)?.format("LLL")}
                                                        </span>
                                                    </>
                                        }
                                    </div>
                                </div>
                                <div className='col-2'>
                                    
                                            
                                    <div className="d-flex flex-row-reverse mt-sm-n1 mb-0 mb-lg-1 mb-xl-3">
                                        <a
                                            data-bs-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false"
                                        >
                                            <i className="fas fa-ellipsis-v text-primary"></i>
                                        </a>
                                        <div className="dropdown dropdown-menu dropdown-menu-end my-1 border-1 shadow">
                                            {
                                                taskInfo?.assignedTo?.includes(currUser._id) ?
                                                    (<button
                                                        key={"mark_task_as_complete_" + taskInfo?._id}
                                                        id={"mark_task_as_complete_" + taskInfo?._id}
                                                        className="dropdown-item" onClick={() => markTaskAsCompleteHandler(taskInfo?._id)}>
                                                        <i className="ai-check me-2"></i> Mark as Complete
                                                    </button>) : (<></>)
                                            }

                                            {
                                                (taskInfo?.addBy?._id == currUser?._id) ?
                                                    (<button
                                                        key={"mark_task_as_done_" + taskInfo?._id}
                                                        id={"mark_task_as_done_" + taskInfo?._id}
                                                        className="dropdown-item" onClick={() => markTaskAsDoneHandler(taskInfo?._id)}>
                                                        <i className="ai-checks me-2"></i> Mark as Done
                                                    </button>) : (<></>)
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="mt-2 mt-md-0 pb-5 mb-md-2 mb-lg-3 mb-xl-4 mb-xxl-5">
                <div className="row pb-md-4">
                    <div className="col-lg-8 pb-2 pb-md-0 mb-4 mb-md-0">
                        <div className="border-1 card rounded-3 mb-3 p-3 p-sm-4" >
                            <div className="card-body">
                                <h2 className="h6 text-center text-sm-start mb-2">
                                    Description
                                </h2>
                                {<span style={{ textAlign: "justify", textJustify: "inter-word" }} dangerouslySetInnerHTML={{ __html: taskInfo?.description }} />}
                            </div>
                        </div>

                        <section className="border-1 card rounded-3 mb-3 p-3 p-sm-4" id="type-inline">
                            <div className="d-flex align-items-center ml-4 pb-2 border-bottom">
                                {/* Nav tabs */}
                                <ul
                                    className="nav nav-tabs card-header-tabs align-items-center mb-n1"
                                    role="tablist"
                                >
                                    <li className="nav-item me-3" role={`taskComment`}>
                                        <a
                                            className={`nav-link px-0 py-2 text-capitalize border-0 rounded-1 active`}
                                            href={`#taskComment`}
                                            data-bs-toggle="tab"
                                            role="tab"
                                            aria-controls={`taskComment`}
                                            aria-selected="true"
                                        >
                                            Comment
                                        </a>
                                    </li>
                                    <li className="vr opacity-20 my-3 me-3" />
                                    <li className="nav-item me-3" role={`taskEditor`}>
                                        <a
                                            className={`nav-link px-0 py-2 text-capitalize border-0 rounded-1`}
                                            href={`#taskEditor`}
                                            data-bs-toggle="tab"
                                            role="tab"
                                            aria-controls={`taskEditor`}
                                            aria-selected="true"
                                        >
                                            Editor
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="card mt-4">
                                <div className="card-body">
                                    <div className="tab-content">
                                        {/* Tabs content */}
                                        <div className="tab-content">
                                            <div className={`tab-pane fade show active`} id={`taskComment`} role="tabpanel">
                                                <h2 className="h5 card-title text-capitalize">Task Comment</h2>
                                                {
                                                    taskInfo?.comment?.map((commentItem) => {
                                                        return (
                                                            <div key={"commentItem" + commentItem._id} className="border-bottom mt-2 mb-4">
                                                                <div className="d-flex align-items-top pb-1 mb-1">
                                                                    <div className="rounded-circle bg-size-cover bg-position-center flex-shrink-0"
                                                                        style={{
                                                                            width: '48px',
                                                                            height: '48px',
                                                                            backgroundImage: `url(${(commentItem?.commentBy?.file) ? `${import.meta.env.VITE_REACT_APP_URL}/public/uploads/profile/${commentItem?.commentBy?.file}` : '/assets/img/avatar/user.png'})`
                                                                        }}
                                                                        alt="Comment by user"
                                                                    />
                                                                    <div className="ps-3">
                                                                        <h6 className="mb-0">{commentItem?.commentBy?.name ?? "Unnamed User"}</h6>
                                                                        <span className="fs-sm text-muted mb-1">{moment(commentItem?.commentAt)?.format("LLL")}</span>
                                                                        <p className="pb-2 mb-0" style={{ textAlign: "justify", textJustify: "inter-word" }}>
                                                                            {commentItem.text}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </div>
                                            <div className={`tab-pane fade show`} id={`taskEditor`} role="tabpanel">
                                                <h2 className="h5 card-title text-capitalize">Task Editor History</h2>
                                                {
                                                    taskInfo?.change_editor?.map((editorItem) => {
                                                        return (
                                                            <div key={"editorItem" + editorItem._id} className="border-bottom mt-2 mb-4">
                                                                <div className="d-flex align-items-top pb-1 mb-1">
                                                                    <div className="rounded-circle bg-size-cover bg-position-center flex-shrink-0"
                                                                        style={{
                                                                            width: '48px',
                                                                            height: '48px',
                                                                            backgroundImage: `url(${(editorItem?.editor?.file) ? `${import.meta.env.VITE_REACT_APP_URL}/public/uploads/profile/${editorItem?.editor?.file}` : '/assets/img/avatar/user.png'})`
                                                                        }}
                                                                        alt={`${editorItem?.editor?.name} Editor Profile`}
                                                                    />
                                                                    <div className="ps-3">
                                                                        <h6 className="mb-0">{editorItem?.editor?.name ?? "Unnamed User"}</h6>
                                                                        <span className="fs-sm text-muted mb-1">{moment(editorItem.date)?.format("LLL")}</span>
                                                                        <p className="pb-2 mb-0" style={{ textAlign: "justify", textJustify: "inter-word" }}>
                                                                            {editorItem.request}
                                                                        </p>
                                                                        <p className="pb-2 mb-0" style={{ textAlign: "justify", textJustify: "inter-word" }}>
                                                                            {editorItem.reason}
                                                                        </p>
                                                                    </div>
                                                                    <div className='d-flex flex-wrap align-items-center mt-n2'>
                                                                        {
                                                                            // -1 pending, 1 approved, 0 rejected
                                                                            editorItem?.status === -1 ?
                                                                                <>
                                                                                    <strong className='text-warning'><i className="ai-bookmark fs-lg opacity-90 me-2" />Pending</strong>
                                                                                </>
                                                                                :
                                                                                editorItem?.status === 1 ?
                                                                                    <>
                                                                                        <strong className='text-success'><i className="ai-checks fs-lg opacity-90 me-2" />Approved</strong>
                                                                                        <span className="fs-xs opacity-20 mt-2 mx-3">|</span>
                                                                                        <span className="badge bg-faded-success text-nav fs-xs border border-1 border-success mt-2">
                                                                                            By {editorItem?.actionBy?.name ?? "System User"} at {moment(editorItem.approvedAt)?.format("LLL")}
                                                                                        </span>
                                                                                    </>
                                                                                    :
                                                                                    <>
                                                                                        <strong className='text-danger'><i className="ai-cancel fs-lg opacity-90 me-2" />Rejected</strong>
                                                                                        <span className="fs-xs opacity-20 mt-2 mx-3">|</span>
                                                                                        <span className="badge bg-faded-primary text-nav fs-xs border border-1 border-primary mt-2">
                                                                                            By {editorItem?.actionBy?.name ?? "System User"} at {moment(editorItem.rejectedAt)?.format("LLL")}
                                                                                        </span>
                                                                                    </>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                    {/* Relevant articles sidebar*/}
                    <aside className="col-lg-4 mb-2"
                        style={{ marginTop: "-115px" }}
                    >
                        <div
                            className="position-sticky top-0 ps-xl-0"
                            style={{ paddingTop: 125 }}
                        >
                            <div className="card shadow border-1 rounded-3 mb-3">
                                <div className="card-body">
                                    <h2 className="h6 py-1 mb-0 me-4">Article Info:</h2>
                                    <p>{taskInfo?.article?.title ?? '-'}</p>
                                    <h2 className="h6 py-1 mb-0 me-4">Article Type:</h2>
                                    <p>{taskInfo?.article?.type ?? '-'}</p>
                                    {
                                        taskInfo?.createdAt ? <>
                                            <h2 className="h6 py-1 mb-0 me-4">Created At:</h2>
                                            <p>{taskInfo?.createdAt ? moment(taskInfo?.createdAt)?.format("LLL") : "Creation information"}</p>
                                        </> : <></>
                                    }
                                    {
                                        taskInfo?.dueDate ? <>
                                            <h2 className="h6 py-1 mb-0 me-4">Due At:</h2>
                                            <p>{taskInfo?.dueDate ? moment(taskInfo?.dueDate)?.format("LLL") : "No Due Date Found"}</p>
                                        </> : <></>
                                    }
                                    {
                                        taskInfo?.isCompleted === false && taskInfo?.isDone === false ?
                                            <></>
                                            :
                                            taskInfo?.isDone === true ?
                                                <>
                                                    <h2 className="h6 py-1 mb-0 me-4"><i className="ai-checks fs-lg opacity-90 me-2" /> Marked As Done:</h2>
                                                    <p>{taskInfo?.isDoneAt ? moment(taskInfo?.isDoneAt)?.format("LLL") : "No Due Date Found"}</p>
                                                </>
                                                :
                                                <>
                                                    <h2 className="h6 py-1 mb-0 me-4"><i className="ai-check fs-lg opacity-90 me-2" /> Marked As Complete:</h2>
                                                    <p>{taskInfo?.isDoneAt ? moment(taskInfo?.isCompletedAt)?.format("LLL") : "No Due Date Found"}</p>
                                                </>
                                    }
                                </div>
                            </div>
                            <div className='card rounded-3 mb-3'>
                                <div className='card-body m-0 p-4'>
                                    <h3 className="h5 mb-3 pb-3 border-bottom">Assigned To</h3>
                                    {
                                        taskInfo?.assignedTo?.map((data) => {
                                            return <div key={"authorList" + data?._id} className="card mt-2 rounded-3">
                                                <div className="card-body p-2">
                                                    <div className="d-md-flex align-items-center">
                                                        <div className="d-sm-flex align-items-center m-2">
                                                            <div className="rounded-circle bg-size-cover bg-position-center flex-shrink-0 ml-4"
                                                                style={{
                                                                    width: '48px',
                                                                    height: '48px',
                                                                    backgroundImage: `url(${data?.file ? `${import.meta.env.VITE_REACT_APP_URL}/public/uploads/profile/${data?.file}` : '/assets/img/avatar/user.png'})`
                                                                }}
                                                                alt={`${data.name} author profile`} />
                                                            <div className="pt-3 pt-sm-0 ps-sm-3">
                                                                <h4 className="h6 mb-0">
                                                                    {data.name ?? "Unnamed User"}
                                                                </h4>
                                                                <div className="text-muted fw-medium d-flex align-items-center">
                                                                    <div className="d-flex align-items-center me-3 text-wrap">
                                                                        <i className="ai-mail me-1" />{data.email}
                                                                    </div>
                                                                </div>
                                                                <div className="text-muted fw-medium d-flex align-items-center">
                                                                    <div className="d-flex align-items-center me-3 text-wrap">
                                                                        <i className="ai-star me-1" />{data.position}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        })
                                    }
                                </div>

                            </div>
                        </div>
                    </aside>
                </div>
            </section>


        </>
    );
};

export default ShowTaskInformation;