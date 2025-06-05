import productModel from "../models/productModel.js";

// Função controladora para criar produto
const createProduct = async (req, res) => {
    try {
        const { name, description, category, price, popular } = req.body

        const imageUrl = "https://via.placeholder.com/150" // URL de imagem padrão

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            popular: popular === "true" ? true : false,
            image: imageUrl,
            date: Date.now()
        }

        console.log("Product Data:", productData);

        const product = new productModel(productData)
        await product.save()
        res.json({ success: true, message: "Product Created" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Função controladora para deletar um produto
const deleteProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Product Deleted" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Função controladora para listar todos os produtos
const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find({})
        res.json({ success: true, products })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Função controladora para buscar detalhes de um único produto
const getProductById = async (req, res) => {
    try {
        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({ success: true, product })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { createProduct, deleteProduct, getAllProducts, getProductById }
