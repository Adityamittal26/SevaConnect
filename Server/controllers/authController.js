import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
import { logger } from "../utils/logger.js";

/*
  SIGNUP CONTROLLER
*/
export const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // validation safeguard (Zod already validates)
    if (!name || !email || !password || !role) {
      throw new AppError("All fields are required", 400);
    }

    // check if user already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new AppError("User already exists", 400);
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert user
    const newUser = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`,
      [name, email, hashedPassword, role]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: newUser.rows[0],
    });

    logger.info(`New user registered: ${email}`);

  } catch (error) {
    next(error);
  }
};


/*
  LOGIN CONTROLLER
*/
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Email and password required", 400);
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      // do NOT reveal whether email exists (security best practice)
      throw new AppError("Invalid credentials", 400);
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isMatch) {
      throw new AppError("Invalid credentials", 400);
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });

    logger.info(`User logged in: ${email}`);

  } catch (error) {
    next(error);
  }
};