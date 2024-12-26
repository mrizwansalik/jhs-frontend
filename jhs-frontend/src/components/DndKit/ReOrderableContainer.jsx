/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove } from '@dnd-kit/sortable';

const removeAtIndex = (array, index) => {
  return [...array.slice(0, index), ...array.slice(index + 1)];
};

const insertAtIndex = (array, index, item) => {
  return [...array.slice(0, index), item, ...array.slice(index)];
};

const ReorderableContainer = ({ children, items: defaultItems, onReorder }) => {
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
const activeIndex = items.indexOf(active.id);
const overIndex = items.indexOf(over.id);
console.log(activeIndex, overIndex)
    if (active.id !== over.id) {
      
      const oldIndex = items.findIndex(({ id }) => id === active.id)
      const newIndex = items.findIndex(({ id }) => id === over.id)
      const newItemsArray = arrayMove(items, oldIndex, newIndex);
// console.log(items, oldIndex, newIndex, newItemsArray)
      // setItems(() => {
      //   console.log(items)
      //   return arrayMove(items, activeIndex, overIndex);
      // });
    }
  };

  return (
    <DndContext
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
    >
      {children}
    </DndContext>
  );
};

export default ReorderableContainer;
