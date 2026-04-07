import {Story} from '../models/story.js';
import {User} from '../models/user.js'
import { uploadToCloudinary } from "../services/cloudinary.js";

export const getAllStoriesController = async (req, res, next)=>{
    try{
        const {page=  1, perPage = 10, categoryId} = req.query;

        const filter = {};
        if(categoryId){
            filter.category = categoryId;
        }

        const skip = (Number(page) - 1) * Number(perPage); 

        const [stories, totalItems] = await Promise.all([
            Story.find(filter)
             .sort({date: -1})
             .populate('category', 'name')                     // <--- тут
             .populate('ownerId', 'name avatarUrl')    // <--- тут
             .skip(skip)
             .limit(Number(perPage)),

            Story.countDocuments(filter), 
        ]);

        const totalPages = Math.ceil(totalItems / Number(perPage));

        res.status(200).json({
            status: 200,
            message: 'Successfully founmd stories!',
            data: {
                stories,
                page: Number(page),
                perPage: Number(perPage),
                totalItems,
                totalPages,
                hasPreviousPage: Number(page) > 1,
                hasNextPage: Number(page)< totalPages,
            },
        });
    }catch(error){
        next(error)
    }
};

export const addToFavoritesController = async (req, res, next) => {
    try{
        const {id} = req.params;
        const userId = req.user._id;

        const story = await Story.findById(id);

        if(!story) {

            return res.status(404).json({
                status:404,
                message: 'Story not found!',
            });
        }

        const user = await User.findById(userId);

        if (user.favorites.includes(id)){
            return res.status(409).json({
                status: 409,
                message: 'Story already in favorites!',
            });
        }

        await User.findByIdAndUpdate(userId, {
      $push: { favorites: id },
    });

    await Story.findByIdAndUpdate(id, {
      $inc: { favoriteCount: 1 },
    });

    res.status(200).json({
      status: 200,
      message: 'Story added to favorites!',
    }); 
    }catch(error){
        next(error);
    }
};

export const removeFromFavoritesController = async (req, res, next) =>{
    try{

        const {id} =req.params;
        const userId = req.user._id;

        const story = await Story.findById(id);

        if (!story){
            return res.status(404).json({
                status: 404,
                message: 'Story not found!',
            });
        }

        const user = await User.findById(userId);
        
        if(!user.favorites.includes(id)){
            return res.status(409).json({
                status: 409,
                message: 'Stoty not in favorites!',
            });
        }

        await User.findByIdAndUpdate(userId, {
           $pull: { favorites: id }, 
        });

        await User.findByIdAndUpdate(id, {
            $inc: { favoriteCount: -1 },
        });

        res.status(200).json({
            status: 200,
            message: 'Story removed from favorites!',
        });

    }catch(error){
        next(error)
    }
}

export const getFavoritesController = async(req, res, next) => {
    try{
        const {page = 1, perPage = 10} = req.query;
        const userId = req.user._id;

        const user = await User.findById(userId).select('favorites');
        const totalItems = user.favorites.length;
        const totalPages = Math.ceil(totalItems / Number(perPage));
        const skip = (Number(page) - 1 ) * Number(perPage);

        const paginatedIds = user.favorites.slice(skip, skip + Number(perPage));

        const stories = await Story.find({ _id: { $in: paginatedIds } })
      .select('_id title img date category favoriteCount ownerId')
      .populate('ownerId', 'name avatarUrl')
      .populate('category', 'name');

      res.status(200).json({
      status: 200,
      message: 'Successfully found favorites!',
      data: {
        stories,
        page: Number(page),
        perPage: Number(perPage),
        totalItems,
        totalPages,
        hasPreviousPage: Number(page) > 1,
        hasNextPage: Number(page) < totalPages,
      },
    });

    }catch(error){
        next(error)

    }
}

export const getMyStoriesController = async (req, res, next) =>{
    try{

        const {page = 1, perPage = 10} = req.query;
        const userId = req.user._id;

        const skip = (Number(page) - 1) * Number(perPage);

        const [stories, totalItems] = await Promise.all([
            Story.find({ownerId: userId})
            .select('_id title img date category favoriteCount ownerId')
            .skip(skip)
            .limit(Number(perPage)),
            Story.countDocuments({ownerId: userId}),
        ]);
         const totalPages = Math.ceil(totalItems / Number(perPage));
      
        res.status(200).json({
          status: 200,
          message: 'Successfully found your stories!',
            data: {
           stories,
           page: Number(page),
           perPage: Number(perPage),
           totalItems,
           totalPages,
           hasPreviousPage: Number(page) > 1,
           hasNextPage: Number(page) < totalPages,
      },
    });
    }catch (error) {
       next(error)
    }
}
export const createStoryController = async (req, res, next) =>{
    try{

        const { title, article, category, date } = req.body;
        const userId = req.user._id;
        
        let imgUrl = null;

        if (req.file) {
            const result = await uploadToCloudinary(req.file.bufer, 'stories');
            imgUrl = result.secure_url;
        }

        const story = await Story.create({
            title,
            article,
            category,
            date,
            img: imgUrl,
            ownerId: userId,   
        });

        await User.findByIdAndUpdate(userId, {
            $inc: { articlesAmount: 1 },
        })

        res.status(201).json({
            status: 201,
            message: 'Story created successfully!',
            date: {story},
        });

    }catch (error){
        next(error)
    }
};

export const updateStoryController = async (req, res, next) => {
    try{
      
      const {id} = req.params
      const userId = req.user._id;
      const { title, article, category, date } = req.body;
      
      const story = await Story.findById(id);

      if(!story) {
        return res.status(404).json({
           status: 404,
           message: 'Story not found!',  
        });
      }

      if (story.ownerId.toString() !== userId.toString()){
        return res.status(403).json({
            status: 403,
            message: 'You are not allowed to edit this stopry!'
        });
      }
       
      let imgUrl =story.img;

      if(req.file){
        const result = await uploadToCloudinary(req.file.buffer, 'stories');
        imgUrl = result.secure_url;
      }

      const updatedStory = await Story.findByIdAndUpdate(
        id,
        {title, article, category, date, img: imgUrl}, 
        {new: true},
      );

      res.status(200).json({
    status: 200,
    message: 'Story updated successfully!', 
    data: {story: updatedStory},
   })


   
    }catch (error){
        next(error)
    }
}