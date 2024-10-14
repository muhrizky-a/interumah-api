const orderService = require('../services/order');
const InvariantError = require('../exceptions/InvariantError');


const createNewOrder = async (req, res, next) => {
    try {
        const customerId = req.user.id;
        const { designId } = req.body;

        const newOrder = await orderService.createOrder({
            customer_id: customerId,
            design_id: designId,
            status: "Perlu Dibayar"
        });

        res.status(201).json({
            code: 201,
            message: "Pesanan berhasil dibuat",
            data: {
                id: newOrder.id
            }
        })
    } catch (error) {
        next(error);
    }
}

const createOrderReceipt = async (req, res, next) => {
    try {
        const orderId = req.params.id;

        // Cek if the order receipts has been uploaded, or throw error
        if (!req.files[0]) throw new InvariantError(
            "BAD_REQUEST",
            {
                image: [
                    "Bukti Pembayaran tidak diupload"
                ]
            }
        );
        const { filename } = req.files[0];

        // Get current date and time
        const date = { now: new Date() };
        date.date = date.now.getDate();
        date.month = date.now.getMonth();
        date.year = date.now.getFullYear();
        date.hours = date.now.getHours();
        date.minutes = date.now.getMinutes();
        date.seconds = date.now.getSeconds();

        const currentDate = `${date.date}-${date.month}-${date.year} ${date.hours}:${date.minutes}:${date.seconds}`

        const newOrderReceipt = await orderService.createOrderReceipt({
            order_id: orderId,
            receipt: filename,
            comments: `Dikirim pada ${currentDate}. Menunggu komentar dari pihak Desainer`,
        });

        res.status(201).json({
            code: 201,
            message: "Bukti Pembayaran berhasil dikirim",
            data: {
                id: newOrderReceipt.id,
                status: newOrderReceipt.comments,
                receiptUrl: `${req.headers.host}/uploads/designs/receipts/${filename}`
            }
        })
    } catch (error) {
        next(error);
    }
}

const getOrderHistory = async (req, res, next) => {
    try {
        const loggedInUserId = req.user.id;

        const orders = await orderService.getOrderHistory(loggedInUserId);

        res.status(200).json({
            code: 200,
            data: orders.map(order => {
                return {
                    id: order.id,
                    price: order.price ?? order.design.price ?? '-',
                    status: order.status,
                    design: {
                        id: order.design.id,
                        categoryId: order.design.category_id,
                        title: order.design.title,
                        imageUrl: `${req.headers.host}/uploads/designs/${order.design.image}`
                    },
                    designer: {
                        id: order.design.user.id,
                        name: order.design.user.name ?? '-',
                        imageUrl: `${req.headers.host}/uploads/users/profile/${order.design.user.image ?? 'default.png'}`
                    },
                }
            })
        })
    } catch (error) {
        next(error);
    }
}

const getOrderReceiptsHistory = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const loggedInUserId = req.user.id;

        const order = await orderService.getOrderReceiptsHistory(loggedInUserId, orderId);

        res.status(200).json({
            code: 200,
            data: {
                id: order.id,
                price: order.price ?? order.design.price ?? '-',
                status: order.status,
                design: {
                    id: order.design.id,
                    categoryId: order.design.category_id,
                    title: order.design.title,
                    imageUrl: `${req.headers.host}/uploads/designs/${order.design.image}`
                },
                designer: {
                    id: order.design.user.id,
                    name: order.design.user.name ?? '-',
                    imageUrl: `${req.headers.host}/uploads/users/profile/${order.design.user.image ?? 'default.png'}`
                },
                receipts: order.order_receipts.map(receipt => {
                    return {
                        id: receipt.id,
                        receiptUrl: `${req.headers.host}/uploads/designs/receipts/${receipt.receipt}`,
                        isValid: receipt.is_valid,
                        comments: receipt.comments,
                        createdAt: receipt.created_at,
                        updatedAt: receipt.updated_at
                    }
                })
            }
        })
    } catch (error) {
        next(error);
    }
}

const getManagedOrders = async (req, res, next) => {
    try {
        const loggedInDesignerId = req.user.id;

        const orders = await orderService.getManagedOrders(loggedInDesignerId);

        res.status(200).json({
            code: 200,
            data: orders.map(order => {
                return {
                    id: order.id,
                    status: order.status,
                    customerId: order.customer_id,
                    price: order.price ?? order.design.price ?? '-',
                    design: {
                        id: order.design.id,
                        categoryId: order.design.category_id,
                        title: order.design.title,
                        imageUrl: `${req.headers.host}/uploads/designs/${order.design.image}`
                    },
                    customer: {
                        id: order.user.id,
                        name: order.user.name,
                        email: order.user.email,
                        imageUrl: `${req.headers.host}/uploads/users/profile/${order.user.image ?? 'default.png'}`,
                    }
                }
            })
        })
    } catch (error) {
        next(error);
    }
}

const getManagedOrderReceipts = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const loggedInDesignerId = req.user.id;

        const order = await orderService.getManagedOrderReceipts(loggedInDesignerId, orderId);

        res.status(200).json({
            code: 200,
            data: {
                title: order.design.title,
                categoryId: order.design.category_id,
                price: order.price ?? order.design.price ?? '-',
                imageUrl: `${req.headers.host}/uploads/designs/${order.design.image}`,
                status: order.status,
                customer: {
                    id: order.user.id,
                    name: order.user.name,
                    email: order.user.email,
                    imageUrl: `${req.headers.host}/uploads/users/profile/${order.user.image}`,
                },
                receipts: order.order_receipts.map(receipt => {
                    return {
                        id: receipt.id,
                        receiptUrl: `${req.headers.host}/uploads/designs/receipts/${receipt.receipt}`,
                        isValid: receipt.is_valid,
                        comments: receipt.comments,
                        createdAt: receipt.created_at,
                        updatedAt: receipt.updated_at
                    }
                })
            }
        })
    } catch (error) {
        next(error);
    }
}

const updateOrder = async (req, res, next) => {
    try {
        const { status, price } = req.body;
        const { id } = req.params;

        await orderService.updateOrder(id, {
            status,
            price
        });

        res.status(200).json({
            code: 200,
            message: "Status Pemesanan Desain Interior berhasil diubah."
        })
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createNewOrder,
    createOrderReceipt,
    getOrderHistory,
    getOrderReceiptsHistory,
    getManagedOrders,
    getManagedOrderReceipts,
    updateOrder
};