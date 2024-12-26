/* eslint-disable */
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link } from 'react-router-dom';

export function SortableItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>

      {/* Task Item */}
      <div className="card card-lifted shadow rounded-2 mb-3">
        <div className="card-body p-3">
          <small className="float-end text-muted">18 Jul 2018</small>
          <span className="badge border border-primary text-primary badge-sm fs-xs">{props.task.type}</span>
          <h6 className="mt-2 mb-2 fs-sm">
            <Link
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#task-detail-modal"
              className="text-body text-wrap"
            >
              {props.task.title}
            </Link>
          </h6>
          <div className="dropdown float-end">
            <a
              href="#"
              className="dropdown-toggle text-muted"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fas fa-ellipsis-v text-primary" />
            </a>
            <div className="dropdown-menu dropdown-menu-end">
              {/* item*/}
              <a href="javascript:void(0);" className="dropdown-item">
                <i className="mdi mdi-pencil me-1" />
                Edit
              </a>
              {/* item*/}
              <a href="javascript:void(0);" className="dropdown-item">
                <i className="mdi mdi-delete me-1" />
                Delete
              </a>
              {/* item*/}
              <a href="javascript:void(0);" className="dropdown-item">
                <i className="mdi mdi-plus-circle-outline me-1" />
                Add People
              </a>
              {/* item*/}
              <a href="javascript:void(0);" className="dropdown-item">
                <i className="mdi mdi-exit-to-app me-1" />
                Leave
              </a>
            </div>
          </div>
          <p className="mb-0">
            <img
              src="/assets/images/users/avatar-2.jpg"
              alt="user-img"
              className="avatar-xs rounded-circle me-1"
            />
            <span className="align-middle">Main Author</span>
          </p>
        </div>
        {/* end card-body */}
      </div>
      {/* End task */}
    </div>
  );
}