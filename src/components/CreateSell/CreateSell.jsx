import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../../services/productData';
import SimpleSider from '../SimpleSider/SimpleSider';

function CreateSell() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ 
        title: "", 
        price: "", 
        description: "", 
        city: "", 
        category: "", 
        image: "",
        bookingDetails: null
    });
    const [loading, setLoading] = useState(false);
    const [alertShow, setAlertShow] = useState(false);
    const [errors, setErrors] = useState([]);

    const onChangeHandler = (e) => {
        e.preventDefault();
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.files) {
            setFormData({ ...formData, image: e.target.files[0] });
        }

        // Reset booking details when category changes
        if (e.target.name === 'category') {
            if (['properties', 'auto'].includes(e.target.value)) {
                setFormData(prev => ({
                    ...prev,
                    bookingDetails: e.target.value === 'properties' 
                        ? { pricePerNight: "", minNights: 2, maxNights: 30 }
                        : { pricePerDay: "", minDays: 1, maxDays: 30 }
                }));
            } else {
                setFormData(prev => ({ ...prev, bookingDetails: null }));
            }
        }
    };

    const onBookingDetailsChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            bookingDetails: {
                ...prev.bookingDetails,
                [name]: value
            }
        }));
    };

    const onSubmitHandler = (e) => {
        e.preventDefault();
        let { title, price, description, city, category, image, bookingDetails } = formData;
        let obj = { title, price, description, city, category };
        
        if (bookingDetails) {
            obj.bookingDetails = bookingDetails;
        }
        
        setLoading(true);
        getBase64(image)
            .then((data) => {
                obj['image'] = data;
                createProduct(obj)
                    .then(res => {
                        if (res.error) {
                            setLoading(false);
                            setErrors(res.error);
                            setAlertShow(true);
                        } else {
                            navigate(`/categories/${category}/${res.productId}/details`);
                        }
                    })
                    .catch(err => console.error('Creating product err: ', err));
            })
            .catch(err => console.error('Converting to base64 err: ', err));
    };

    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    return (
        <>
            <SimpleSider params="Add product" />
            <div className="container mx-auto px-4">
                <form className="max-w-4xl mx-auto" onSubmit={onSubmitHandler}>
                    {alertShow && (
                        <div className="bg-red-900/30 text-red-300 border border-red-800 p-4 mb-4 rounded-md" role="alert">
                            <span className="block sm:inline">{errors}</span>
                            <button 
                                className="absolute top-0 right-0 p-4 text-red-300 hover:text-red-100"
                                onClick={() => setAlertShow(false)}
                            >
                                &times;
                            </button>
                        </div>
                    )}
                    
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="block text-sm font-medium text-text-secondary mb-1" htmlFor="title">
                                Title
                            </label>
                            <input 
                                className="block w-full px-3 py-2 bg-background-secondary border border-background-tertiary rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-accent-primary text-text-primary"
                                id="title" 
                                type="text" 
                                name="title" 
                                placeholder="Enter title" 
                                onChange={onChangeHandler} 
                                required 
                            />
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label className="block text-sm font-medium text-text-secondary mb-1" htmlFor="price">
                                Price
                            </label>
                            <input 
                                className="block w-full px-3 py-2 bg-background-secondary border border-background-tertiary rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-accent-primary text-text-primary"
                                id="price" 
                                type="number" 
                                step="0.01" 
                                name="price" 
                                placeholder="Price" 
                                onChange={onChangeHandler} 
                                required 
                            />
                        </div>
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-text-secondary mb-1" htmlFor="description">
                            Description
                        </label>
                        <textarea 
                            className="block w-full px-3 py-2 bg-background-secondary border border-background-tertiary rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-accent-primary text-text-primary"
                            id="description" 
                            name="description" 
                            rows="3" 
                            onChange={onChangeHandler} 
                            required
                        ></textarea>
                    </div>
                    
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                            <label className="block text-sm font-medium text-text-secondary mb-1" htmlFor="city">
                                City
                            </label>
                            <input 
                                className="block w-full px-3 py-2 bg-background-secondary border border-background-tertiary rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-accent-primary text-text-primary"
                                id="city" 
                                type="text" 
                                name="city" 
                                placeholder="Sofia" 
                                onChange={onChangeHandler} 
                                required 
                            />
                        </div>
                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                            <label className="block text-sm font-medium text-text-secondary mb-1" htmlFor="category">
                                Category
                            </label>
                            <select 
                                className="block w-full px-3 py-2 bg-background-secondary border border-background-tertiary rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-accent-primary text-text-primary"
                                id="category" 
                                name="category" 
                                defaultValue="Choose..." 
                                onChange={onChangeHandler} 
                                required
                            >
                                <option>Choose...</option>
                                <option>properties</option>
                                <option>auto</option>
                                <option>electronics</option>
                                <option>clothes</option>
                                <option>toys</option>
                                <option>home</option>
                                <option>garden</option>
                            </select>
                        </div>
                        <div className="w-full md:w-1/3 px-3">
                            <label className="block text-sm font-medium text-text-secondary mb-1" htmlFor="image">
                                Image
                            </label>
                            <input 
                                className="block w-full px-3 py-2 bg-background-secondary border border-background-tertiary rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-accent-primary text-text-primary"
                                id="image" 
                                type="file" 
                                name="image" 
                                onChange={onChangeHandler} 
                                required 
                            />
                        </div>
                    </div>

                    {/* Booking details for properties */}
                    {formData.category === 'properties' && (
                        <div className="mb-6 p-4 border border-background-tertiary rounded-md">
                            <h3 className="text-lg font-medium text-accent-primary mb-4">Booking Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">
                                        Price per Night (€)
                                    </label>
                                    <input 
                                        type="number"
                                        name="pricePerNight"
                                        value={formData.bookingDetails?.pricePerNight || ''}
                                        onChange={onBookingDetailsChange}
                                        className="block w-full px-3 py-2 bg-background-secondary border border-background-tertiary rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">
                                        Minimum Nights
                                    </label>
                                    <input 
                                        type="number"
                                        name="minNights"
                                        value={formData.bookingDetails?.minNights || ''}
                                        onChange={onBookingDetailsChange}
                                        className="block w-full px-3 py-2 bg-background-secondary border border-background-tertiary rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">
                                        Maximum Nights
                                    </label>
                                    <input 
                                        type="number"
                                        name="maxNights"
                                        value={formData.bookingDetails?.maxNights || ''}
                                        onChange={onBookingDetailsChange}
                                        className="block w-full px-3 py-2 bg-background-secondary border border-background-tertiary rounded-md"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Booking details for auto */}
                    {formData.category === 'auto' && (
                        <div className="mb-6 p-4 border border-background-tertiary rounded-md">
                            <h3 className="text-lg font-medium text-accent-primary mb-4">Booking Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">
                                        Price per Day (€)
                                    </label>
                                    <input 
                                        type="number"
                                        name="pricePerDay"
                                        value={formData.bookingDetails?.pricePerDay || ''}
                                        onChange={onBookingDetailsChange}
                                        className="block w-full px-3 py-2 bg-background-secondary border border-background-tertiary rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">
                                        Minimum Days
                                    </label>
                                    <input 
                                        type="number"
                                        name="minDays"
                                        value={formData.bookingDetails?.minDays || ''}
                                        onChange={onBookingDetailsChange}
                                        className="block w-full px-3 py-2 bg-background-secondary border border-background-tertiary rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">
                                        Maximum Days
                                    </label>
                                    <input 
                                        type="number"
                                        name="maxDays"
                                        value={formData.bookingDetails?.maxDays || ''}
                                        onChange={onBookingDetailsChange}
                                        className="block w-full px-3 py-2 bg-background-secondary border border-background-tertiary rounded-md"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {loading ? (
                        <button 
                            className="w-full bg-accent-primary text-white py-2 px-4 rounded opacity-50 cursor-not-allowed flex items-center justify-center" 
                            disabled
                        >
                            Please wait... 
                            <div className="ml-2 animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        </button>
                    ) : (
                        <button 
                            className="w-full bg-accent-primary hover:bg-accent-secondary text-white font-bold py-2 px-4 rounded focus:outline-none transition-colors duration-300" 
                            type="submit"
                        >
                            Add product
                        </button>
                    )}
                </form>
            </div>
        </>
    );
}

export default CreateSell;