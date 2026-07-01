import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AddProduct = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Cow Feed',
    price: '',
    stock: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    'Cow Feed',
    'Goat Feed',
    'Dog Food',
    'Cat Food',
    'Bird Food',
    'Medicine',
    'Accessories'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (imageFile) {
        data.append('image', imageFile);
      }

      const response = await fetch('https://agripet-connect.onrender.com/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data,
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || 'Failed to list product');
      }

      navigate('/products');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 max-w-2xl mx-auto px-4">
      <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-xs">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">Sell a Product</h2>
        <p className="text-sm text-gray-500 text-center mb-8">List feed, medicines, accessories, or animal care products.</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Product Title/Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Organic Cow Feed 25kg"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹) *</label>
              <input
                type="number"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 850"
                min="0"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Stock Quantity *</label>
              <input
                type="number"
                name="stock"
                required
                value={formData.stock}
                onChange={handleChange}
                placeholder="e.g. 50"
                min="0"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide information about the ingredients, dosage, usage, or specifications."
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm"
            ></textarea>
          </div>

          {/* Image upload field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Product Photo</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl bg-gray-50 hover:bg-gray-100 transition relative">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <div className="flex flex-col items-center">
                    <img src={imagePreview} alt="Preview" className="h-40 w-auto object-cover rounded-lg shadow-xs mb-2" />
                    <button
                      type="button"
                      onClick={() => { setImageFile(null); setImagePreview(null); }}
                      className="text-xs text-red-600 hover:underline font-semibold"
                    >
                      Remove photo
                    </button>
                  </div>
                ) : (
                  <>
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-semibold text-emerald-600 hover:text-emerald-500 focus-within:outline-hidden">
                        <span>Upload a file</span>
                        <input type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl mt-4 transition cursor-pointer disabled:bg-emerald-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base shadow-xs"
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Publishing Product...
              </>
            ) : (
              'Post Product'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
