import { faArrowLeft, faArrowRight, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import './Lightbox.css';


interface Images {
    name: string;
    tags: string[];
    category: string;
}

interface LightboxProps {
    displayedImages: Images[];
    selectedImage: Images;
    setSelectedImage: React.Dispatch<React.SetStateAction<Images>>;
}

export default function Lightbox({ displayedImages, selectedImage, setSelectedImage }: LightboxProps) {
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // the required distance between touchStart and touchEnd to be detected as a swipe
    const minSwipeDistance = 50;


    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);


    const handlePreviousImage = () => {
        setSelectedImage((prevSelectedImage) => {
            const prevSelectedImageIndex = displayedImages.findIndex(image => image.name === prevSelectedImage.name);
            if (prevSelectedImageIndex - 1 < 0) return prevSelectedImage;
            return displayedImages[prevSelectedImageIndex - 1];
        });
    };

    const handleNextImage = () => {
        setSelectedImage((prevSelectedImage) => {
            const prevSelectedImageIndex = displayedImages.findIndex(image => image.name === prevSelectedImage.name);
            if (prevSelectedImageIndex === displayedImages.length - 1) return prevSelectedImage;
            return displayedImages[prevSelectedImageIndex + 1];
        });
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "ArrowRight") {
            handleNextImage();
        } else if (event.key === "ArrowLeft") {
            handlePreviousImage();
        } else if (event.key === "Escape") {
            setSelectedImage({ name: '', tags: [], category: '' });
        }
    };

    const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) handleNextImage();
        if (isRightSwipe) handlePreviousImage();
    };
    return (
        <>
            {(selectedImage.name !== '' && selectedImage.tags.length > 0) &&
                <div className="gallery__lightbox">
                    <div className="gallery__lightbox-navigation">
                        <span className="gallery__lightbox-image-counter">
                            {displayedImages.findIndex(image => image.name === selectedImage.name) + 1}/{displayedImages.length}
                        </span>
                        <button className="gallery__lightbox-close button--default--styles" onClick={() => setSelectedImage({ name: '', tags: [], category: '' })}>
                            <FontAwesomeIcon icon={faX} />
                        </button>
                    </div>
                    <div
                        className="gallery__lightbox-main"
                        draggable
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        <button className="gallery__lightbox-arrows gallery__lightbox-left-arrow button--default--styles" onClick={handlePreviousImage}>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        <img src={`/${selectedImage.name}.webp`} alt={selectedImage.name} className="gallery__lightbox-image" />
                        <button className="gallery__lightbox-arrows gallery__lightbox-right-arrow button--default--styles" onClick={handleNextImage}>
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    </div>
                </div>
            }
        </>
    );
}