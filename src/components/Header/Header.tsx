import { faFilter, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import './Header.css';

interface Images {
    name: string;
    tags: string[];
    category: string;
}

interface FormData {
    tag: string,
    car: string,
    forest: string,
    beach: string,
    watch: string;
}

interface HeaderProps {
    images: Images[];
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    setDisplayedImages: React.Dispatch<React.SetStateAction<Images[]>>;
}

export default function Header({ images, formData, setFormData, setDisplayedImages }: HeaderProps) {
    const [isInputFocused, setisInputFocused] = useState(false);
    const [isOpenFilterMenu, setIsOpenFilterMenu] = useState(false);


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


    const openFilterMenu = () => {
        setIsOpenFilterMenu(prevState => !prevState);
    };

    return (
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
    );
}