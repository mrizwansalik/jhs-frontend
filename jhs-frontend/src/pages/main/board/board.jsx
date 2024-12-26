/* eslint-disable */
import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { SortableContext, useSortable, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import './kanbanBoard.css'

const statuses = ['Pending Payment', 'In Editor', 'Language', 'Done'];

function KanbanBoard() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Task 1', status: 'Pending Payment' },
    { id: 2, title: 'Task 2', status: 'Pending Payment' },
    { id: 3, title: 'Task 3', status: 'In Editor' },
    { id: 4, title: 'Task 4', status: 'Done' }
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: event => {
        const { pageX, pageY } = event.touches ? event.touches[0] : event;
        return { x: pageX, y: pageY };
      }
    })
  );

  const handleDragEnd = ({ active, over }) => {
    if (active.id !== over.id) {
      const oldIndex = tasks.findIndex(task => task.id === active.id);
      const newIndex = tasks.findIndex(task => task.id === over.id);

      setTasks(tasks => {
        const newTasks = [...tasks];
        newTasks.splice(oldIndex, 1);
        newTasks.splice(newIndex, 0, tasks[oldIndex]);
        return newTasks;
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

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="container py-5 horizontal-scrollable">
        <div className="row">
          {statuses.map(status => (
            <SortableContext
              key={status}
              items={tasks.filter(task => task.status === status).map(task => task.id)}
              strategy={horizontalListSortingStrategy}
            >
              {/* Start lane */}
              <div className="col-12 col-lg-4">
                <div className="card mb-3">
                  <div className="card-header bg-light">
                    <h3 className="card-title h5 mb-1">{status}</h3>
                  </div>
                  <div className="card-body">
                    <div className="tasks" id="backlog">
                      {tasks
                        .filter(task => task.status === status)
                        .map(task => (
                          <SortableItem key={task.id} id={task.id}>
                            {/* Start task */}
                            <div className="alert alert-primary mb-0" role="alert">
                              <h4 className="pt-2 alert-heading">Article Info</h4>
                              <p>{task.title}</p>
                              <hr className="text-primary opacity-25 mb-3" />
                              <p className="mb-2">
                                options here
                              </p>
                            </div>
                            {/* End task */}
                          </SortableItem>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* End lane */}
            </SortableContext>
          ))}
        </div>
      </div>
    </DndContext>
  );
}

export default KanbanBoard;
