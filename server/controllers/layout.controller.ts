import { Request, Response, NextFunction } from 'express';
import ErrorHandler from '../utils/ErrorHandler';
import LayoutModel from '../models/layout.model';
import cloudinary from 'cloudinary'
import { CatchAsyncError } from '../middleware/catchAsyncError';

export const createLayout = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const {type} = req.body;
        if (type === 'Banner') {
            const {image, title, subtitle} = req.body;
            const myCloud = await cloudinary.v2.uploader.upload(image, {
                folder: "layouts",
            });
            const banner = {
                image: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                },
                title,
                subtitle,
            }
            await LayoutModel.create(banner);
        };

        if(type === 'FAQ') {
            const {faq} = req.body;
            await LayoutModel.create(faq);
        };

        if (type === 'Categories') {
            const {categories} = req.body;
            await LayoutModel.create(categories);
        };

        res.status(201).json({
            success: true,
            message: 'Layout creado exitosamente',
            layout: req.body,
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})
