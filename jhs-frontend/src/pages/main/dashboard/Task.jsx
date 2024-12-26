/* eslint-disable  */
import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import EmptyList from 'components/message/EmptyList';


const Task = () => {
    const taskList = useSelector((state) => state.task.list);
    
    if (!taskList || taskList?.length == 0) {
        return (
            <EmptyList>
                <EmptyList.Header>No Task Found</EmptyList.Header>
                <EmptyList.Body>You do not have any task todo.</EmptyList.Body>
            </EmptyList>
        );
    }

    return (
        <>
            {taskList && taskList?.map((task) => {
                return (
                    <section key={"task-list-view-" + task._id} className="card card-lifted shadow px-3 py-3 my-3" >
                        <div className="row g-0 border-0 pt-3">
                            <div className="col-12">
                                <div className="card-body px-3 py-2">
                                    <div className="row mt-sm-n1 mb-0">
                                        <div className='col-10'>
                                            <h5 className='h5 mb-3'>
                                                <Link to={"/main/task/" + task?._id + "/showTask"}>{task?.title ?? "Untitled Task"}</Link>
                                            </h5>
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
                                                <div className="dropdown dropdown-menu dropdown-menu-end my-1">

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-wrap align-items-center mt-n2">
                                        {
                                            task?.isCompleted === false && task?.isDone === false ?
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
                                                        <span className="badge bg-faded-warning text-nav fs-xs border border-warning mt-2">
                                                            {`${moment(task?.dueDate)?.format("LLL")}`}
                                                        </span>
                                                </>
                                                :
                                                task?.isDone === true ?
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
                                                        <span className="badge bg-faded-success text-nav fs-xs border border-success mt-2">
                                                            {moment(task?.isDoneAt)?.format("LLL")}
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
                                                        <span className="badge bg-faded-primary text-nav fs-xs border border-primary mt-2">
                                                            {moment(task?.isCompletedAt)?.format("LLL")}
                                                        </span>
                                                    </>
                                        }
                                        
                                        <span className="fs-xs opacity-20 mt-2 mx-3">|</span>
                                        <span className="badge text-nav fs-xs border mt-2">
                                            {task?.article?.title}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )
            })}
        </>
    );
};

export default Task;