/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ListGroupItem } from 'react-bootstrap';
import { Button, Collapse, DropdownMenu, DropdownToggle, Input, UncontrolledDropdown } from 'reactstrap';

function ReorderableItem({ children, controls, menu, onExpand, onSelect, open = false, selected, id, ...props }) {
  const [isOpen, setIsOpen] = useState(open);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  useEffect(() => setIsOpen(open), [open])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const expandable = onExpand !== undefined;
  const selectable = onSelect !== undefined;

  return (
    <ListGroupItem
      ref={setNodeRef}
      style={style}
      {...props}
    >
      <div className="d-flex align-items-center">
        <div
          className="d-inline-block me-2 opacity-25"
          color="link"
          {...attributes}
          {...listeners}
        >
          <i
            className="fas fa-grip-vertical"
            style={{ cursor: 'ns-resize' }}
          />
        </div>

        {expandable && (
          <Button
            color="link"
            className="p-1 me-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            <i className={isOpen ? 'fas fa-chevron-up' : 'fas fa-chevron-down'} />
          </Button>
        )}

        {selectable && (
          <span className="p-0 me-2">
            <Input
              className="mx-0"
              type="checkbox"
              onChange={e => onSelect(e.target.checked)}
              checked={selected}
            />
          </span>
        )}

        {children}
        <div className="ms-auto">
          {controls}
          {menu && (
            <UncontrolledDropdown>
              <DropdownToggle color="link" className="p-1">
                <i className="fas fa-ellipsis-v"></i>
              </DropdownToggle>
              <DropdownMenu end>{menu}</DropdownMenu>
            </UncontrolledDropdown>
          )}
        </div>
      </div>
      {expandable && (
        <Collapse isOpen={isOpen}>
          {onExpand}
        </Collapse>
      )}
    </ListGroupItem>
  );
}

export default ReorderableItem;
