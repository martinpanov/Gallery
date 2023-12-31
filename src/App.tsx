import { useEffect, useRef, useState } from 'react';
import './App.css';
import './variables.css';
import Header from './components/Header/Header';
import Lightbox from './components/Lightbox/Lightbox';
import useIntersectionObserver from './hooks/useIntersectionObserver';

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
        { name: 'tissot-watch', tags: ['vintage', 'tissot', 'classy'], category: 'watch' }, { name: 'rolex', tags: ['rolex', 'shiny', 'expensive'], category: 'watch' },
        { name: 'smart-watch', tags: ['smart', 'technology', 'apple'], category: 'watch' }];

    const [displayedImages, setDisplayedImages] = useState([...images]);

    const [screenSize, setScreenSize] = useState('large');
    const [selectedImage, setSelectedImage] = useState<Images>({ name: '', tags: [], category: '' });
    const [formData, setFormData] = useState({
        tag: '',
        car: '',
        forest: '',
        beach: '',
        watch: ''
    });

    const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
    const visibleImages = useIntersectionObserver({ imagesRef, screenSize, displayedImages });

    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);


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

    return (
        <>
            <Header
                images={images}
                formData={formData}
                setFormData={setFormData}
                setDisplayedImages={setDisplayedImages}
            />

            <main>
                <section className='gallery'>
                    {screenSize === 'small' &&
                        <div className='gallery__first-column'>
                            {displayedImages.map((image, index) =>
                                <div
                                    key={index}
                                    className={`gallery__image-container ${visibleImages.includes(index) ? 'active' : ''}`}
                                    data-index={index}
                                    ref={el => imagesRef.current[index] = el}
                                    onClick={() => setSelectedImage(image)}
                                >
                                    <div className='gallery__image-info'>
                                        <h3 className='gallery__image-heading'>Tags</h3>
                                        <ul role='list' className='gallery__list-items'>
                                            <li>{image.tags[0]}</li>
                                            <li>{image.tags[1]}</li>
                                            <li>{image.tags[2]}</li>
                                        </ul>
                                    </div>
                                    <img
                                        className='gallery__image'
                                        src={`/${image.name}.webp`}
                                        alt={image.name}
                                    />
                                </div>
                            )}
                        </div>
                    }

                    {screenSize === 'medium' &&
                        ['first', 'second'].map((columnNum, columnIndex) => {
                            return <div key={columnIndex} className={`gallery__${columnNum}-column`}>
                                {displayedImages.map((image, index) => {
                                    if (index % 2 === columnIndex) {
                                        return <div
                                            key={index}
                                            className={`gallery__image-container ${visibleImages.includes(index) ? 'active' : ''}`}
                                            data-index={index}
                                            ref={el => imagesRef.current[index] = el}
                                            onClick={() => setSelectedImage(image)}
                                        >
                                            <div className='gallery__image-info'>
                                                <h3 className='gallery__image-heading'>Tags</h3>
                                                <ul role='list' className='gallery__list-items'>
                                                    <li>{image.tags[0]}</li>
                                                    <li>{image.tags[1]}</li>
                                                    <li>{image.tags[2]}</li>
                                                </ul>
                                            </div>
                                            <img
                                                className='gallery__image'
                                                src={`/${image.name}.webp`}
                                                alt={image.name}
                                            />
                                        </div>;
                                    }
                                })
                                }
                            </div>;
                        })
                    }

                    {screenSize === 'large' &&
                        <>
                            {displayedImages.length === 1 &&
                                <div className='gallery__first-column'>
                                    <div
                                        className={`gallery__image-container ${visibleImages.includes(0) ? 'active' : ''}`}
                                        data-index={0}
                                        ref={el => imagesRef.current[0] = el}
                                        onClick={() => setSelectedImage(displayedImages[0])}
                                    >
                                        <div className='gallery__image-info'>
                                            <h3 className='gallery__image-heading'>Tags</h3>
                                            <ul role='list' className='gallery__list-items'>
                                                <li>{displayedImages[0].tags[0]}</li>
                                                <li>{displayedImages[0].tags[1]}</li>
                                                <li>{displayedImages[0].tags[2]}</li>
                                            </ul>
                                        </div>
                                        <img
                                            className='gallery__image'
                                            src={`/${displayedImages[0].name}-small.webp`}
                                            alt={displayedImages[0].name}
                                        />
                                    </div>
                                </div>
                            }
                            {displayedImages.length === 2 &&
                                ['first', 'second'].map((columnNum, columnIndex) => {
                                    return <div key={columnIndex} className={`gallery__${columnNum}-column`}>
                                        {displayedImages.map((image, index) => {
                                            if (index % 2 === columnIndex) {
                                                return <div
                                                    key={index}
                                                    className={`gallery__image-container ${visibleImages.includes(index) ? 'active' : ''}`}
                                                    data-index={index}
                                                    ref={el => imagesRef.current[index] = el}
                                                    onClick={() => setSelectedImage(image)}
                                                >
                                                    <div className='gallery__image-info'>
                                                        <h3 className='gallery__image-heading'>Tags</h3>
                                                        <ul role='list' className='gallery__list-items'>
                                                            <li>{image.tags[0]}</li>
                                                            <li>{image.tags[1]}</li>
                                                            <li>{image.tags[2]}</li>
                                                        </ul>
                                                    </div>
                                                    <img
                                                        className='gallery__image'
                                                        src={`/${image.name}-small.webp`}
                                                        alt={image.name}
                                                    />;
                                                </div>;
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
                                                return <div
                                                    key={index}
                                                    className={`gallery__image-container ${visibleImages.includes(index) ? 'active' : ''}`}
                                                    data-index={index}
                                                    ref={el => imagesRef.current[index] = el}
                                                    onClick={() => setSelectedImage(image)}
                                                >
                                                    <div className='gallery__image-info'>
                                                        <h3 className='gallery__image-heading'>Tags</h3>
                                                        <ul role='list' className='gallery__list-items'>
                                                            <li>{image.tags[0]}</li>
                                                            <li>{image.tags[1]}</li>
                                                            <li>{image.tags[2]}</li>
                                                        </ul>
                                                    </div>
                                                    <img
                                                        className='gallery__image'
                                                        src={`/${image.name}.webp`}
                                                        alt={image.name}
                                                    />
                                                </div>;
                                            }
                                        }
                                        )}
                                    </div>;
                                })

                            }
                        </>
                    }

                    <Lightbox
                        displayedImages={displayedImages}
                        selectedImage={selectedImage}
                        setSelectedImage={setSelectedImage}
                    />
                </section>
            </main>
        </>
    );
}

export default App;
