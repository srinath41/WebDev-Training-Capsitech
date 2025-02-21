import React, { useState, useEffect } from 'react';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        dob: '',
        gender: '',
        city: '',
        state: '',
        country: '',
        address: '',
        message: '',
        counseling: '',
        terms: false
    });

    const [isFormValid, setIsFormValid] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const savedData = {};
        Object.keys(formData).forEach((key) => {
            const value = localStorage.getItem(key);
            if (value) {
                savedData[key] = value === 'true' ? true : value === 'false' ? false : value;
            }
        });
        setFormData((prevData) => ({ ...prevData, ...savedData }));
        setIsLoading(false);
    }, []);

    useEffect(() => {
        Object.keys(formData).forEach((key) => {
            if (key !== 'terms' && key !== 'file') {
                localStorage.setItem(key, formData[key]);
            }
        });
        const isValid = Object.values(formData).every(value => value !== '' && value !== null);
        setIsFormValid(isValid && formData.terms);
    }, [formData]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        const newValue = type === 'checkbox' ? checked : type === 'file' ? files[0] : value.trim();
        setFormData({ ...formData, [name]: newValue });
        setErrors({ ...errors, [name]: '' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(formData.email)) {
            newErrors.email = 'Invalid email format.';
        }

        if (formData.phoneNumber.length !== 10) {
            newErrors.phoneNumber = 'Phone number must be 10 digits.';
        }


        if (!formData.file) {
            newErrors.file = 'Please upload your CV/Resume before submitting.';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setIsSubmitted(true);
            setTimeout(() => setIsSubmitted(''), 5000);
        }
    };

    if (isLoading) {
        return <div className="text-center py-10">Loading form...</div>;
    }

    return (
        <div className="bg-light-blue py-10 px-4">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-semibold text-gray-800">Get in touch with us.<br />We're here to assist you.</h2>
            </div>

            <div className="bg-orange-100 p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['fullName', 'email', 'phoneNumber', 'dob', 'gender', 'city', 'state', 'country', 'address', 'message'].map((field) => (
                            <div key={field} className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    {field.replace(/([A-Z])/g, ' $1').trim()}*
                                </label>
                                <input
                                    type={field === 'dob' ? 'date' : field === 'email' ? 'email' : 'text'}
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleChange}
                                    className="w-full border-b-1 border-gray-400 bg-orange-100 py-2 px-4 focus:outline-none"
                                />
                                {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Request a counselling session*</label>
                            <div className="flex gap-4">
                                {['yes', 'no'].map(option => (
                                    <label key={option} className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="counseling"
                                            value={option}
                                            checked={formData.counseling === option}
                                            onChange={handleChange}
                                            className="w-5 h-5 text-orange-500"
                                        />
                                        <span className="ml-2">{option.charAt(0).toUpperCase() + option.slice(1)}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Upload your CV/Resume*</label>
                            <input
                                type="file"
                                name="file"
                                onChange={handleChange}
                                className="w-full border-gray-400 py-2 px-4"
                            />
                            {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="terms"
                            checked={formData.terms}
                            onChange={handleChange}
                            className="w-5 h-5 text-orange-500"
                        />
                        <label className="ml-2 text-sm">Agree to terms and conditions*</label>
                        {errors.terms && <p className="text-red-500 text-sm ml-4">{errors.terms}</p>}
                    </div>

                    <div className="text-center">
                        <button
                            type="submit"
                            disabled={!isFormValid}
                            className={`py-3 px-6 rounded ${isFormValid ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                        >
                            Submit Information
                        </button>
                    </div>

                    {isSubmitted && (
                        <div className="mt-4 p-4 bg-green-100 text-green-700 border border-green-400 rounded">
                            Form submitted successfully!
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ContactForm;
