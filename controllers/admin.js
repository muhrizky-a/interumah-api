// const Design = require('../models/design');
// const Category = require('../models/category');
// const Order = require('../models/orders');

const User = require('../models/user');
const { paginate } = require('../services/common');
const adminService = require('../services/admin');
const userService = require('../services/user');
const categoryService = require('../services/category');
const designService = require('../services/design');
const orderService = require('../services/order');
const orderReceiptService = require('../services/receipt');

const AuthenticationError = require('../exceptions/AuthenticationError');
const Order = require('../models/orders');

const handleGenerateSecret = async (req, res, next) => {
    try {
        adminService.generateSecret();
        const authToken = adminService.getSecret();

        res.status(200).json({
            code: 200,
            message: "Secret Admin berhasil dibuat di /var/lib/interumah/secrets/adminPassword",
            authToken
        });
    } catch (error) {
        next(error);
    }
}

const handleAuth = async (req, res, next) => {
    try {
        const { token } = req.body;
        const authToken = adminService.getSecret();

        if (token != authToken.trim()) {
            throw new AuthenticationError("Token Admin tidak valid.");
        }

        const accessToken = adminService.generateAccessToken();
        adminService.deleteSecret();

        res.status(201).json({
            code: 201,
            message: "Login berhasil.",
            data: {
                accessToken
            }
        });
    } catch (error) {
        next(error);
    }
}

const getData = async (req, res, next) => {
    try {
        const data = {};

        if (req.query.users) {
            const users = await userService.getUsers({
                role: "user"
            });
            const designers = await userService.getUsers({
                role: "designer"
            });
            data.users = {
                userCount: users.count,
                designerCount: designers.count,
                total: users.count + designers.count
            };
        }

        if (req.query.designs) {
            const designs = await designService.getDesigns({});
            data.designs = {
                total: designs.count
            };
        }

        if (req.query.categories) {
            const categories = await categoryService.getCategories();
            data.categories = {
                total: categories.count
            };
        }

        const orders = await orderService.getOrders();
        if (req.query.orders) {
            data.orders = {
                newOrderCount: orders.rows.filter((x) => x.status == "Pesanan Baru").length,
                inProgressCount: orders.rows.filter((x) => x.status.includes("In Progress")).length,
                total: orders.count
            };
        }

        data.profit = orders.count * 200000;

        res.status(200).json({
            code: 200,
            data
        });
    } catch (error) {
        next(error);
    }
}


const getDesigners = async (req, res, next) => {
    try {
        const designers = await userService.getDesigners({
            role: "designer"
        });

        res.status(200).json({
            code: 200,
            data: designers.rows.map(d => {
                return {
                    id: d.id,
                    name: d.name,
                    email: d.email,
                    address: d.address,
                    phone: d.phone
                }
            }),
            page: {
                // size: designers.rows.length,
                total: designers.count,
                // totalPages: Math.ceil(designers.count / (size ?? designers.count)),
                // current: page ?? 1
            }
        });
    } catch (error) {
        next(error);
    }
}

const getDesigns = async (req, res, next) => {
    try {
        const options = {
            include: [
                {
                    model: User,
                    attributes: ['name']
                },
                {
                    model: Order,
                    attributes: ['id']
                }
            ]
        };

        let page = req.query.page;
        let size = req.query.size;
        paginate(size, page, options);

        const designs = await designService.getDesigns(options);
        res.json({
            code: 200,
            data: designs.rows.map(e => {
                return {
                    id: e.id,
                    title: e.title,
                    description: e.description,
                    price: e.price ?? '-',
                    imageUrl: `${req.headers.host}/uploads/designs/${e.image}`,
                    price: e.price ?? '-',
                    designer: {
                        name: e.user.name
                    },
                    location: e.user.address ?? '-',
                    orderTotal: e.orders.length
                }
            }),
            page: {
                size: designs.rows.length,
                total: designs.rows.length,
                totalPages: Math.ceil(designs.count / (size ?? designs.count)),
                current: page ?? 1
            }
        });
    } catch (error) {
        next(error);
    }
}

const getOrders = async (req, res, next) => {
    try {
        const orders = await orderService.getOrders();

        res.status(200).json({
            code: 200,

            data: orders.rows.map(o => {
                return {
                    id: o.id,
                    category: o.design.category.name,
                    status: o.status,
                    design: {
                        id: o.design.id,
                        //     categoryId: o.design.category_id,
                        title: o.design.title,
                        area: o.design.area,
                        price: o.design.price,
                        //     imageUrl: `${req.headers.host}/uploads/designs/${o.design.image}`
                    },
                    designers: {
                        // id: o.design.user.id,
                        name: o.design.user.name,
                        // email: o.design.user.email,
                        // imageUrl: `${req.headers.host}/uploads/users/profile/${o.design.user.image}`,
                    },
                    customer: {
                        // id: o.user.id,
                        name: o.user.name,
                        // email: o.user.email,
                        // imageUrl: `${req.headers.host}/uploads/users/profile/${o.user.image}`,
                    },
                    profit: 0.02 * o.design.price,
                }
            }),
            page: {
                // size: designs.rows.length,
                total: orders.count,
                // totalPages: Math.ceil(designs.count / (size ?? designs.count)),
                // current: page ?? 1
            }
        });
    } catch (error) {
        next(error);
    }
}

const getReceipts = async (req, res, next) => {
    try {
        const receipts = await orderReceiptService.getReceipts();

        res.status(200).json({
            code: 200,
            data: receipts.rows.map(r => {
                return {
                    id: r.id,
                    receipt: `${req.headers.host}/uploads/designs/receipts/${r.receipt}`,
                    createdAt: r.created_at,
                    updatedAt: r.updated_at,
                    customer: {
                        name: r.order.user.name,
                    },
                    design: {
                        title: r.order.design.title,
                        price: r.order.design.price,
                    },
                    designers: {
                        name: r.order.design.user.name,
                    }
                }
            }),
            page: {
                // size: designs.rows.length,
                total: receipts.count,
                // totalPages: Math.ceil(designs.count / (size ?? designs.count)),
                // current: page ?? 1
            }
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    handleGenerateSecret,
    handleAuth,
    getData,
    getDesigners,
    getDesigns,
    getOrders,
    getReceipts
};