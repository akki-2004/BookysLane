import React, { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { useFireBase, fireBaseFS } from "./Firebase";  // adjust path accordingly

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useFireBase();  // user from Firebase context
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to get user's cart collection ref
  const userCartItemsCollection = user
    ? collection(fireBaseFS, "carts", user.uid, "items")
    : null;

  // Load cart from Firestore when user changes
  useEffect(() => {
    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    (async () => {
      try {
        const querySnapshot = await getDocs(userCartItemsCollection);
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        setCartItems(items);
      } catch (error) {
        console.error("Failed to fetch cart items:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  // Add or update cart item in Firestore and local state
  const updateQuantity = async (id, quantity, productData = null) => {
    if (!user) return;

    if (quantity < 1) {
      // Remove if quantity < 1
      await removeFromCart(id);
      return;
    }

    const itemDocRef = doc(fireBaseFS, "carts", user.uid, "items", id);

    try {
      await setDoc(
        itemDocRef,
        {
          ...productData,
          quantity,
        },
        { merge: true }
      );

      setCartItems((prev) => {
        const exists = prev.find((item) => item.id === id);
        if (exists) {
          // Update quantity
          return prev.map((item) =>
            item.id === id ? { ...item, quantity } : item
          );
        } else {
          // Add new item
          return [...prev, { id, quantity, ...productData }];
        }
      });
    } catch (error) {
      console.error("Failed to update cart item:", error);
    }
  };

  // Remove item from cart Firestore and state
  const removeFromCart = async (id) => {
    if (!user) return;
    const itemDocRef = doc(fireBaseFS, "carts", user.uid, "items", id);
    try {
      await deleteDoc(itemDocRef);
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to remove cart item:", error);
    }
  };

  // Clear all items from cart Firestore and state
  const clearCart = async () => {
    if (!user) return;
    const batch = writeBatch(fireBaseFS);
    try {
      cartItems.forEach((item) => {
        const itemDocRef = doc(fireBaseFS, "carts", user.uid, "items", item.id);
        batch.delete(itemDocRef);
      });
      await batch.commit();
      setCartItems([]);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  // Calculate total price
  const totalPrice = cartItems.reduce((acc, item) => {
    return acc + (item.price || 0) * (item.quantity || 0);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalPrice,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
