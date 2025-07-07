import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";

const userRepository = AppDataSource.getRepository(User);

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, age } = req.body;
        const user = new User();
        user.name = name;
        user.email = email;
        user.age = age;

        await userRepository.save(user);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await userRepository.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await userRepository.findOneBy({ id: parseInt(req.params.id) });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const user = await userRepository.findOneBy({ id: parseInt(req.params.id) });
        if (!user) return res.status(404).json({ message: "User not found" });

        userRepository.merge(user, req.body);
        const results = await userRepository.save(user);
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await userRepository.findOneBy({ id: parseInt(req.params.id) });
        if (!user) return res.status(404).json({ message: "User not found" });

        await userRepository.remove(user);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};