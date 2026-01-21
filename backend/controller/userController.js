//handle user input and interactions in controller folder

//tutorial - define schema, insert data
//https://www.youtube.com/watch?v=oYoe8PDAXi0&list=PL1oBBulPlvs97CWAXfqLJra7TamlwsfdS&index=5

import User from "../model/userModel.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";


// function to create new user instance
export const create = async (req, res) => {
  try {
    // HASH PASSWORD
    console.log("password:", req.body.hash);
    const password = req.body.hash;
    const hash = await bcrypt.hash(password, 13);
    console.log("hash:", hash);
    req.body.hash = hash;

    const newUser = new User(req.body); // req.body --> sending info from client to server
    const { username, email } = newUser;
    const userExist =
      (await User.findOne({ username })) || (await User.findOne({ email })); // define condition to check validity
    if (userExist) {
      return res.status(400).json({ message: "User already exists." });
    }

    const savedData = await newUser.save();
    res.status(200).json(savedData);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const userData = await User.find();
    if (!userData || userData.length === 0) {
      return res.status(404).json({ message: "User data not found." });
    }
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const id = req.user.id;
    if (!id) {
      return res.status(401).json({ message: "User not authenticated." });
    }
    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(userExist);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};


export const update = async (req, res) => {
  try {
    const id = req.user.id;
    if (!id) {
      return res.status(401).json({ message: "User not authenticated." });
    }
    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(404).json({ message: "User not found." });
    }
    const updatedData = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "User Updated successfully.", user: updatedData });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.user.id;
    if (!id) {
      return res.status(401).json({ message: "User not authenticated." });
    }
    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(404).json({ message: "User not found." });
    }
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// Admin-style delete by id (used by dev tooling). No auth enforced here;
// If you want to restrict this, add `requireAuth` or checks.
export const deleteUserById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "User id is required." });
    }
    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(404).json({ message: "User not found." });
    }
    await User.findByIdAndDelete(id);
    return res.status(200).json({ message: "User deleted successfully.", id });
  } catch (error) {
    console.error("deleteUserById error:", error);
    return res.status(500).json({ errorMessage: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if ((!username && !email) || !password) {
      return res
        .status(400)
        .json({ message: "Username or email and password are required." });
    }

    const user = username
      ? await User.findOne({ username })
      : await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const payload = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      userType: user.userType,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || "dev_secret_key_change_me",
      { expiresIn: "7d" }
    );

    // COOKIE-ONLY: set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set true in prod with HTTPS
      sameSite: "lax",
      path: "/",     // important: send cookie on all API routes
    });

    return res.status(200).json({
      message: "Login successful.",
      user: payload,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error during login." });
  }
};

export const passwordResetRequest = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required." });

    const user = await User.findOne({ email });

    // Always return success to avoid account enumeration; if user exists, send email
    if (user) {
      const token = jwt.sign(
        { id: user._id.toString() },
        process.env.JWT_SECRET || "dev_secret_key_change_me",
        { expiresIn: "1h" }
      );

      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      const resetLink = `${frontendUrl}/reset-password?token=${token}`;

      const { generatePasswordResetEmail } = await import("../emailTemplate.js");
      const htmlTemplate = generatePasswordResetEmail(user.username || "", resetLink);

      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.default.createTransport({
        host: process.env.GMAIL_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: "iVolunteer Password Reset",
        html: htmlTemplate,
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (err) {
        console.error("Error sending password reset email:", err);
        // Do not expose internal errors to client; continue to return generic success
      }
    }

    return res
      .status(200)
      .json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
  } catch (error) {
    console.error("passwordResetRequest error:", error);
    return res
      .status(500)
      .json({ message: "Server error while requesting password reset." });
  }
};

export const passwordReset = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword)
      return res
        .status(400)
        .json({ message: "Token and new password are required." });

    let payload;
    try {
      payload = jwt.verify(
        token,
        process.env.JWT_SECRET || "dev_secret_key_change_me"
      );
    } catch (err) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    const userId = payload.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const hash = await bcrypt.hash(newPassword, 13);
    user.hash = hash;
    await user.save();

    return res
      .status(200)
      .json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("passwordReset error:", error);
    return res
      .status(500)
      .json({ message: "Server error while resetting password." });
  }
};
