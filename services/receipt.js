const User = require('../models/user');
const Design = require('../models/design');
const Order = require('../models/orders');
const OrderReceipt = require('../models/order_receipts');

const getReceipts = async () => {
    const receipts = await OrderReceipt.findAndCountAll({
        include: [
            {
                model: Order,
                attributes: ['id'],
                include: [
                    {
                        model: User,
                        attributes: ['id', 'name', 'email', 'image']
                    },
                    {
                        model: Design,
                        attributes: ['id', 'title', 'price'],
                        include: {
                            model: User,
                            attributes: ['id', 'name', 'email', 'image']
                        }
                    },
                ]
            },
        ]
    });
    return receipts;
}

module.exports = {
    getReceipts
};