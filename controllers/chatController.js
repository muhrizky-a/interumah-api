
const { Op, QueryTypes } = require("sequelize");
const db = require("../config/database");

const User = require('../models/user');
const Chat = require('../models/chat');

const NotFoundError = require('../exceptions/NotFoundError');
const InvariantError = require('../exceptions/InvariantError');


const sendChat = async (req, res, next) => {
    try {
        const senderId = req.user.id;
        const { receiverId, contents } = req.body;

        if (senderId == receiverId) throw new InvariantError("User tidak dapat mengirim pesan ke akun sendiri.")

        await Chat.create({
            sender_id: req.user.id,
            receiver_id: receiverId,
            contents
        });

        res.status(201).json({
            'code': 201,
            'data': {
                contents
            }
        })
    } catch (error) {
        next(error);
    }
}

const getChats = async (req, res, next) => {
    try {
        const loggedInUserId = req.user.id;

        const chats = await db.query(
            `SELECT t1.*
            FROM chats t1
            JOIN ( SELECT LEAST(sender_id, receiver_id) user1,
                          GREATEST(sender_id, receiver_id) user2,
                          MAX(created_at) created_at 
                   FROM chats t2
                   GROUP BY user1, user2 ) t3  ON t1.sender_id IN (t3.user1, t3.user2)
                                              AND t1.receiver_id IN (t3.user1, t3.user2)
                                              AND t1.created_at = t3.created_at 
            WHERE (sender_id = $1 OR receiver_id = $1);`,
            {
                bind: [loggedInUserId],
                type: QueryTypes.SELECT
            }
        ).then(result => {
            return result.map(e => {
                e.loggedInUserRole = (e.sender_id == loggedInUserId)
                    ? "sender"
                    : "receiver";
                return e;
            });
        });

        res.status(200).json({
            'code': 200,
            'data': chats
        })
    } catch (error) {
        next(error);
    }
}

const getChatsWithUser = async (req, res, next) => {
    try {
        const loggedInUserId = req.user.id;
        const { chatPartnerId } = req.params;

        const chats = await Chat.findAll({
            where: {
                [Op.or]: [
                    { sender_id: loggedInUserId, receiver_id: chatPartnerId },
                    { sender_id: chatPartnerId, receiver_id: loggedInUserId }
                ],
            },
            order: ["id"]
            // group: ["sender_id", "receiver_id"],
        }).then(result => {
            return result.map((e, i) => {
                e.dataValues.loggedInUserRole = (e.sender_id == loggedInUserId)
                    ? "sender"
                    : "receiver";
                return e;
            });
        });

        if (!chats.length) throw new NotFoundError('Chat tidak ditemukan');

        const chatPartner = await User.findOne({
            attributes: ['id', 'name', 'email'],
            where: {
                id: chatPartnerId,
            }
        });

        res.status(200).json({
            'code': 200,
            'data': {
                chatPartner,
                chats
            }
        })
    } catch (error) {
        next(error);
    }
}

module.exports = {
    sendChat,
    getChats,
    getChatsWithUser
};