const pool = require('../config/db');

exports.placeOrder = async (req, res) => {
  const { items, shippingDetails, paymentMethod, totalAmount } = req.body;
  const userId = req.user.id;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Order must contain items' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Insert into orders table
    const orderResult = await client.query(
      `INSERT INTO orders 
        (user_id, full_name, phone, address, city, state, pin_code, delivery_option, total_amount, payment_method) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
      [
        userId,
        shippingDetails.fullName,
        shippingDetails.phone,
        shippingDetails.address,
        shippingDetails.city,
        shippingDetails.state,
        shippingDetails.pinCode,
        shippingDetails.deliveryOption,
        totalAmount,
        paymentMethod
      ]
    );
    const orderId = orderResult.rows[0].id;

    // 2. Process each item (insert into order_items and update stock)
    for (const item of items) {
      if (item.type === 'product') {
        // Reduce product stock
        await client.query(
          `UPDATE products SET stock = GREATEST(stock - $1, 0) WHERE id = $2`,
          [item.quantity, item.product_id]
        );
        // Insert order item
        await client.query(
          `INSERT INTO order_items (order_id, product_id, item_type, name, quantity, price) 
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [orderId, item.product_id, 'product', item.name, item.quantity, item.price]
        );
      } else if (item.type === 'animal') {
        // Delete animal as it's been purchased
        await client.query(`DELETE FROM animals WHERE id = $1`, [item.animal_id]);
        
        // Insert order item
        await client.query(
          `INSERT INTO order_items (order_id, animal_id, item_type, name, quantity, price) 
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [orderId, item.animal_id, 'animal', item.name, 1, item.price]
        );
      }
    }

    // 3. Clear user's cart
    await client.query('DELETE FROM cart WHERE user_id = $1', [userId]);

    await client.query('COMMIT');
    res.status(201).json({ message: 'Order placed successfully', orderId });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Server error while placing order' });
  } finally {
    client.release();
  }
};

exports.getUserOrders = async (req, res) => {
  const userId = req.user.id;
  try {
    const ordersResult = await pool.query(
      `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    
    const orders = ordersResult.rows;
    for (let order of orders) {
      const itemsResult = await pool.query(
        `SELECT * FROM order_items WHERE order_id = $1`,
        [order.id]
      );
      order.items = itemsResult.rows;
    }
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const orderResult = await pool.query(
      `SELECT * FROM orders WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const order = orderResult.rows[0];
    const itemsResult = await pool.query(
      `SELECT * FROM order_items WHERE order_id = $1`,
      [order.id]
    );
    order.items = itemsResult.rows;
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
