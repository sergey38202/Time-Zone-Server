import ProductModel from '../models/ProductModel.js';

const createProduct = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden - Only admin can create products' });
    }

    const { title, description, image, price } = req.body;

    const newProduct = new ProductModel({ title, description, image, price });
    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteProduct = async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden - Only admin can delete products' });
      }
  
      const productId = req.params.id;
  
      const product = await ProductModel.findById(productId);
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      await ProductModel.findByIdAndDelete(productId);
  
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const getAllProducts = async (req, res) => {
    try {
      const products = await ProductModel.find();
      res.status(200).json(products);
    } catch (error) {
      console.error('Error getting all products:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const getProduct = async (req, res) => {
    try {
      const productId = req.params.id;
  
      const product = await ProductModel.findById(productId);
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.status(200).json(product);
    } catch (error) {
      console.error('Error getting specific product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const updateProduct = async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden - Only admin can update products' });
      }
  
      const productId = req.params.id;
      const { title, description, image, price } = req.body;
  
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        productId,
        { title, description, image, price },
        { new: true }
      );
  
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

export { createProduct, deleteProduct, getAllProducts, getProduct, updateProduct, };
