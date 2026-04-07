import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { uploadToCloudinary, deleteFromCloudinary } from "../services/cloudinary.js";
import { User } from '../models/user.js';
import { Story } from '../models/story.js';
import { sendVerificationEmail } from '../services/mailer.js';


export const getCurrentUserController = async(req, res, next) =>{
  console.log('=== UPDATE USER ===');
  console.log('req.file:', req.file);
  console.log('req.body:', req.body);
    try{
        res.status(200).json({
            status: 200,
            message: 'Successfuly fetched current user!',
            data: {user: req.user}, 
         });
    }catch(error){
        next(error);
    }
}

export const updateCurrentUserController = async (req, res, next) => {
  try {
    const {email, ...rest} = req.body;
console.log('=== UPDATE USER ===');
console.log('req.body:', req.body);
console.log('rest:', rest);
console.log('rest.password:', rest.password);
    if (rest.password) {
      rest.password = await bcrypt.hash(String(rest.password), 10); // хушуємо
    }

    const updateData = { ...rest }; // беремо name, email тощо

    // Якщо прийшов файл, завантажуємо його
    if (req.file) {
      const user = await User.findById(req.user._id);

      if (user.avatarPublicId) {
        await deleteFromCloudinary(user.avatarPublicId);
      }
      const result = await uploadToCloudinary(req.file.buffer, 'myapp/users/avatars');
      updateData.avatarUrl = result.secure_url;
      updateData.avatarPublicId = result.public_id;
    }

    if (email && email !== req.user.email){

      console.log('=== EMAIL CHANGE ===');
  console.log('new email:', email);
  console.log('current email:', req.user.email);
      const verificationToken = crypto.randomBytes(32).toString('hex');
      updateData.pendingEmail = email;
      updateData.verificationToken = verificationToken;
      console.log('updateData:', updateData);
      await sendVerificationEmail(email, verificationToken);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -refreshToken -avatarPublicId');

    res.status(200).json({
      status: 200,
      message: 'User updated successfully!',
      data: { user: updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsersController = async (req, res, next) =>{
    try{
        const {page = 1, perPage = 10} = req.query;

        const pageNum = parseInt(page);
        const limit = parseInt(perPage);
        const skip = (pageNum - 1) * limit;

        // Тільки автори (мають description)
        const filter = {description: { $exists: true }};

        const totalItems = await User.countDocuments(filter);
        const totalPages = Math.ceil(totalItems / limit);

        const users = await User.find(filter).select('_id name avatarUrl description articlesAmount').skip(skip).limit(limit);

        res.status(200).json({
            status: 200,
            message: 'Successfully found users!',
            data: {
                users,
                page: pageNum,
                parePage: limit,
                totalItems,
                totalPages,
                hasPreviousPage: pageNum > 1,
                hasNextPage: pageNum < totalPages,
            },
        });
    }catch(error){
        next(error);
    }
}

export const getUserByIdController = async (req, res, next)=>{
    try{
        const { id } = req.params;

        console.log('=== GET USER BY ID ===', id); // ← додай

        const user = await User.findById(id).select('_id name avatarUrl description articlesAmount');

        if (!user) {
            return res.status(404).json({
                status: 404,
                message: 'User not found!',
            });
        }
        const stories = await Story.find({ ownerId: id })
         .select('_id title img date category favoriteCount');

       res.status(200).json({
       status: 200,
       message: 'Successfully found user!',
       data: { user, stories },
      });
    }catch(error){
        next(error)
    }
}

export const verifyEmailController = async (req, res, next) =>{
  try{
    const {token} = req.query;
    console.log('=== VERIFY EMAIL ===');
    console.log('token from query:', token);

    const user = await User.findOne({verificationToken: token});
    console.log('user found:', !!user);
console.log('searching for token:', token);
console.log('token length:', token.length);

    if(!user) {
      return res.status(404).json({
        status: 404,
        message: 'Invalid or expired verification token!',
      })
    }

    await User.findByIdAndUpdate(user._id, {
      email: user.pendingEmail,
      pendingEmail: null,
      verificationToken: null,
    })

    res.status(200).json({
      status: 200,
      message: 'Email verified successfully!',
    })

  }catch(error){
    next (error)
  }
}

