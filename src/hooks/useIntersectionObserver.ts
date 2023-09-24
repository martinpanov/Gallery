import { MutableRefObject, useEffect, useState } from "react";

interface Images {
    name: string;
    tags: string[];
    category: string;
}

interface useIntersectionObserverProps {
    imagesRef: MutableRefObject<(HTMLDivElement | null)[]>;
    screenSize: string;
    displayedImages: Images[];
}

export default function useIntersectionObserver({ imagesRef, screenSize, displayedImages }: useIntersectionObserverProps) {
    const [visibleImages, setVisibleImages] = useState<number[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const imageIndex = parseInt(entry.target.getAttribute('data-index') || '0', 10);
                    if (!visibleImages.includes(imageIndex)) {
                        setVisibleImages(prevVisibleImages => [...prevVisibleImages, imageIndex]);
                    }
                }
            });
        }, { threshold: 0.4 });

        imagesRef.current.forEach((ref) => {
            if (ref) {
                observer.observe(ref);
            }
        });

        return () => {
            imagesRef.current.forEach((ref) => {
                if (ref) {
                    observer.unobserve(ref);
                }
            });
        };
    }, [imagesRef, screenSize, displayedImages]);

    return visibleImages;
}