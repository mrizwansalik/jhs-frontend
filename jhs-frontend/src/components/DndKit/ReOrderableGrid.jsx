/* eslint-disable */
import React from 'react';
import { SortableContext } from '@dnd-kit/sortable';
import { ListGroup } from 'reactstrap';
import ReorderableContainer from './ReOrderableContainer';

const ReorderableGrid = ({ children, id, items, onReorder }) => {
  console.log(children, id, items, onReorder)
  return (
    <ReorderableContainer
      items={items}
      onReorder={onReorder}
    >
      <SortableContext id={id} items={items}>
        <ListGroup className="mb-3">{children}</ListGroup>
      </SortableContext>
    </ReorderableContainer>
  );
};

export default ReorderableGrid;
