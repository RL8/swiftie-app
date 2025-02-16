export function tapAnimation(node: HTMLElement) {
    const duration = '150ms';
    const easing = 'cubic-bezier(0.4, 0, 0.2, 1)';

    function setTransition() {
        node.style.transition = `transform ${duration} ${easing}`;
    }

    function handleTouchStart() {
        setTransition();
        node.style.transform = 'scale(0.97)';
    }
    
    function handleTouchEnd() {
        setTransition();
        node.style.transform = 'scale(1)';
    }

    // Add initial transition
    setTransition();

    node.addEventListener('touchstart', handleTouchStart);
    node.addEventListener('touchend', handleTouchEnd);
    // Also handle mouse for desktop testing
    node.addEventListener('mousedown', handleTouchStart);
    node.addEventListener('mouseup', handleTouchEnd);
    node.addEventListener('mouseleave', handleTouchEnd);

    return {
        destroy() {
            node.removeEventListener('touchstart', handleTouchStart);
            node.removeEventListener('touchend', handleTouchEnd);
            node.removeEventListener('mousedown', handleTouchStart);
            node.removeEventListener('mouseup', handleTouchEnd);
            node.removeEventListener('mouseleave', handleTouchEnd);
        }
    };
}
