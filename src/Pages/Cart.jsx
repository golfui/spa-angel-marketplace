import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import { removeFromCart, updateQuantity, clearCart } from '../services/cartService';
import { motion } from 'framer-motion';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';

function Cart() {
    const navigate = useNavigate();
    const { cartItems, setCartItems, cartTotal } = useCart();
    const [loading, setLoading] = useState(false);

    const handleRemoveItem = async (productId) => {
        const { cartItems: updatedCart } = await removeFromCart(productId);
        setCartItems(updatedCart);
    };

    const handleUpdateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
        const { cartItems: updatedCart } = await updateQuantity(productId, newQuantity);
        setCartItems(updatedCart);
    };

    const handleCheckout = async () => {
        setLoading(true);
        try {
            await clearCart();
            setCartItems([]);
            navigate('/checkout-success');
        } catch (error) {
            console.error('Checkout error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-accent-primary mb-8">Shopping Cart</h1>
            
            {cartItems.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {cartItems.map((item) => (
                            <motion.div 
                                key={item._id}
                                className="flex items-center gap-4 bg-background-secondary p-4 rounded-lg mb-4 border border-background-tertiary"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img 
                                    src={item.image} 
                                    alt={item.title} 
                                    className="w-24 h-24 object-cover rounded-md"
                                />
                                
                                <div className="flex-grow">
                                    <h3 className="text-lg font-medium text-text-primary">{item.title}</h3>
                                    <p className="text-accent-primary font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                                        className="p-1 text-text-secondary hover:text-accent-primary transition-colors duration-300"
                                    >
                                        <FaMinus />
                                    </button>
                                    <span className="w-8 text-center">{item.quantity}</span>
                                    <button 
                                        onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                                        className="p-1 text-text-secondary hover:text-accent-primary transition-colors duration-300"
                                    >
                                        <FaPlus />
                                    </button>
                                </div>
                                
                                <button 
                                    onClick={() => handleRemoveItem(item._id)}
                                    className="p-2 text-accent-tertiary hover:text-red-500 transition-colors duration-300"
                                >
                                    <FaTrash />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                    
                    <div className="lg:col-span-1">
                        <motion.div 
                            className="bg-background-secondary p-6 rounded-lg border border-background-tertiary sticky top-24"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                            
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Subtotal</span>
                                    <span className="font-medium">${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Shipping</span>
                                    <span className="font-medium">Free</span>
                                </div>
                                <div className="border-t border-background-tertiary my-2 pt-2">
                                    <div className="flex justify-between">
                                        <span className="font-semibold">Total</span>
                                        <span className="font-bold text-accent-primary">${cartTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleCheckout}
                                disabled={loading}
                                className="w-full bg-accent-primary hover:bg-accent-secondary text-white font-bold py-3 px-4 rounded transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <span>Processing...</span>
                                        <div className="ml-2 animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                    </div>
                                ) : (
                                    'Proceed to Checkout'
                                )}
                            </button>
                        </motion.div>
                    </div>
                </div>
            ) : (
                <motion.div 
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="text-xl text-text-muted mb-6">Your cart is empty</p>
                    <button 
                        onClick={() => navigate('/categories/all')}
                        className="bg-accent-primary hover:bg-accent-secondary text-white font-medium py-2 px-6 rounded transition-colors duration-300"
                    >
                        Continue Shopping
                    </button>
                </motion.div>
            )}
        </div>
    );
}

export default Cart;