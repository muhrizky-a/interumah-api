const argon2 = require("argon2");
const User = require('../models/user');
const Design = require("../models/design");

const createUser = async (payload) => {
    const {
        email,
        password,
        role
    } = payload;

    const user = await User.create({
        email,
        password,
        role
    });

    return {
        id: user.id,
        email: user.email,
    };
}

const createHashedPassword = async (password) => {
    const hashPassword = await argon2.hash(
        password,
        {
            type: argon2.argon2id,
            raw: false
        }
    );
    const splittedHashedPassword = hashPassword.split("p=")[1];
    return splittedHashedPassword;
}

const getUsers = async (conditions) => {
    const options = {
        attributes: ["id", "name", "image", "email", "role"],
    };
    if (conditions) options.where = conditions;

    const users = await User.findAndCountAll(options);
    return users;
}

const getDesigners = async (conditions, includeDesigns = false) => {
    const options = {
        attributes: ["id", "name", "email", "image", "phone", "age", "address", "job", "role"],
        where: conditions
    };
    if (includeDesigns) {
        options.include = {
            model: Design
        }
    }

    const designers = await User.findAndCountAll(options);
    return designers;
}

const getUserById = async (id) => {
    const user = await User.findOne({
        attributes: ["name", "email", "image", "phone", "age", "address", "job", "role"],
        where: { id },
        include: {
            model: Design
        },
    });
    return user;
}

const getUserByEmail = async (email, attributes = []) => {
    if (!attributes.length) attributes = ["name", "email", "image", "phone", "age", "address", "job", "role"];
    const user = await User.findOne({
        attributes,
        where: { email },
    });
    return user;
}

const updateUser = async (id, payload) => {
    const user = await User.update(payload, {
        where: { id },
    });

    return {
        id: user.id,
        email: user.email,
    };
}

const mapDBtoUserData = (req, user) => {
    const isDesigner = user.role == "designer";

    let designs;
    if (isDesigner) {
        designs = user.designs.map(design => {
            return {
                id: design.id,
                categoryId: design.category_id,
                title: design.title,
                description: design.description,
                area: design.area,
                price: design.price ?? '-',
                location: user.address ?? '-',
                imageUrl: `${req.headers.host}/uploads/designs/${design.image}`,
                budgetPlan: design.budget_plan ? `${req.headers.host}/uploads/budget-plans/${design.budget_plan}` : null,
            }
        })
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        imageUrl: `${req.headers.host}/uploads/users/profile/${user.image ?? 'default.png'}`,
        phone: user.phone,
        age: user.age,
        address: user.address,
        job: user.job,
        isDesigner,
        designs
    };
}

module.exports = {
    createUser,
    createHashedPassword,
    getUsers,
    getDesigners,
    getUserById,
    getUserByEmail,
    updateUser,
    mapDBtoUserData
};