import { useEffect, useRef, useState } from 'react';
import './App.css';
import './variables.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faX, faMagnifyingGlass, faFilter } from '@fortawesome/free-solid-svg-icons';

function App() {
    const images = ['beach-with-palms', 'beach-with-palms2', 'beach', 'bmw-m2', 'audi-r8', 'mercedes-gt',
        'forest-fog', 'forest-green', 'forest-lake', 'classy-watch', 'rolex', 'smart-watch', 'tissot-watch'];

    const [screenSize, setScreenSize] = useState('large');


    const [selectedImage, setSelectedImage] = useState('');
    const [visibleImages, setVisibleImages] = useState<number[]>([]);
    const [isOpenFilterMenu, setIsOpenFilterMenu] = useState(false);
    const [formData, setFormData] = useState({});
    const [isInputFocused, setisInputFocused] = useState(false);

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
            console.log(entries);

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
    }, [screenSize]);

    const handleResize = () => {
        const width = window.innerWidth;
        if (width < 768) {
            setScreenSize('small');
        } else if (width < 1024) {
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

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (event.target.type === 'checkbox') {
            return setFormData(prevState => ({ ...prevState, [name]: event.target.checked }));
        }

        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    return (
        <>
            <header className='header'>
                <nav className='header__nav'>
                    <div className='header__logo-wrapper'>
                        <img className='header__logo' src="/logo.png" alt="logo" />
                    </div>
                    <form className={`header__form ${isInputFocused ? 'active' : ''}`} onSubmit={handleFormSubmit}>
                        <button className='header__form-buton button--default--styles'>
                            <FontAwesomeIcon
                                icon={faMagnifyingGlass}
                            />
                        </button>
                        <input
                            className={`header__input ${isInputFocused ? 'active' : ''}`}
                            type='text'
                            name='tag'
                            placeholder='Tags'
                            onChange={handleChange}
                            onClick={() => setisInputFocused(true)}
                            onBlur={() => setisInputFocused(false)}
                        />
                        <button className='header__filter button--default--styles'>
                            <FontAwesomeIcon
                                icon={faFilter}
                                className='header__filter'
                                onClick={() => openFilterMenu()}
                            />
                        </button>
                        {isOpenFilterMenu &&
                            <div className='header__filter-menu'>
                                <h3>Filter options</h3>
                                <div>
                                    <input type="checkbox" name="car" id="car" onChange={handleChange} />
                                    <label htmlFor="car">Car</label>
                                </div>
                                <div>
                                    <input type="checkbox" name="forest" id="forest" onChange={handleChange} />
                                    <label htmlFor="forest">Forest</label>
                                </div>
                                <div>
                                    <input type="checkbox" name="beach" id="beach" onChange={handleChange} />
                                    <label htmlFor="beach">Beach</label>
                                </div>
                                <div>
                                    <input type="checkbox" name="watch" id="watch" onChange={handleChange} />
                                    <label htmlFor="watch">Watch</label>
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
                        <div className='gallery__first-column'>
                            {images.map((image, index) =>
                                <img
                                    key={index}
                                    className={`gallery__image ${visibleImages.includes(index) ? 'active' : ''}`}
                                    data-index={index}
                                    ref={el => imagesRef.current[index] = el}
                                    onClick={() => setSelectedImage(image)}
                                    src={`/${image}.webp`}
                                    alt={image}
                                />
                            )}
                        </div>
                    }

                    {screenSize === 'medium' &&
                        <>
                            <div className='gallery__first-column'>
                                {images.slice(0, images.length / 2).map((image, index) =>
                                    <img
                                        key={index}
                                        className={`gallery__image ${visibleImages.includes(index) ? 'active' : ''}`}
                                        data-index={index}
                                        ref={el => imagesRef.current[index] = el}
                                        onClick={() => setSelectedImage(image)}
                                        src={`/${image}.webp`}
                                        alt={image}
                                    />
                                )}
                            </div>
                            <div className="gallery__second-column">
                                {images.slice(images.length / 2, images.length).map((image, index) =>
                                    <img
                                        key={index + 7}
                                        className={`gallery__image ${visibleImages.includes(index + 7) ? 'active' : ''}`}
                                        data-index={index + 7}
                                        ref={el => imagesRef.current[index + 7] = el}
                                        onClick={() => setSelectedImage(image)}
                                        src={`/${image}.webp`}
                                        alt={image}
                                    />
                                )}
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
                                    key={index + 4}
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
                                    key={index + 9}
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
                        <div className="gallery__lightbox">
                            <div className="gallery__lightbox-navigation">
                                <span className="gallery__lightbox-image-counter">
                                    {images.indexOf(selectedImage) + 1}/{images.length}
                                </span>
                                <button className="gallery__lightbox-close button--default--styles" onClick={() => setSelectedImage('')}>
                                    <FontAwesomeIcon icon={faX} />
                                </button>
                            </div>
                            <div className="gallery__lightbox-main">
                                <button className="gallery__lightbox-arrows gallery__lightbox-left-arrow button--default--styles" onClick={handlePreviousImage}>
                                    <FontAwesomeIcon icon={faArrowLeft} />
                                </button>
                                <img src={`/${selectedImage}.webp`} alt={selectedImage} className="gallery__lightbox-image" />
                                <button className="gallery__lightbox-arrows gallery__lightbox-right-arrow button--default--styles" onClick={handleNextImage}>
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </button>
                            </div>
                        </div>
                    }
                </section>
            </main>
        </>
    );
}

export default App;
