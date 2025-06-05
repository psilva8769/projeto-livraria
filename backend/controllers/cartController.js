import userModel from "../models/userModel.js"


// Função controladora para adicionar um produto ao carrinho do usuário
const addToCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body

        const userData = await userModel.findById(userId)
        const cartData = await userData.cartData

        if (cartData[itemId]) {
            cartData[itemId] += 1
        } else {
            cartData[itemId] = 1
        }

        await userModel.findByIdAndUpdate(userId, { cartData })
        res.json({ success: true, message: "Added to Cart" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// Função controladora para atualizar o carrinho do usuário
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, quantity } = req.body

        const userData = await userModel.findById(userId)
        const cartData = await userData.cartData

        cartData[itemId] = quantity

        await userModel.findByIdAndUpdate(userId, { cartData })
        res.json({ success: true, message: "Your Cart Updated" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// Função controladora para recuperar os detalhes do carrinho do usuário
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body

        const userData = await userModel.findById(userId)
        const cartData = await userData.cartData

        res.json({ success: true, cartData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


export { addToCart, updateCart, getUserCart }
