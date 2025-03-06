import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import LayoutModel from "../models/layout.model";
import cloudinary from "cloudinary";
import { CatchAsyncError } from "../middleware/catchAsyncError";

export const createLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // console.log("📩 Recibiendo petición en /create-layout");
    // console.log("📦 req.body:", req.body);

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "El cuerpo de la solicitud está vacío o no tiene el formato adecuado.",
      });
    }

    const { type } = req.body;

    const isTypeExist = await LayoutModel.findOne({ type });
    if (isTypeExist) {
      return next(new ErrorHandler(`${type} ya existe`, 400));
    }

    if (type === "Banner") {
      const { image, title, subtitle } = req.body;

      const myCloud = await cloudinary.v2.uploader.upload(image, {
        folder: "layout",
      });

      const banner = {
        type: "Banner",
        image: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
        title,
        subtitle,
      };

      await LayoutModel.create(banner);
    }

    if (type === "FAQ") {
      const { faq } = req.body;
      const faqItems = faq.map((item: any) => ({
        question: item.question,
        answer: item.answer,
      }));

      await LayoutModel.create({
        type: "FAQ",
        faq: faqItems,
      });
    }

    if (type === "Categories") {
      const { categories } = req.body;
      const categoriesItems = categories.map((item: any) => ({
        title: item.title,
      }));

      await LayoutModel.create({
        type: "Categories",
        categories: categoriesItems,
      });
    }

    res.status(200).json({
      success: true,
      message: "Layout creado exitosamente",
      layout: req.body,
    });
  }
);

export const editLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // console.log("📩 Recibiendo petición en /edit-layout");
    // console.log("📦 req.body:", req.body);

    const { type } = req.body;

    if (!type) {
      return res.status(400).json({
        success: false,
        message: "El tipo de layout es requerido.",
      });
    }

    if (type === "Banner") {
      const bannerData: any = await LayoutModel.findOne({ type: "Banner" });

      if (!bannerData) {
        return next(new ErrorHandler("Banner no encontrado", 404));
      }

      const { image, title, subtitle } = req.body;

      await cloudinary.v2.uploader.destroy(bannerData.image.public_id);

      const myCloud = await cloudinary.v2.uploader.upload(image, {
        folder: "layout",
      });

      await LayoutModel.findByIdAndUpdate(bannerData._id, {
        image: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
        title,
        subtitle,
      });
    }

    if (type === "FAQ") {
      const { faq } = req.body;
      const faqData = await LayoutModel.findOne({ type: "FAQ" });

      if (!faqData) {
        return next(new ErrorHandler("FAQ no encontrado", 404));
      }

      const faqItems = faq.map((item: any) => ({
        question: item.question,
        answer: item.answer,
      }));

      await LayoutModel.findByIdAndUpdate(faqData._id, { faq: faqItems });
    }

    if (type === "Categories") {
      const { categories } = req.body;
      const categoriesData = await LayoutModel.findOne({ type: "Categories" });

      if (!categoriesData) {
        return next(new ErrorHandler("Categorías no encontradas", 500));
      }

      const categoriesItems = categories.map((item: any) => ({
        title: item.title,
      }));

      await LayoutModel.findByIdAndUpdate(categoriesData._id, {
        categories: categoriesItems,
      });
    }

    res.status(200).json({
      success: true,
      message: "Layout actualizado exitosamente",
    });
  }
);

export const getLayoutByType = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;

      if (!type) {
        return res.status(400).json({
          success: false,
          message: "El tipo de layout es requerido.",
        });
      }

      const layout = await LayoutModel.findOne({ type });

      if (!layout) {
        return res.status(404).json({
          success: false,
          message: `No se encontró un layout de tipo "${type}".`,
        });
      }

      res.status(200).json({
        success: true,
        message: "Layout obtenido exitosamente",
        layout,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
