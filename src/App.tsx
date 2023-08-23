import { useEffect, useRef, useState } from 'react';
import './App.css';
import './variables.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faX, faMagnifyingGlass, faFilter } from '@fortawesome/free-solid-svg-icons';

interface Images {
    name: string;
    tags: string[];
    category: string;
}

function App() {
    const images: Images[] = [
        { name: 'beach-with-palms', tags: ['beach', 'palms', 'water'], category: 'beach' }, { name: 'beach-with-palms2', tags: ['beach', 'palms', 'sand'], category: 'beach' },
        { name: 'beach', tags: ['beach', 'sand', 'water'], category: 'beach' }, { name: 'bmw-m2', tags: ['car', 'bmw', 'fast'], category: 'car' },
        { name: 'audi-r8', tags: ['car', 'audi', 'sport'], category: 'car' }, { name: 'mercedes-gt', tags: ['car', 'mercedes', 'yellow'], category: 'car' },
        { name: 'forest-fog', tags: ['trees', 'fog', 'beautiful'], category: 'forest' }, { name: 'forest-green', tags: ['green', 'trees', 'grass'], category: 'forest' },
        { name: 'forest-lake', tags: ['lake', 'mountain', 'people'], category: 'forest' }, { name: 'classy-watch', tags: ['suit', 'classy', 'rolex'], category: 'watch' },
        { name: 'rolex', tags: ['rolex', 'shiny', 'expensive'], category: 'watch' }, { name: 'smart-watch', tags: ['smart', 'technology', 'apple'], category: 'watch' },
        { name: 'tissot-watch', tags: ['vintage', 'tissot', 'classy'], category: 'watch' }];

    const [displayedImages, setDisplayedImages] = useState([...images]);

    const [screenSize, setScreenSize] = useState('large');
    const [selectedImage, setSelectedImage] = useState<Images>({ name: '', tags: [], category: '' });
    const [visibleImages, setVisibleImages] = useState<number[]>([]);
    const [isOpenFilterMenu, setIsOpenFilterMenu] = useState(false);
    const [formData, setFormData] = useState({});
    const [isInputFocused, setisInputFocused] = useState(false);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // the required distance between touchStart and touchEnd to be detected as a swipe
    const minSwipeDistance = 50;

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
    }, [screenSize, displayedImages]);

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
            const prevSelectedImageIndex = images.findIndex(image => image.name === prevSelectedImage.name);
            if (prevSelectedImageIndex - 1 < 0) return prevSelectedImage;
            return images[prevSelectedImageIndex - 1];
        });
    };

    const handleNextImage = () => {
        setSelectedImage((prevSelectedImage) => {
            const prevSelectedImageIndex = images.findIndex(image => image.name === prevSelectedImage.name);
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
            setSelectedImage({ name: '', tags: [], category: '' });
        }
    };

    const openFilterMenu = () => {
        setIsOpenFilterMenu(prevState => !prevState);
    };

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formDataObjectValues = Object.values(formData).every(value => value === '');

        if (formDataObjectValues) {
            return setDisplayedImages(images);
        }

        setDisplayedImages(images.filter(image => image.tags.includes(formData.tag) || Object.values(formData).some(value => value === image.category)));
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (event.target.type === 'checkbox') {
            if (event.target.checked === false) {
                return setFormData(prevState => ({ ...prevState, [name]: '' }));
            }
            return setFormData(prevState => ({ ...prevState, [name]: name }));
        }

        setFormData(prevState => ({ ...prevState, [name]: value }));
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
                            {displayedImages.map((image, index) =>
                                <img
                                    key={index}
                                    className={`gallery__image ${visibleImages.includes(index) ? 'active' : ''}`}
                                    data-index={index}
                                    ref={el => imagesRef.current[index] = el}
                                    onClick={() => setSelectedImage(image)}
                                    src={`/${image.name}.webp`}
                                    alt={image.name}
                                />
                            )}
                        </div>
                    }

                    {screenSize === 'medium' &&
                        ['first', 'second'].map((columnNum, columnIndex) => {
                            return <div key={columnIndex} className={`gallery__${columnNum}-column`}>
                                {displayedImages.map((image, index) => {
                                    if (index % 2 === columnIndex) {
                                        return <img
                                            key={index}
                                            className={`gallery__image ${visibleImages.includes(index) ? 'active' : ''}`}
                                            data-index={index}
                                            ref={el => imagesRef.current[index] = el}
                                            onClick={() => setSelectedImage(image)}
                                            src={`/${image.name}-small.webp`}
                                            alt={image.name}
                                        />;
                                    }
                                }
                                )}
                            </div>;
                        })
                    }

                    {screenSize === 'large' &&
                        <>
                            {displayedImages.length === 1 &&
                                <div className='gallery__first-column'>
                                    {displayedImages.map((image, index) =>
                                        <img
                                            key={index}
                                            className={`gallery__image ${visibleImages.includes(index) ? 'active' : ''}`}
                                            data-index={index}
                                            ref={el => imagesRef.current[index] = el}
                                            onClick={() => setSelectedImage(image)}
                                            src={`/${image.name}-small.webp`}
                                            alt={image.name}
                                        />
                                    )}
                                </div>
                            }

                            {displayedImages.length === 2 &&
                                ['first', 'second'].map((columnNum, columnIndex) => {
                                    return <div key={columnIndex} className={`gallery__${columnNum}-column`}>
                                        {displayedImages.map((image, index) => {
                                            if (index % 2 === columnIndex) {
                                                return <img
                                                    key={index}
                                                    className={`gallery__image ${visibleImages.includes(index) ? 'active' : ''}`}
                                                    data-index={index}
                                                    ref={el => imagesRef.current[index] = el}
                                                    onClick={() => setSelectedImage(image)}
                                                    src={`/${image.name}-small.webp`}
                                                    alt={image.name}
                                                />;
                                            }
                                        }
                                        )}
                                    </div>;
                                })
                            }

                            {displayedImages.length >= 3 &&
                                ['first', 'second', 'third'].map((columnNum, columnIndex) => {
                                    return <div key={columnIndex} className={`gallery__${columnNum}-column`}>
                                        {displayedImages.map((image, index) => {
                                            if (index % 3 === columnIndex) {
                                                return <img
                                                    key={index}
                                                    className={`gallery__image ${visibleImages.includes(index) ? 'active' : ''}`}
                                                    data-index={index}
                                                    ref={el => imagesRef.current[index] = el}
                                                    onClick={() => setSelectedImage(image)}
                                                    src={`/${image.name}-small.webp`}
                                                    alt={image.name}
                                                />;
                                            }
                                        }
                                        )}
                                    </div>;
                                })

                            }
                        </>
                    }

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
                </section>
            </main>
        </>
    );
}

export default App;
