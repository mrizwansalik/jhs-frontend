/* eslint-disable */
import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDraggable
} from '@dnd-kit/core';
import { getArticles } from 'store/main/articles/actions';
import { SortableContext, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import './kanbanBoard.css';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllArticleStatus } from '../../../store/admin/articleStatus/actions';
import { checkFeaturePermission } from 'helpers/globalHelpers';

function KanbanBoard() {
  const [activeTask, setActiveTask] = useState(null);
  const dispatch = useDispatch();
  const articleStatus = useSelector((state) => state.articleStatus.list);
  const permission = useSelector((state) => state.profile.role);

  useEffect(() => {
    if (permission && permission.length) {
      !checkFeaturePermission('articlestatus-view') && navigator('/not-found');
    }
  }, [permission]);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(
      getAllArticleStatus({
        body: {},
        options: { __module: 'articleStatus' },
      }))
  }, []);

 
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Epidemiology and Clinical Phenotypes and Presentations of Neonatal Diabetes',
      type: 'Review',
      status: 'draft'
    },
    {
      id: 2,
      title: 'The Effectiveness of the Personal Protective Equipment Course for Medical Interns and Residents during the COVID-19 Pandemic in Jeddah, Saudi Arabia',
      type: 'Original Article',
      status: 'submitted'
    },
    {
      id: 3,
      title: 'Importance of Radiological Skeletal Assessment for Early Detection of Child Abuse',
      type: 'Review',
      status: 'pendingpayment'
    },
    {
      id: 4,
      title: 'Obstructive Sleep Apnea Screening Tools Effectiveness and Its Use in Primary Care',
      type: 'Review',
      status: 'languagecheck'
    },
    {
      id: 5,
      title: 'Hereditary Hemorrhagic Telangiectasia: A Case Report with Hematuria as Primary Presentation',
      type: 'Case Report',
      status: 'editorcheck'
    },
  ]);

  useEffect(() => {
    dispatch(
      getArticles({
        body: {},
        options: { __module: 'article' },
      })
    );
  }, [dispatch]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: event => {
        const { pageX, pageY } = event.touches ? event.touches[0] : event;
        return { x: pageX, y: pageY };
      }
    })
  );

  function handleDragStart(event) {
    const task = tasks.filter((item) => item.id === event.active.id);
    setActiveTask(task[0]);
  }

  const handleDragEnd = ({ active, over }) => {
    setActiveTask(null)
    if (active.id !== over.id) {
      //const { containerId: activeContainer } = active.data.current.sortable
      const { containerId: overContainer } = over.data.current.sortable

      const oldIndex = tasks.findIndex(task => task.id === active.id);
      const newIndex = tasks.findIndex(task => task.id === over.id);

      const containerValue = overContainer.split("-");

      setTasks(tasks => {
        const newTasks = [...tasks];
        newTasks.splice(oldIndex, 1);
        newTasks.splice(newIndex, 0, tasks[oldIndex]);
        return newTasks;
      });

      setTasks(tasks => {
        return tasks.map((item, index) => {
          if (index == newIndex) {
            return {
              ...item,
              status: articleStatus[containerValue[1]].slug,
            };
          } else {
            return {
              ...item,
            }
          }
        });
      });
    }

  };

  const SortableItem = ({ id, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    return (
      <div ref={setNodeRef} style={{ transform, transition }}>
        <div data-drag-handle {...attributes} {...listeners}>
          {children}
        </div>
      </div>
    );
  };

  if (!permission || !articleStatus) {
    return '';
  }

  return (
    <div className="">
      <div className="col-12 mt-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>

          <div className="board" style={{ height: '100vh' }}>
            {articleStatus.map((status) => (
              <>
                <SortableContext
                  key={status._id}
                  items={tasks.filter(task => task.status === status.slug).map(task => task.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="tasks bg-faded-primary rounded-3" data-plugin="dragula">
                    <h5 className="mt-0 task-header text-wrap">{status.name}</h5>
                    <div id={`task-list-${status._id}`} className="task-list-items">

                      {tasks
                        .filter(task => task.status === status.slug)
                        .map(task => (
                          <SortableItem key={task.id} id={task.id}>
                            {/* Task Item */}
                            <div className="card card-lifted shadow rounded-2 mb-3">
                              <div className="card-body p-3">
                                <small className="float-end text-muted">18 Jul 2018</small>
                                <span className="badge border border-primary text-primary badge-sm fs-xs">{task.type}</span>
                                <h6 className="mt-2 mb-2 fs-sm">
                                  <Link
                                    to="#"
                                    data-bs-toggle="modal"
                                    data-bs-target="#task-detail-modal"
                                    className="text-body text-wrap"
                                  >
                                    {task.title}
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
                          </SortableItem>
                        ))
                      }

                    </div>
                    {/* end company-list-1*/}
                  </div>
                </SortableContext>
              </>
            ))}
          </div>
          <DragOverlay >
            {activeTask ? (
              // <div value={`Item ${activeId}`} /> 
              <div className="card card-lifted shadow rounded-2 mb-3">
                <div className="card-body p-3">
                  <small className="float-end text-muted">18 Jul 2018</small>
                  <span className="badge border border-primary text-primary badge-sm fs-xs">{activeTask.type}</span>
                  <h6 className="mt-2 mb-2 fs-sm">
                    <Link
                      to="#"
                      data-bs-toggle="modal"
                      data-bs-target="#task-detail-modal"
                      className="text-body text-wrap"
                    >
                      {activeTask.title}
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
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div >
  );
}

export default KanbanBoard;
