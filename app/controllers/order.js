const { AddToCart, Order, OrderItem, User, FoodItem } = require("../models");
const { handleResponse, handleError, getPagination, sortingData, getPagingResults } = require("../utils/helpers");
const { strings } = require("../utils/string");

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIP_SEAC);
const { v4: uuidv4 } = require('uuid');


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


exports.findAll = async (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const sortResponse = sortingData(req);

    const orders = await Order.findAll({ where: { user_id: req.user.id } });

    const orderIds = orders.map(order => (order.id));
    const orderItems = await OrderItem.findAll({ where: { order_id: orderIds }, })

    const result = [];

    // Iterate over each order
    orders.forEach(order => {
        const associatedOrderItems = orderItems.filter(item => item.order_id === order.id);
        const orderObject = order.toJSON();
        // Add the orderItems property to the order object
        orderObject.orderItems = associatedOrderItems;
        // Push the order object with orderItems into the result array
        result.push(orderObject);
    });

    res.send({
        items: result,
        error: false,
        message: strings.SuccessfullyRetrDataList,
        status: 1
    })


    // handleResponse(res, result, strings.SuccessfullyRetrData, 1)

};


exports.findOne = async (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const sortResponse = sortingData(req);

    const order = await Order.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    const orderItems = await OrderItem.findAll({ where: { order_id: order.id }, })

    const result = { ...order.dataValues, orderItems }
    handleResponse(res, result, strings.SuccessfullyRetrData, 1)

};



exports.payment = async (req, res) => {
    const { order_id } = req.body;
    const idemportencyKey = uuidv4()


    const order = await Order.findOne({ where: { id: order_id } })


    if (!order) {
        handleError(strings.InvalidOrderId, req, res, 0)
        return
    };

    const orderItems = await OrderItem.findAll({ where: { order_id: order.id } })

    const cartIds = orderItems?.map((orderItem) => orderItem.cart_id)

    const addtoCarts = await AddToCart.findAll({ where: { id: cartIds } })
    const foodIds = []
    const foods = []

    addtoCarts?.map((cart) => {
        foodIds.push(cart.food_item_id)
        foods.push({
            id: cart.food_item_id,
            quantity: cart.food_item_id
        })
    })

    const foodItems = await FoodItem.findAll({ where: { id: foodIds } })

    foodItems.map((item,i)=>{
        foods.map((f)=>{
            
        }) 
    })

    // FoodItem.update({ quantity: 'paid' }, { where: { id: order.id }, })
    //     .then((result) => {
    //         handleResponse(res, result, strings.PaymentSuccess, 1)
    //     })
    //     .catch(err => handleError(err, req, res, 0))

    console.log('addtoCarts>>>>>>>>>>>', foods);




    // Order.update({ status: 'paid' }, { where: { id: order.id }, })
    //     .then((result) => {
    //         handleResponse(res, result, strings.PaymentSuccess, 1)
    //     })
    //     .catch(err => handleError(err, req, res, 0))

    // stripe.customers.create({
    //     email: 'customer@example.com',
    // })
    //     .then(customer => console.log(customer.id))
    //     .catch(error => console.error(error));
}