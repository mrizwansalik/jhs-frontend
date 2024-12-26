/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import ReorderableItem from './ReOrderableItem';
import { ListGroup } from 'reactstrap';

const removeAtIndex = (array, index) => {
  return [...array.slice(0, index), ...array.slice(index + 1)];
};

const insertAtIndex = (array, index, item) => {
  return [...array.slice(0, index), item, ...array.slice(index)];
};

const ReorderableLists = ({ children, items: defaultItems, onReorder }) => {
  const [dragging, setDragging] = useState(false);
  const [items, setItems] = useState(defaultItems);

  useEffect(() => setItems(items), [defaultItems, setItems]);

  const notInitialRender = useRef(false);
  useEffect(() => {
    if (notInitialRender.current && onReorder && !dragging) onReorder(items);
    else notInitialRender.current = true;
  }, [items]);

  const handleDragOver = ({ over, active }) => {
    const overId = over?.id;

    if (!overId) {
      return;
    }

    const activeContainer = active.data.current.sortable.containerId;
    const overContainer = over.data.current?.sortable.containerId;

    if (!overContainer) {
      return;
    }

    if (activeContainer !== overContainer) {
      setItems((items) => {
        const activeIndex = active.data.current.sortable.index;
        const overIndex = over.data.current?.sortable.index || 0;

        return moveBetweenContainers(
          items,
          activeContainer,
          activeIndex,
          overContainer,
          overIndex,
          active.id
        );
      });
    }
  };

  const handleDragEnd = ({ active, over }) => {
    setDragging(false)
    if (!over) {
      return;
    }

    if (active.id !== over.id) {
      const activeContainer = active.data.current.sortable.containerId;
      const overContainer = over.data.current?.sortable.containerId || over.id;
      const activeIndex = active.data.current.sortable.index;
      const overIndex = over.data.current?.sortable.index || 0;

      setItems((items) => {
        let newItems;
        if (activeContainer === overContainer) {
          newItems = {
            ...items,
            [overContainer]: arrayMove(
              items[overContainer],
              activeIndex,
              overIndex
            ),
          };
        } else {
          newItems = moveBetweenContainers(
            items,
            activeContainer,
            activeIndex,
            overContainer,
            overIndex,
            active.id
          );
        }

        return newItems;
      });
    }
  };

  const moveBetweenContainers = (
    items,
    activeContainer,
    activeIndex,
    overContainer,
    overIndex,
    item
  ) => {
    return {
      ...items,
      [activeContainer]: removeAtIndex(items[activeContainer], activeIndex),
      [overContainer]: insertAtIndex(items[overContainer], overIndex, item),
    };
  };

  return (
    <DndContext
      modifiers={[restrictToVerticalAxis]}
      onDragCancel={() => setDragging(false)}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={() => setDragging(true)}
    >
      {Object.keys(items).map((group) => (
        <SortableContext id={group} items={items[group]} key={group}>
          <ListGroup className="mb-3">
            {items[group].map((item) => (
              <ReorderableItem key={item} id={item}>
                {children(item)}
              </ReorderableItem>
            ))}
          </ListGroup>
        </SortableContext>
      ))}
    </DndContext>
  );
};

export default ReorderableLists;
