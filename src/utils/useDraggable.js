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
const handleDragStart = (target, setIsDragging) => (e) => {
	e = e || window.event;
	if (e.target !== target) return;
	e.preventDefault();
	setIsDragging(true);
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
 * handleDragStop
 * @param {*} onPositionChange
 */
const handleDragStop = (onPositionChange, target, isDragging, setIsDragging) => (e) => {
	e = e || window.event;
	if (!isDragging) return;
	e.preventDefault();

	const pos = {
		top: e.clientY,
		left: e.clientX
	};
	setIsDragging(false);

	// set the element's new position:
	onPositionChange({
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
			const dragStartHandler = handleDragStart(target, setIsDragging);
			const dragHandler = handleDrag(onDragPosition, target, isDragging);
			const dragStopHandler = handleDragStop(onPositionChange, target, isDragging, setIsDragging);
			ownerDocument.addEventListener(eventsFor.mouse.start, dragStartHandler);
			ownerDocument.addEventListener(eventsFor.touch.start, dragStartHandler);
			ownerDocument.addEventListener(eventsFor.mouse.move, dragHandler);
			ownerDocument.addEventListener(eventsFor.touch.move, dragHandler);
			ownerDocument.addEventListener(eventsFor.mouse.stop, dragStopHandler);
			ownerDocument.addEventListener(eventsFor.touch.stop, dragStopHandler);
			// target.addEventListener(eventsFor.touch.start, onTouchStart, { passive: false });
			return () => {
				ownerDocument.removeEventListener(eventsFor.mouse.start, dragStartHandler);
				ownerDocument.removeEventListener(eventsFor.touch.start, dragStartHandler);
				ownerDocument.removeEventListener(eventsFor.mouse.move, dragHandler);
				ownerDocument.removeEventListener(eventsFor.touch.move, dragHandler);
				ownerDocument.removeEventListener(eventsFor.mouse.stop, dragStopHandler);
				ownerDocument.removeEventListener(eventsFor.touch.stop, dragStopHandler);
			};
		},
		[ onDragPosition, onPositionChange, target, isDragging ]
	);

	return dragPosition;
};

export default useDraggable;
