import { dateHelper } from "../helpers/dateHelper.js";
import UserRepository from "../repositories/repo.user.js";

const getAll = async (page, pageSize, filters) => {
    try {
        const users = await UserRepository.findAllUsers(
            page,
            pageSize,
            filters
        );

        if (users.length <= 0) {
            return [];
        }

        const data = users
            .sort((a, b) => b.id - a.id)
            .map((user) => ({
                ...user,
                created_at: dateHelper(user.created_at),
                updated_at: dateHelper(user.updated_at),
                unixtime: {
                    created_unixtime: user.created_at,
                    updated_unixtime: user.updated_at,
                },
            }));

        return data;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getById = async (userId) => {
    try {
        const user = await UserRepository.getUserById(userId);

        if (user === null) {
            return {};
        }

        return {
            ...user.toJSON(),
            created_at: dateHelper(user.created_at),
            updated_at: dateHelper(user.updated_at),
            unixtime: {
                created_unixtime: user.created_at,
                updated_unixtime: user.updated_at,
            },
        };
    } catch (err) {
        throw new Error(err.message);
    }
};

const create = async (body) => {
    try {
        return await UserRepository.createUser(body);
    } catch (error) {
        throw new Error(error.message);
    }
};

const update = async (userId, body) => {
    try {
        return await UserRepository.updateUser(userId, body);
    } catch (error) {
        throw new Error(error.message);
    }
};

const distroy = async (userId) => {
    try {
        return await UserRepository.deleteUser(userId);
    } catch (error) {
        throw new Error(error.message);
    }
};

const getByAccessToken = async (accessToken) => {
    try {
        return await UserRepository.getUserByAccessToken(accessToken);
    } catch (error) {
        throw new Error(error.message);
    }
}

const getUserToken = async (userId) => {
    try {
        const user = await UserRepository.getUserById(userId);

        if (user === null) {
            return {};
        }

        return user.toJSON();
    } catch (err) {
        throw new Error(err.message);
    }
};


export default {
    getAll,
    getById,
    create,
    update,
    distroy,
    getByAccessToken,
    getUserToken
};
