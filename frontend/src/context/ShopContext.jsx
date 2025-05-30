import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { toast } from "react-toastify"

export const ShopContext = createContext()

// This function safely gets the backend URL whether we're in a browser or a test environment
function getBackendUrl() {
    // In a Jest environment, this will safely return the default URL
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
        return 'http://localhost:5000';
    }
    
    // In a browser environment with Vite, this will use the environment variable
    try {
        return import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    } catch (e) {
        // Fallback for any environment where import.meta is not available
        return 'http://localhost:5000';
    }
};

const ShopContextProvider = (props) => {

    const currency = '$'
    const delivery_charges = 5
    const backendUrl = getBackendUrl()
    const navigate = useNavigate()
    const [books, setBooks] = useState([])
    const [token, setToken] = useState("")
    const [cartItems, setCartItems] = useState({})

    // Adding items to cart
    const addToCart = async (itemId) => {
        const cartData = { ...cartItems } // Use shallow copy

        if (cartData[itemId]) {
            cartData[itemId] += 1
        } else {
            cartData[itemId] = 1
        }
        setCartItems(cartData)

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId }, { headers: { token } })

            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }


    // Getting total cart items
    const getCartCount = () => {
        let totalCount = 0
        for (const item in cartItems) {
            try {
                if (cartItems[item] > 0) {
                    totalCount += cartItems[item]
                }
            } catch (error) {
                console.log(error)
            }
        }
        return totalCount;
    }


    // Getting total cart amount
    const getCartAmount = () => {
        let totalAmount = 0
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = books.find((book) => book._id === item)
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item]
                }
            }
        }
        return totalAmount
    }


    // Updating the Quantity
    const updateQuantity = async (itemId, quantity) => {
        const cartData = { ...cartItems }
        cartData[itemId] = quantity
        setCartItems(cartData)

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', { itemId, quantity }, { headers: { token } })
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }


    // Getting all products data
    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list')
            if (response.data.success) {
                setBooks(response.data.products)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Getting useCart data 
    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } })
            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }


    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))  // prevent logout upon reload the page if logged in
            getUserCart(localStorage.getItem('token'))

        }
        getProductsData()
    }, [])


    const contextValue = { books, currency, navigate, token, setToken, cartItems, setCartItems, addToCart, getCartCount, getCartAmount, updateQuantity, delivery_charges, backendUrl }

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider