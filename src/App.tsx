import { useEffect, useRef, useState } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faX, faMagnifyingGlass, faFilter } from '@fortawesome/free-solid-svg-icons';

function App() {
    const images = ['beach-with-palms', 'beach-with-palms2', 'beach', 'bmw-m2', 'audi-r8', 'mercedes-gt', 'bmw-m2',
        'forest-fog', 'forest-green', 'forest-lake', 'classy-watch', 'rolex', 'smart-watch', 'tissot-watch'];

    const [screenSize, setScreenSize] = useState('large');


    const [selectedImage, setSelectedImage] = useState('');
    const [visibleImages, setVisibleImages] = useState<number[]>([]);
    const [isOpenFilterMenu, setIsOpenFilterMenu] = useState(false);

    const imagesRef = useRef<(HTMLImageElement | null)[]>([]);

    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);
        window.addEventListener("keydown", handleKeyDown);

        // Return a function from the effect that removes the event listener
        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

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
    }, []);

    const handleResize = () => {
        const width = window.innerWidth;
        if (width <= 768) {
            setScreenSize('small');
        } else if (width <= 1024) {
            setScreenSize('medium');
        } else {
            setScreenSize('large');
        }
    };

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
        if (event.key === "ArrowRight") {
            handleNextImage();
        } else if (event.key === "ArrowLeft") {
            handlePreviousImage();
        } else if (event.key === "Escape") {
            setSelectedImage('');
        }
    };

    const openFilterMenu = () => {
        setIsOpenFilterMenu(prevState => !prevState);
    };

    return (
        <>
            <header className='header'>
                <nav className='header__nav'>
                    <div className='header__logo-wrapper'>
                        <img className='header__logo' src="/logo.png" alt="logo" />
                    </div>
                    <form className='header__form'>
                        <button className='header__form-buton'>
                            <FontAwesomeIcon
                                icon={faMagnifyingGlass}
                            />
                        </button>
                        <input className='header__input' type="text" />
                        <FontAwesomeIcon
                            icon={faFilter}
                            className='header__filter'
                            onClick={() => openFilterMenu()}
                        />
                        {isOpenFilterMenu &&
                            <div className='header__filter-menu'>
                                <h3>Filter options</h3>
                                <div>
                                    <input type="checkbox" name="car" id="car" />
                                    <label htmlFor="car">Car</label>
                                </div>
                                <div>
                                    <input type="checkbox" name="forest" id="forest" />
                                    <label htmlFor="car">Forest</label>
                                </div>
                                <div>
                                    <input type="checkbox" name="beach" id="beach" />
                                    <label htmlFor="car">Beach</label>
                                </div>
                                <div>
                                    <input type="checkbox" name="watch" id="watch" />
                                    <label htmlFor="car">Watch</label>
                                </div>
                            </div>
                        }
                    </form>
                </nav>
                <h1 className='header__title'>
                    Gallery
                </h1>
            </header>

            <main>
                <section className='gallery'>
                    {screenSize === 'small' &&
                        <>
                            {images.map((image, index) => <img key={index} className="cursor-pointer" onClick={() => setSelectedImage(image)} src={`/${image}.webp`} alt={image} />)}
                        </>
                    }

                    {screenSize === 'medium' &&
                        <>
                            <div className='gallery__first-column'>
                                {images.slice(0, images.length / 2).map((image, index) => <img key={index} className='gallery__image' onClick={() => setSelectedImage(image)} src={`/${image}.webp`} alt={image} />)}
                            </div>
                            <div className="gallery__second-column">
                                {images.slice(images.length / 2, images.length).map((image, index) => <img key={index} className='gallery__image' onClick={() => setSelectedImage(image)} src={`/${image}.webp`} alt={image} />)}
                            </div>
                        </>
                    }

                    {screenSize === 'large' &&
                        <>
                            <div className='gallery__first-column'>
                                {images.slice(0, images.length / 3).map((image, index) =>
                                    <img
                                        key={index}
                                        className={`gallery__image ${visibleImages.includes(index) ? 'active' : ''}`}
                                        data-index={index}
                                        ref={el => imagesRef.current[index] = el}
                                        onClick={() => setSelectedImage(image)}
                                        src={`/${image}-small.webp`}
                                        alt={image}
                                    />
                                )}
                            </div>
                            <div className='gallery__second-column'>
                                {images.slice(images.length / 3, images.length / 1.5).map((image, index) => <img
                                    key={index}
                                    className={`gallery__image ${visibleImages.includes(index + 4) ? 'active' : ''}`}
                                    data-index={index + 4}
                                    ref={el => imagesRef.current[index + 4] = el}
                                    onClick={() => setSelectedImage(image)}
                                    src={`/${image}-small.webp`}
                                    alt={image}
                                />)}
                            </div>
                            <div className='gallery__third-column'>
                                {images.slice(images.length / 1.5, images.length).map((image, index) => <img
                                    key={index}
                                    className={`gallery__image ${visibleImages.includes(index + 9) ? 'active' : ''}`}
                                    data-index={index + 9}
                                    ref={el => imagesRef.current[index + 9] = el}
                                    onClick={() => setSelectedImage(image)}
                                    src={`/${image}-small.webp`}
                                    alt={image}
                                />)}
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
                                <img src={`/${selectedImage}.webp`} alt={selectedImage} className="object-contain h-full md:w-full w-60 sm:w-96 lg:max-w-lg md:max-w-md" />
                                <FontAwesomeIcon
                                    icon={faArrowRight}
                                    className="text-4xl cursor-pointer"
                                    onClick={handleNextImage}
                                />
                            </div>
                        </div>
                    }
                </section>
            </main>
        </>
    );
}

export default App;
