import { registerUser, loginUser } from '../services/auth.js';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';

export const registerUserController = async (req, res, next) => {
  try {
    const {name, email, password}= req.body;

    if (!name || !email || !password){
      return res.status(400).json({
        status: 400,
        message: 'Name, email and password are required!',
      });
    }
    const user = await registerUser({name, email, password});
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUserController = async (req, res, next) => {
  try {
    const user = await loginUser(req.body.email, req.body.password);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    user.refreshToken = refreshToken;
    await user.save();

const { password, refreshToken: _, ...safeUser } = user.toObject();

res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 7 * 23 * 60 * 60 * 1000
});

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in!',
      data: { accessToken, refreshToken, user: safeUser }
    });
  } catch (error) {
    next(error);
  }
};

export const refreshUserController = async (req, res, next) => {
  try {
    const  refreshToken  = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    res.status(200).json({
      status: 200,
      message: 'Token refreshed',
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    res.status(401).json({ message: 'Refresh token expired or invalid' });
  }
};

export const logoutUserController = async(req, res,next)=>{
    try{
        const userId = req.user?._id
        if (!userId){
            return res.status(401).json({message: 'Unauthorized'})
        }
       await User.findByIdAndUpdate(userId, { refreshToken: null }); 
       res.clearCookie('refreshToken');
       res.status(200).json({ message: 'Successfully logged out!' });
    }catch(error){
       next(error) 
    }

};

