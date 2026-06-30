import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, token, refreshCounts } = useContext(AuthContext);
  const [myAnimals, setMyAnimals] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [myWishlist, setMyWishlist] = useState([]);
  const [myCart, setMyCart] = useState([]);
  
  const [loadingAnimals, setLoadingAnimals] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [loadingCart, setLoadingCart] = useState(true);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:5000/api/auth/profile-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      if (response.ok) {
        window.location.reload();
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error(error);
      alert('Error uploading image');
    }
  };

  const animalCategoryIcons = {
    Cow: '🐄',
    Goat: '🐐',
    Dog: '🐕',
    Cat: '🐈',
    Bird: '🐦',
    Rabbit: '🐇',
    Default: '🐾',
  };

  const productCategoryIcons = {
    'Cow Feed': '🌾',
    'Goat Feed': '🌿',
    'Dog Food': '🍖',
    'Cat Food': '🐟',
    'Bird Food': '🐦',
    'Medicine': '💊',
    'Accessories': '🪮',
    'Default': '📦'
  };

  const fetchMyAnimals = async () => {
    if (!user) return;
    try {
      const response = await fetch(`http://localhost:5000/api/animals?sellerId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setMyAnimals(data);
      }
    } catch (error) {
      console.error('Error fetching seller animals:', error);
    } finally {
      setLoadingAnimals(false);
    }
  };

  const fetchMyProducts = async () => {
    if (!user) return;
    try {
      const response = await fetch(`http://localhost:5000/api/products?sellerId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setMyProducts(data);
      }
    } catch (error) {
      console.error('Error fetching seller products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchMyWishlist = async () => {
    if (!user) return;
    try {
      const response = await fetch(`http://localhost:5000/api/wishlist`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMyWishlist(data);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoadingWishlist(false);
    }
  };

  const fetchMyCart = async () => {
    if (!user) return;
    try {
      const response = await fetch(`http://localhost:5000/api/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMyCart(data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoadingCart(false);
    }
  };

  useEffect(() => {
    fetchMyAnimals();
    fetchMyProducts();
    fetchMyWishlist();
    fetchMyCart();
  }, [user, token]);

  const handleDeleteAnimal = async (id) => {
    if (!window.confirm('Are you sure you want to delete this animal listing?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/animals/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setMyAnimals(myAnimals.filter((item) => item.id !== id));
      } else {
        alert('Failed to delete animal listing');
      }
    } catch (error) {
      console.error('Delete animal error:', error);
      alert('Failed to delete animal listing due to a server error');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product listing?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setMyProducts(myProducts.filter((item) => item.id !== id));
        // Refresh wishlist/cart in case they contained the deleted product
        fetchMyWishlist();
        fetchMyCart();
        refreshCounts();
      } else {
        alert('Failed to delete product listing');
      }
    } catch (error) {
      console.error('Delete product error:', error);
      alert('Failed to delete product listing due to a server error');
    }
  };

  const handleRemoveWishlist = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/wishlist/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setMyWishlist(myWishlist.filter((item) => item.id !== id));
        refreshCounts();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveCart = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setMyCart(myCart.filter((item) => item.id !== id));
        refreshCounts();
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) return null;

  // Extract initials for profile avatar
  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  const roleFormatted = user.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : 'Member';

  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Profile details card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-xs self-start lg:sticky lg:top-20">
          {/* Avatar badge */}
          <div className="relative w-24 h-24 mx-auto group shrink-0">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-3xl mx-auto font-bold text-emerald-700 shadow-sm border-2 border-white ring-4 ring-emerald-50 overflow-hidden relative shrink-0">
              {user.profile_image ? (
                <img src={`http://localhost:5000/uploads/${user.profile_image}`} alt="Profile" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <label className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity backdrop-blur-[2px]">
              <span className="text-white text-xs font-bold">Edit</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-4">{user.name}</h2>
          <p className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full inline-block mt-2">
            {roleFormatted}
          </p>

          <div className="mt-8 border-t border-gray-100 pt-6 text-left space-y-4 text-sm">
            <div>
              <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</span>
              <span className="text-gray-900 font-medium text-base truncate block">{user.email}</span>
            </div>

            <div>
              <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone Number</span>
              <span className="text-gray-900 font-medium text-base block">{user.phone || 'Not Provided'}</span>
            </div>

            <div>
              <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Account Status</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-gray-900 font-medium">Verified Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Seller & Buyer listings dashboards */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. Animal Listings Panel */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-50">
              <h3 className="text-xl font-bold text-gray-900">My Animal Listings</h3>
              <Link
                to="/add-animal"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition cursor-pointer"
              >
                ➕ Add New
              </Link>
            </div>

            {loadingAnimals ? (
              <div className="flex justify-center items-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
              </div>
            ) : myAnimals.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-4xl block mb-2">🐄</span>
                <p className="text-sm text-gray-500 font-medium">You haven't listed any animals yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myAnimals.map((animal) => {
                  const icon = animalCategoryIcons[animal.category] || animalCategoryIcons.Default;
                  const imageUrl = animal.image
                    ? (animal.image.startsWith('http') ? animal.image : `http://localhost:5000/uploads/${animal.image}`)
                    : null;

                  return (
                    <div
                      key={animal.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100/50 transition gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-16 h-16 bg-white border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center relative shrink-0">
                          {imageUrl ? (
                            <img src={imageUrl} alt={animal.animal_name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-3xl">{icon}</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-950 text-base">{animal.animal_name}</h4>
                          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500 mt-0.5">
                            <span>Breed: {animal.breed || 'N/A'}</span>
                            <span>•</span>
                            <span>Price: ₹{parseFloat(animal.price).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center w-full sm:w-auto justify-end">
                        <Link
                          to={`/animals/${animal.id}`}
                          className="text-xs font-semibold bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition cursor-pointer"
                        >
                          View
                        </Link>
                        <Link
                          to={`/edit-animal/${animal.id}`}
                          className="text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteAnimal(animal.id)}
                          className="text-xs font-semibold bg-red-50 hover:bg-red-100 border border-red-100 text-red-700 px-3 py-1.5 rounded-lg transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. Product Listings Panel */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-50">
              <h3 className="text-xl font-bold text-gray-900">My Product Listings</h3>
              <Link
                to="/add-product"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition cursor-pointer"
              >
                ➕ Add New
              </Link>
            </div>

            {loadingProducts ? (
              <div className="flex justify-center items-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
              </div>
            ) : myProducts.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-4xl block mb-2">📦</span>
                <p className="text-sm text-gray-500 font-medium">You haven't listed any products yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myProducts.map((product) => {
                  const icon = productCategoryIcons[product.category] || productCategoryIcons.Default;
                  const imageUrl = product.image
                    ? (product.image.startsWith('http') ? product.image : `http://localhost:5000/uploads/${product.image}`)
                    : null;

                  return (
                    <div
                      key={product.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100/50 transition gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-16 h-16 bg-white border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center relative shrink-0">
                          {imageUrl ? (
                            <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-3xl">{icon}</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-950 text-base">{product.name}</h4>
                          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500 mt-0.5">
                            <span>Price: ₹{parseFloat(product.price).toLocaleString('en-IN')}</span>
                            <span>•</span>
                            <span>Stock: {product.stock} units</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center w-full sm:w-auto justify-end">
                        <Link
                          to={`/products/${product.id}`}
                          className="text-xs font-semibold bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition cursor-pointer"
                        >
                          View
                        </Link>
                        <Link
                          to={`/edit-product/${product.id}`}
                          className="text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-xs font-semibold bg-red-50 hover:bg-red-100 border border-red-100 text-red-700 px-3 py-1.5 rounded-lg transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Wishlist Panel */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-50">
              <h3 className="text-xl font-bold text-gray-900">My Saved Wishlist ({myWishlist.length})</h3>
              <Link to="/wishlist" className="text-emerald-600 hover:text-emerald-700 text-xs font-bold transition">
                View Full Wishlist ➔
              </Link>
            </div>

            {loadingWishlist ? (
              <div className="flex justify-center items-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
              </div>
            ) : myWishlist.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-4xl block mb-2">❤️</span>
                <p className="text-sm text-gray-500 font-medium">No saved items in your wishlist.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myWishlist.slice(0, 3).map((item) => {
                  const icon = productCategoryIcons[item.category] || productCategoryIcons.Default;
                  const imageUrl = item.image ? (item.image.startsWith('http') ? item.image : `http://localhost:5000/uploads/${item.image}`) : null;

                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                          {imageUrl ? (
                            <img src={imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-2xl">{icon}</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-950 text-sm line-clamp-1">{item.name}</h4>
                          <span className="text-xs text-emerald-700 font-bold">
                            ₹{parseFloat(item.price).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          to={`/products/${item.product_id}`}
                          className="text-xs font-semibold bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 px-2.5 py-1 rounded-md transition"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleRemoveWishlist(item.id)}
                          className="text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 px-2.5 py-1 rounded-md transition cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
                {myWishlist.length > 3 && (
                  <p className="text-xs text-gray-400 text-center font-medium">
                    Showing first 3 items. View wishlist to see all.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 4. Cart Panel */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-50">
              <h3 className="text-xl font-bold text-gray-900">My Shopping Cart ({myCart.length})</h3>
              <Link to="/cart" className="text-emerald-600 hover:text-emerald-700 text-xs font-bold transition">
                Go to Cart ➔
              </Link>
            </div>

            {loadingCart ? (
              <div className="flex justify-center items-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
              </div>
            ) : myCart.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-4xl block mb-2">🛒</span>
                <p className="text-sm text-gray-500 font-medium">Your shopping cart is empty.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myCart.slice(0, 3).map((item) => {
                  const icon = productCategoryIcons[item.category] || productCategoryIcons.Default;
                  const imageUrl = item.image ? (item.image.startsWith('http') ? item.image : `http://localhost:5000/uploads/${item.image}`) : null;

                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                          {imageUrl ? (
                            <img src={imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-2xl">{icon}</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-950 text-sm line-clamp-1">{item.name}</h4>
                          <span className="text-xs text-gray-500 font-medium">
                            Qty: {item.quantity} • Subtotal: ₹{(parseFloat(item.price) * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          to={`/products/${item.product_id}`}
                          className="text-xs font-semibold bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 px-2.5 py-1 rounded-md transition"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleRemoveCart(item.id)}
                          className="text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 px-2.5 py-1 rounded-md transition cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
                {myCart.length > 3 && (
                  <p className="text-xs text-gray-400 text-center font-medium">
                    Showing first 3 items. Go to cart to see all.
                  </p>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;