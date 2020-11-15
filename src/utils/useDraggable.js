import { useEffect, useState, useRef } from 'react';

const eventsFor = {
	touch: {
		start: 'touchstart',
		move: 'touchmove',
		stop: 'touchend'
	},
	mouse: {
		start: 'mousedown',
		move: 'mousemove',
		stop: 'mouseup'
	}
};

/**
 * handleDrag
 * @param {*} onDragPosition
 */
const handleDragStartStop = (target, isDragging, setIsDragging, onPositionChange) => (e) => {
	e = e || window.event;
	e.preventDefault();
	setIsDragging(!isDragging);
	if (!isDragging) return;
	// set the element's new position:
	const pos = {
		top: e.clientY,
		left: e.clientX
	};
	onPositionChange({
		top: pos.top - target.parentNode.offsetTop,
		left: pos.left - target.parentNode.offsetLeft
	});
};

/**
 * handleDrag
 * @param {*} onDragPosition
 */
const handleDrag = (onDragPosition, target, isDragging) => (e) => {
	e = e || window.event;
	e.preventDefault();
	if (!isDragging) return;
	const pos = {
		top: e.clientY,
		left: e.clientX
	};

	// set the element's new position:
	onDragPosition({
		top: pos.top - target.parentNode.offsetTop,
		left: pos.left - target.parentNode.offsetLeft
	});
};

/**
 *  useDraggable
 */
const useDraggable = ({ target, currentPosition, onPositionChange }) => {
	const currentCurrentPosition = useRef(currentPosition);
	const [ dragPosition, onDragPosition ] = useState(currentPosition);
	const [ isDragging, setIsDragging ] = useState(false);
	useEffect(
		() => {
			if (
				currentPosition.top !== currentCurrentPosition.current.top ||
				currentPosition.left !== currentCurrentPosition.current.left
			) {
				currentCurrentPosition.current = currentPosition;
				onDragPosition(currentPosition);
			}
		},
		[ currentPosition ]
	);

	useEffect(
		() => {
			if (!target) return;
			const { ownerDocument } = target;
			const dragStartStopHandler = handleDragStartStop(target, isDragging, setIsDragging, onPositionChange);
			const dragHandler = handleDrag(onDragPosition, target, isDragging);
			target.addEventListener('click', dragStartStopHandler);
			ownerDocument.addEventListener(eventsFor.mouse.move, dragHandler);
			ownerDocument.addEventListener(eventsFor.touch.move, dragHandler);
			return () => {
				target.removeEventListener('click', dragStartStopHandler);
				ownerDocument.removeEventListener(eventsFor.mouse.move, dragHandler);
				ownerDocument.removeEventListener(eventsFor.touch.move, dragHandler);
			};
		},
		[ onDragPosition, onPositionChange, target, isDragging ]
	);

	return dragPosition;
};

export default useDraggable;
