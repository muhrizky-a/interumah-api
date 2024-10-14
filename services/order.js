const User = require('../models/user');
const Category = require('../models/category');
const Design = require('../models/design');
const Order = require('../models/orders');
const OrderReceipt = require('../models/order_receipts');

// User / customer-only services
const createOrder = async (payload) => {
    const order = await Order.create(payload);
    return order;
}

const createOrderReceipt = async (payload) => {
    const orderReceipt = await OrderReceipt.create(payload);
    return orderReceipt;
}

const getOrderHistory = async (userId) => {
    const orders = await Order.findAll({
        where: {
            customer_id: userId
        },
        include: {
            model: Design,
            include: {
                model: User,
                attributes: ['id', 'name', 'image']
            }
        },
    });

    return orders;
}

const getOrderReceiptsHistory = async (userId, orderId) => {
    const order = await Order.findOne({
        where: {
            id: orderId,
            customer_id: userId
        },
        include: [
            {
                model: Design,
                include: {
                    model: User,
                    attributes: ['id', 'name', 'image']
                }
            },
            { model: OrderReceipt }
        ]
    });

    return order;
}


// Admin-only services
const getOrders = async () => {
    const orders = await Order.findAndCountAll({
        include: [
            {
                model: Design,
                include: [
                    {
                        model: Category,
                        attributes: ['name']
                    },
                    {
                        model: User,
                        attributes: ['id', 'name', 'email', 'image']
                    }
                ]
            },
            {
                model: User,
                attributes: ['id', 'name', 'email', 'image']
            }
        ]
    });
    return orders;
}


// Designer-only services
const getManagedOrders = async (designerId) => {
    const orders = await Order.findAll({
        include: [
            {
                model: Design,
                where: {
                    user_id: designerId
                }
            },
            {
                model: User,
                attributes: ['id', 'name', 'email', 'image'],
            }
        ],
    });

    return orders;
}

const getManagedOrderReceipts = async (designerId, orderId) => {
    const order = await Order.findOne({
        where: {
            id: orderId
        },
        include: [
            {
                model: Design,
                where: {
                    user_id: designerId
                }
            },
            {
                model: User,
                attributes: ['id', 'name', 'email', 'image'],
            },
            { model: OrderReceipt }
        ],
    });

    return order;
}

const updateOrder = async (id, payload) => {
    const order = await Order.update(payload, {
        where: { id }
    });

    return {
        id: order.id
    };
}

module.exports = {
    createOrder,
    createOrderReceipt,
    getOrders,
    getOrderHistory,
    getOrderReceiptsHistory,
    getManagedOrders,
    getManagedOrderReceipts,
    updateOrder
};