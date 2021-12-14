import { Router } from 'express';
import { CreateImageDto } from '@dtos/images.dto';
import { Routes } from '@interfaces/routes.interface';
import ImagesController from '@controllers/images.controller';
import uploadFileMiddleware from '@/middlewares/upload.middleware';
import validationMiddleware from '@middlewares/validation.middleware';

class ImagesRoute implements Routes {
  public path = '/images';
  public router = Router();
  public imagesController = new ImagesController();

  constructor() {
    this.initializeRoutes();
  }

  private async initializeRoutes() {
    this.router.get(`${this.path}`, this.imagesController.getImages);

    this.router.get(`${this.path}/:id(\\d+)`, this.imagesController.getImageById);

    this.router.post(
      `${this.path}`,
      uploadFileMiddleware.single('file'),
      validationMiddleware(CreateImageDto, 'body'),
      this.imagesController.createImage,
    );
  }
}

export default ImagesRoute;
