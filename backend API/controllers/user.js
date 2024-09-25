const bcrypt = require('bcrypt');
const User = require("../models/User");
const auth = require("../auth");
const { errorHandler, verify, verifyAdmin } = auth;

// [SECTION] Check if email exists
module.exports.checkEmailExists = (req, res) => {
    if (req.body.email.includes("@")) {
        return User.find({ email: req.body.email })
            .then(result => {
                if (result.length > 0) {
                    return res.status(409).send({ message: "Duplicate email found" });
                } else {
                    return res.status(404).send({ message: "No duplicate email found" });
                }
            })
            .catch(error => errorHandler(error, req, res));
    } else {
        res.status(400).send({ message: "Invalid email format" });
    }
};

// [SECTION] User registration
module.exports.registerUser = (req, res) => {
    if (!req.body.email.includes("@")) {
        return res.status(400).send({ message: 'Invalid email format' });
    } else if (req.body.mobileNo.length !== 11) {
        return res.status(400).send({ message: 'Mobile number is invalid' });
    } else if (req.body.password.length < 8) {
        return res.status(400).send({ message: 'Password must be at least 8 characters long' });
    } else {
        let newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            mobileNo: req.body.mobileNo,
            password: bcrypt.hashSync(req.body.password, 10)
        });

        return newUser.save()
            .then(result => res.status(201).send({
                message: 'User registered successfully',
                user: result
            }))
            .catch(error => errorHandler(error, req, res));
    }
};

// [SECTION] User authentication (login)
module.exports.loginUser = (req, res) => {
    if (req.body.email.includes("@")) {
        return User.findOne({ email: req.body.email })
            .then(result => {
                if (!result) {
                    return res.status(404).send({ message: 'No email found' });
                } else {
                    const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
                    if (isPasswordCorrect) {
                        return res.status(200).send({
                            message: 'User logged in successfully',
                            access: auth.createAccessToken(result)
                        });
                    } else {
                        return res.status(401).send({ message: 'Incorrect email or password' });
                    }
                }
            })
            .catch(error => errorHandler(error, req, res));
    } else {
        return res.status(400).send({ message: 'Invalid email format' });
    }
};

// [SECTION] Get user profile
module.exports.getProfile = (req, res) => {
    return User.findById(req.user.id)
        .then(user => {
            if (!user) {
                return res.status(403).send({ message: 'Invalid signature' });
            } else {
                user.password = "";
                return res.status(200).send(user);
            }
        })
        .catch(error => errorHandler(error, req, res));
};

// [SECTION] Update user password
module.exports.updatePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const { id } = req.user;

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.findByIdAndUpdate(id, { password: hashedPassword });

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// [SECTION] Update user profile
module.exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { firstName, lastName, mobileNo } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { firstName, lastName, mobileNo },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
};

// [SECTION] Set user as admin
module.exports.updateUserAsAdmin = async (req, res) => {
    try {
        const userId = req.params.id;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { role: 'admin' },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send({ message: 'User not found' });
        }

        res.status(200).send({
            message: `User with ID ${userId} has been set as admin`,
            user: updatedUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to set user as admin' });
    }
};
