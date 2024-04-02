const { AddToCart, Order, OrderItem } = require("../models");
const { handleResponse, handleError, getPagination, sortingData, getPagingResults } = require("../utils/helpers");
const { strings } = require("../utils/string");

exports.create = async (req, res) => {
    try {
        const { items, address_id } = req.body;

        if (!address_id) {
            return res.status(400).json({ error: true, message: "Address ID is required", status: 0 });
        }

        const cartIds = items.map(item => item.cart_id);

        const addToCart = await AddToCart.findAll({ where: { id: cartIds } });

        const subTotal = [];
        const orderItems = [];

        for (let i = 0; i < addToCart.length; i++) {
            const element = addToCart[i];

            orderItems.push({
                cart_id: element.id,
                quantity: element.quantity,
                price: element.price,
                user_id: req.user.id,
            });

            subTotal.push(element.quantity * element.price);
        }

        const sub_total = subTotal.reduce((preV, c) => preV + c);

        const orderData = { sub_total, status: 'pending', address_id, user_id: req.user.id };

        const order = await Order.create(orderData);

        const order_id = order.id;

        for (let i = 0; i < orderItems.length; i++) {
            orderItems[i].order_id = order_id;
        }
        await OrderItem.bulkCreate(orderItems);

        handleResponse(res, order, strings.OrderCreated, 1);

    } catch (err) {
        handleError(err, req, res, 0);
    }
};


// exports.findAll = async (req, res) => {
//     const { page, size } = req.query;
//     const { limit, offset } = getPagination(page, size);
//     const sortResponse = sortingData(req);

//     const orders = await Order.findAndCountAll({
//         where: { user_id: req.user.id, },
//         order: [[sortResponse.sortKey, sortResponse.sortValue]],
//         limit, offset,
//     })

//     const orderIds = orders.rows.map((order) => order.id)

//     const orderItems = await OrderItem.findAndCountAll({
//         where: { order_id: orderIds, },
//         order: [[sortResponse.sortKey, sortResponse.sortValue]],
//         limit, offset,
//     })

//     handleResponse(res, getPagingResults(orderItems, page, limit), strings.SuccessfullyRetrDataList, 1);
// }


exports.findAll = async (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const sortResponse = sortingData(req);

    try {
        // Fetch orders with associated order items using Sequelize associations
        const orders = await Order.findAndCountAll({
            where: { user_id: req.user.id },
            include: [{
                model: OrderItem,
                separate: false
            }],
            order: [[sortResponse.sortKey, sortResponse.sortValue]],
            limit,
            offset
        });

        handleResponse(res, getPagingResults(orders, page, limit), strings.SuccessfullyRetrDataList, 1);
    } catch (error) {
        // Handle errors
        console.error('Error while fetching orders:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
