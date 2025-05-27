import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { toast } from "react-toastify"

export const ShopContext = createContext()

// Determine if we're in a test environment
const isTestEnvironment = process.env.NODE_ENV === 'test'

// Set a default backend URL for tests
const DEFAULT_BACKEND_URL = 'http://localhost:4000'

// Helper function to safely get environment variables
const getEnvVar = (key, defaultValue) => {
    try {
        return isTestEnvironment ? defaultValue : import.meta.env[key] || defaultValue
    } catch (error) {
        return defaultValue
    }
}

const ShopContextProvider = (props) => {
    const currency = '$'
    const delivery_charges = 5
    const backendUrl = getEnvVar('VITE_BACKEND_URL', DEFAULT_BACKEND_URL)
    const navigate = useNavigate()
    const [books, setBooks] = useState([])
    const [token, setToken] = useState("")
    const [cartItems, setCartItems] = useState({})
    const [filterCategory, setFilterCategory] = useState("")
    const [sortOrder, setSortOrder] = useState("relevant")

    // Adding items to cart
    const addToCart = async (itemId) => {
        const cartData = { ...cartItems }

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
            if (response?.data?.success) {
                setBooks(response.data.products)
            } else {
                console.log('Invalid response:', response)
                toast.error(response?.data?.message || 'Failed to fetch products')
            }
        } catch (error) {
            console.log('Error fetching products:', error)
            toast.error(error?.message || 'An error occurred while fetching products')
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
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
        }
        getProductsData()
    }, [])

    const contextValue = {
        books,
        currency,
        navigate,
        token,
        setToken,
        cartItems,
        setCartItems,
        addToCart,
        getCartCount,
        getCartAmount,
        updateQuantity,
        delivery_charges,
        backendUrl,
        filterCategory,
        setFilterCategory,
        sortOrder,
        setSortOrder,
        getCartItemCount: getCartCount // Alias for test compatibility
    }

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider
