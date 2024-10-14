const Design = require('../models/design');
const Order = require('../models/orders');

const AuthorizationError = require('../exceptions/AuthorizationError');

// Mengecek pemesanan design interior yang design-nya dikelola oleh designer
const checkManagedOrderAccess = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const designerId = req.user.id;

        const order = await Order.findOne({
            attributes: ['id'],
            where: {
                id: orderId
            },
            include: {
                model: Design,
                where: {
                    user_id: designerId
                }
            }
        });
        console.log(order)
        // Check autorisasi
        if (!order) throw new AuthorizationError("Anda tidak berhak mengakses pemesanan ini.");

        next();
    } catch (error) {
        next(error);
    }
}

// Mengecek pemesanan design interior yang dibuat oleh user
const checkRequestedOrderAccess = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const loggedInCustomerId = req.user.id;

        const order = await Order.findOne({
            attributes: ['id'],
            where: {
                id: orderId,
                customer_id: loggedInCustomerId
            }
        });

        // Check autorisasi
        if (!order) throw new AuthorizationError("Anda tidak berhak mengakses pemesanan ini.");

        next();
    } catch (error) {
        next(error);
    }
}


module.exports = {
    checkManagedOrderAccess,
    checkRequestedOrderAccess
}