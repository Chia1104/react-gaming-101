'use client';

import type { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import type { Arguments } from '@dnd-kit/sortable/dist/hooks/useSortable';
import { CSS } from '@dnd-kit/utilities';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/libs/utils/cn';

interface Props<TData extends { id: UniqueIdentifier }> {
	data: TData;
	asChild?: boolean;
	children: React.ReactNode;
	isOverlay?: boolean;
	sortableOptions?: Omit<Arguments, 'id' | 'data'>;
}

interface ControllerProps<TData extends { id: UniqueIdentifier }> {
	data: TData;
	sortableOptions?: Omit<Arguments, 'id' | 'data'>;
	children: React.ReactNode | ((sortable: ReturnType<typeof useSortable>) => React.ReactNode);
}

export const ControlledItem = <TData extends { id: UniqueIdentifier }>({
	data,
	asChild,
	children,
	isOverlay,
	sortableOptions,
}: Props<TData>) => {
	const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
		id: data.id,
		data: data,
		...sortableOptions,
	});
	const Component = asChild ? Slot : 'div';
	return (
		<Component
			ref={setNodeRef}
			style={{
				transform: CSS.Transform.toString(transform),
				transition,
			}}
			{...attributes}
			{...listeners}
			className={cn(isOverlay ? '' : isDragging ? 'opacity-30' : undefined)}
		>
			{children}
		</Component>
	);
};

export const Controller = <TData extends { id: UniqueIdentifier }>({
	data,
	children,
	sortableOptions,
}: ControllerProps<TData>) => {
	const sortable = useSortable({
		id: data.id,
		data: data,
		...sortableOptions,
	});
	return typeof children === 'function' ? children(sortable) : children;
};
