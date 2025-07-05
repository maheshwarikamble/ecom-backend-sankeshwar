const addTocart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    const product = await product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    let cart = await cart.findOne({ userId });
    if (!cart) {
      cart = new cart({
        userId,
        products: [
          {
            productId,
            quantity: quantity || 1,
          },
        ],
        totalPrice: product.price * (quantity || 1),
      });
    } else {
      const prodIndex = cart.products.findIndex(
        (item) => item.productId.tostring() === productId
      );
      if (prodIndex > -1) {
        cart.products[prodIndex].quantity += quantity || 1;
      } else {
        cart.product.push({ productId, quantity: quantity || 1 });
      }
      cart.totalPrice = await calculateTotalPrice(cart.product);
    }
    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      message: "Error adding to cart",
    });
  }
};
