/* eslint-disable */
import React from 'react';
import {useDraggable} from '@dnd-kit/core';

export function Draggable(props) {
  const Element = props.element || 'div';
  const {attributes, listeners, setNodeRef} = useDraggable({
    id: props.id,
  });
  
  return (
    <Element ref={setNodeRef} {...listeners} {...attributes}>
      {props.children}
    </Element>
  );
}