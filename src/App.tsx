import { useEffect, useState } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faX } from '@fortawesome/free-solid-svg-icons';

function App() {
    const images = ['beach-with-palms', 'beach-with-palms2', 'beach', 'bmw-m2', 'audi-r8', 'mercedes-gt', 'bmw-m2',
        'forest-fog', 'forest-green', 'forest-lake', 'classy-watch', 'rolex', 'smart-watch', 'tissot-watch'];
    const breakpointMidScreen = 768;
    const breakpointLargeScreen = 1024;

    const [width, setWidth] = useState(0);
    const [selectedImage, setSelectedImage] = useState('');

    const handleWindowResize = () => setWidth(window.innerWidth);

    useEffect(() => {
        handleWindowResize();
        window.addEventListener("resize", handleWindowResize);
        window.addEventListener("keydown", handleKeyDown);

        // Return a function from the effect that removes the event listener
        return () => {
            window.removeEventListener("resize", handleWindowResize);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const handlePreviousImage = () => {
        setSelectedImage((prevSelectedImage) => {
            const prevSelectedImageIndex = images.indexOf(prevSelectedImage);
            if (prevSelectedImageIndex - 1 < 0) return prevSelectedImage;
            return images[prevSelectedImageIndex - 1];
        });
    };

    const handleNextImage = () => {
        setSelectedImage((prevSelectedImage) => {
            const prevSelectedImageIndex = images.indexOf(prevSelectedImage);
            if (prevSelectedImageIndex === images.length - 1) return prevSelectedImage;
            return images[prevSelectedImageIndex + 1];
        });
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        console.log(event.key);
        if (event.key === "ArrowRight") {
            handleNextImage();
        } else if (event.key === "ArrowLeft") {
            handlePreviousImage();
        } else if (event.key === "Escape") {
            setSelectedImage('');
        }
    };

    return (
        <div className='gallery'>
            {width < breakpointMidScreen &&
                <>
                    {images.map((image, index) => <img key={index} className="cursor-pointer" onClick={() => setSelectedImage(image)} src={`/${image}.jpg`} alt={image} />)}
                </>
            }

            {(width >= breakpointMidScreen && width <= breakpointLargeScreen) &&
                <>
                    <div className='gallery__first-column'>
                        {images.slice(0, images.length / 2).map((image, index) => <img key={index} className='gallery__image' onClick={() => setSelectedImage(image)} src={`/${image}.jpg`} alt={image} />)}
                    </div>
                    <div className="gallery__second-column">
                        {images.slice(images.length / 2, images.length).map((image, index) => <img key={index} className='gallery__image' onClick={() => setSelectedImage(image)} src={`/${image}.jpg`} alt={image} />)}
                    </div>
                </>
            }

            {width > breakpointLargeScreen &&
                <>
                    <div className='gallery__first-column'>
                        {images.slice(0, images.length / 3).map((image, index) => <img key={index} className='gallery__image' onClick={() => setSelectedImage(image)} src={`/${image}.jpg`} alt={image} />)}
                    </div>
                    <div className='gallery__second-column'>
                        {images.slice(images.length / 3, images.length / 1.5).map((image, index) => <img key={index} className='gallery__image' onClick={() => setSelectedImage(image)} src={`/${image}.jpg`} alt={image} />)}

                    </div>
                    <div className='gallery__third-column'>
                        {images.slice(images.length / 1.5, images.length).map((image, index) => <img key={index} className='gallery__image' onClick={() => setSelectedImage(image)} src={`/${image}.jpg`} alt={image} />)}
                    </div>
                </>
            }

            {selectedImage &&
                <div className="fixed inset-0 top-0 left-0 z-50 flex flex-col items-center w-full bg-black bg-opacity-90">
                    <div className="flex items-center justify-between w-full p-6">
                        <span className="flex-1 ml-10 text-2xl text-center md:ml-8">
                            {images.indexOf(selectedImage) + 1}/{images.length}
                        </span>
                        <FontAwesomeIcon
                            icon={faX}
                            className="ml-auto text-3xl cursor-pointer"
                            onClick={() => setSelectedImage('')}
                        />
                    </div>

                    <div className="flex items-center justify-center w-full h-full gap-6 lg:gap-52 xl:gap-80">
                        <FontAwesomeIcon
                            icon={faArrowLeft}
                            className="text-4xl cursor-pointer"
                            onClick={handlePreviousImage}
                        />
                        <img src={`/${selectedImage}.jpg`} alt={selectedImage} className="object-contain h-full md:w-full w-60 sm:w-96 lg:max-w-lg md:max-w-md" />
                        <FontAwesomeIcon
                            icon={faArrowRight}
                            className="text-4xl cursor-pointer"
                            onClick={handleNextImage}
                        />
                    </div>
                </div>
            }
        </div>
    );
}

export default App;
