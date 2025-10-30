'use client';

import { useCallback, useState } from 'react';

import type { UniqueIdentifier } from '@dnd-kit/core';
import {
	DndContext,
	DragOverlay,
	useSensor,
	useSensors,
	KeyboardSensor,
	TouchSensor,
	MouseSensor,
	closestCenter,
} from '@dnd-kit/core';
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';

import { coordinateGetter, hasDraggableData } from '../utils';

export interface Props<TData extends { id: UniqueIdentifier }> {
	children: React.ReactNode | ((data: TData[]) => React.ReactNode);
	data: TData[];
	onDragStart?: (item: TData, event: DragStartEvent) => void;
	onDragEnd?: (item: TData, newData: TData[], event: DragEndEvent) => void;
	onDragOver?: (activeItem: TData, overItem: TData, newData: TData[], event: DragOverEvent) => void;
	overlay?: React.ReactNode | ((data: TData) => React.ReactNode);
}

export const Provider = <TData extends { id: UniqueIdentifier }>({
	children,
	data,
	onDragStart,
	onDragEnd,
	onDragOver,
	overlay,
}: Props<TData>) => {
	const [activeData, setActiveData] = useState<TData | null>(null);

	const sensors = useSensors(
		useSensor(MouseSensor),
		useSensor(TouchSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: coordinateGetter,
		}),
	);

	const handleDragStart = useCallback(
		(event: DragStartEvent) => {
			if (!hasDraggableData(event.active) || !event.active.data.current) return;
			const item = event.active.data.current;
			setActiveData(item as TData);
			onDragStart?.(item as TData, event);
		},
		[onDragStart],
	);

	const handleDragEnd = useCallback(
		(event: DragEndEvent) => {
			setActiveData(null);
			const { active, over } = event;
			if (!over) return;

			const activeId = active.id;
			const overId = over.id;

			if (!hasDraggableData(active)) return;

			const activeItem = active.data.current;

			if (activeId === overId) return;

			if (!activeItem) return;

			const overIndex = data.findIndex(item => item.id === overId);
			const activeIndex = data.findIndex(item => item.id === activeId);

			if (overIndex === -1 || activeIndex === -1) return;

			const newFields = arrayMove(data, activeIndex, overIndex);

			onDragEnd?.(activeItem as TData, newFields, event);
		},
		[data, onDragEnd],
	);

	const handleDragOver = useCallback(
		(event: DragOverEvent) => {
			const { active, over } = event;
			if (!over) return;

			const activeId = active.id;
			const overId = over.id;

			if (activeId === overId) return;

			if (!hasDraggableData(active) || !hasDraggableData(over)) return;

			const activeItem = active.data.current;
			const overItem = over.data.current;

			if (!activeItem || !overItem) return;

			const overIndex = data.findIndex(item => item.id === overId);
			const activeIndex = data.findIndex(item => item.id === activeId);

			if (overIndex === -1 || activeIndex === -1) return;

			const newFields = arrayMove(data, activeIndex, overIndex);

			onDragOver?.(activeItem as TData, overItem as TData, newFields, event);
		},
		[data, onDragOver],
	);

	return (
		<DndContext
			sensors={sensors}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			onDragOver={handleDragOver}
			collisionDetection={closestCenter}
			modifiers={[restrictToVerticalAxis]}
		>
			<SortableContext items={data}>{typeof children === 'function' ? children(data) : children}</SortableContext>
			{typeof window !== 'undefined' &&
				'document' in window &&
				overlay &&
				activeData &&
				createPortal(
					<DragOverlay>{typeof overlay === 'function' ? overlay(activeData) : overlay}</DragOverlay>,
					document.body,
				)}
		</DndContext>
	);
};
