"use client";

import {
    useState,
    useRef,
    useEffect,
    type TouchEvent,
    type MouseEvent,
} from "react";

interface UseCarouselProps {
    itemCount: number;
    visibleItems?: number;
    initialIndex?: number;
}

export function useCarousel({
    itemCount,
    visibleItems = 1,
    initialIndex = 0,
}: UseCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(initialIndex);
    const [isDragging, setIsDragging] = useState(false);
    const [startPosition, setStartPosition] = useState(0);
    const [currentTranslate, setCurrentTranslate] = useState(0);
    const [prevTranslate, setPrevTranslate] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const animationRef = useRef<number>();
    const containerRef = useRef<HTMLDivElement>(null);

    const getPositionX = (
        event: TouchEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>
    ) => {
        return "touches" in event ? event.touches[0].clientX : event.clientX;
    };

    const setPositionByIndex = (index: number, animate = true) => {
        if (!containerRef.current) return;

        // Calculate the slide width based on visible items
        const slideWidth = containerRef.current.offsetWidth / visibleItems;

        // For a carousel showing multiple items, we need to adjust the position
        // to show the correct set of items
        const position = slideWidth * index * -1;
        setCurrentTranslate(position);
        setPrevTranslate(position);

        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }

        if (containerRef.current) {
            if (animate) {
                containerRef.current.style.transition =
                    "transform 0.3s ease-out";
            } else {
                containerRef.current.style.transition = "none";
            }
            containerRef.current.style.transform = `translateX(${position}px)`;
        }
    };

    const touchStart = (
        event: TouchEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>
    ) => {
        if (isAnimating) return;
        setIsDragging(true);
        setStartPosition(getPositionX(event));
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        if (containerRef.current) {
            containerRef.current.style.transition = "none";
        }
    };

    const touchMove = (
        event: TouchEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>
    ) => {
        if (!isDragging || isAnimating) return;

        const currentPosition = getPositionX(event);
        const currentDiff = currentPosition - startPosition;
        const translate = prevTranslate + currentDiff;

        setCurrentTranslate(translate);
        animationRef.current = requestAnimationFrame(() => {
            if (containerRef.current) {
                containerRef.current.style.transform = `translateX(${translate}px)`;
            }
        });
    };

    const touchEnd = () => {
        if (isAnimating) return;
        setIsDragging(false);
        const movedBy = currentTranslate - prevTranslate;

        if (!containerRef.current) return;

        // Calculate slide width
        const slideWidth = containerRef.current.offsetWidth / visibleItems;

        // Determine if the drag was significant enough to change slide
        if (Math.abs(movedBy) > slideWidth / 4) {
            if (movedBy < 0) {
                // Dragged left (next)
                nextSlide();
            } else {
                // Dragged right (prev)
                prevSlide();
            }
        } else {
            // Not enough drag, snap back
            setPositionByIndex(activeIndex);
        }

        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
    };

    const nextSlide = () => {
        if (isAnimating) return;

        setIsAnimating(true);

        setActiveIndex((prevIndex) => {
            // For multiple visible items, we need to adjust when we reach the end
            const newIndex = prevIndex + 1;
            // We should stop at itemCount - visibleItems + 1 for the last set of items
            const maxIndex = Math.max(0, itemCount - visibleItems);

            if (newIndex > maxIndex) {
                // Smooth transition to first item
                setTimeout(() => {
                    if (containerRef.current) {
                        containerRef.current.style.transition = "none";
                        setActiveIndex(0);
                        setTimeout(() => {
                            if (containerRef.current) {
                                containerRef.current.style.transition =
                                    "transform 0.3s ease-out";
                                setIsAnimating(false);
                            }
                        }, 50);
                    }
                }, 300);
                return newIndex;
            }

            setTimeout(() => {
                setIsAnimating(false);
            }, 300);

            return newIndex;
        });
    };

    const prevSlide = () => {
        if (isAnimating) return;

        setIsAnimating(true);

        setActiveIndex((prevIndex) => {
            const newIndex = prevIndex - 1;
            if (newIndex < 0) {
                // For multiple visible items, we need to go to the last valid index
                const maxIndex = Math.max(0, itemCount - visibleItems);

                // Smooth transition to last item
                setTimeout(() => {
                    if (containerRef.current) {
                        containerRef.current.style.transition = "none";
                        setActiveIndex(maxIndex);
                        setTimeout(() => {
                            if (containerRef.current) {
                                containerRef.current.style.transition =
                                    "transform 0.3s ease-out";
                                setIsAnimating(false);
                            }
                        }, 50);
                    }
                }, 300);
                return newIndex;
            }

            setTimeout(() => {
                setIsAnimating(false);
            }, 300);

            return newIndex;
        });
    };

    const goToSlide = (index: number) => {
        if (isAnimating) return;
        setIsAnimating(true);
        setActiveIndex(index);
        setTimeout(() => {
            setIsAnimating(false);
        }, 300);
    };

    // Update position when activeIndex changes
    useEffect(() => {
        // Handle the case where we're at an invalid index (during transitions)
        if (activeIndex >= 0 && activeIndex < itemCount) {
            setPositionByIndex(activeIndex);
        } else {
            // We're in a transition state, still animate
            setPositionByIndex(activeIndex < 0 ? -1 : itemCount);
        }
    }, [activeIndex, itemCount]);

    // Reset when the window resizes
    useEffect(() => {
        const handleResize = () => {
            if (activeIndex >= 0 && activeIndex < itemCount) {
                setPositionByIndex(activeIndex, false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [activeIndex, itemCount]);

    // Clean up animation frame on unmount
    useEffect(() => {
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    const touchHandlers = {
        onTouchStart: touchStart,
        onTouchMove: touchMove,
        onTouchEnd: touchEnd,
        onMouseDown: touchStart,
        onMouseMove: touchMove,
        onMouseUp: touchEnd,
        onMouseLeave: touchEnd,
    };

    return {
        activeIndex,
        containerRef,
        setActiveIndex,
        nextSlide,
        prevSlide,
        goToSlide,
        touchHandlers,
        isDragging,
        isAnimating,
    };
}
