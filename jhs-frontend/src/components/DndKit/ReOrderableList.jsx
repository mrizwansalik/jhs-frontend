/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { ListGroup } from 'reactstrap';

const ReorderableList = ({ children, id, items: defaultItems, onReorder, ...props }) => {
  const [items, setItems] = useState(defaultItems);
  const notInitialRender = useRef(false)

  useEffect(() => setItems(items), [defaultItems, setItems]);

  useEffect(() => {
    if (notInitialRender.current && onReorder) onReorder(items);
    else notInitialRender.current = true
  }, [items]);

  const handleDragEnd = ({ active, over }) => {
    if (!over) {
      return;
    }

    if (active.id !== over.id) {
      const activeIndex = active.data.current.sortable.index;
      const overIndex = over.data.current?.sortable.index || 0;

      setItems((items) => {
        return arrayMove(items, activeIndex, overIndex);
      });
    }
  };

  return (
    <DndContext
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext id={id} items={items}>
        <ListGroup {...props}>
          {children}
        </ListGroup>
      </SortableContext>
    </DndContext>
  );
};

export default ReorderableList;
