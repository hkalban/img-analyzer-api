import { NextFunction, Request, Response } from 'express';
import { CreateImageDto, ImageMapper } from '@dtos/images.dto';
import { Image } from '@interfaces/images.interface';
import imageService from '@services/images.service';
import { isEmpty } from '@/utils/util';

class ImagesController {
  public imageService = new imageService();

  public getImages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const searchQuery = req.query.objects;
      let objects: string[];

      if (searchQuery) {
        objects = searchQuery.toString().split(',');
      }

      const findAllImagesData: Image[] = await this.imageService.findAllImages(objects);

      res.status(200).json({ data: ImageMapper.toROs(findAllImagesData), message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getImageById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const imageId = Number(req.params.id);
      const findOneImageData = await this.imageService.findImageById(imageId);

      res.status(200).json({ data: ImageMapper.toRO(findOneImageData), message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let path: string;

      try {
        path = getImagePath(req);
      } catch (error) {
        res.status(400).json({ message: error.message });
        return;
      }

      const imageData: CreateImageDto = {
        label: getLabel(req.body.label),
        path,
        analyze: shouldAnalyze(req.body.analyze),
      };

      const createImageData: Image = await this.imageService.createImage(imageData);

      res.status(201).json({ data: ImageMapper.toRO(createImageData), message: 'created' });
    } catch (error) {
      next(error);
    }
  };
}

function getImagePath(req: Request): string {
  // If file upload
  if (req.file) {
    return req.file.path;
  }

  // If Url provided
  if (req.body.url) {
    const url = req.body.url;

    //validate URL
    if (url.match(/\.(jpeg|jpg|gif|png)$/) == null) {
      throw new Error(`Invalid Image URL ${url}`);
    }

    return url;
  }

  // If no upload or url provided
  throw new Error('Please upload an Image or provide Image URL!');
}

// set or generate random label if not provided
function getLabel(label?: string): string {
  return isEmpty(label) ? Math.random().toString(36).substr(7, 8) : label;
}

// default to true unless set to false
function shouldAnalyze(analyze?: String): boolean {
  return isEmpty(analyze) ? true : analyze === 'true';
}

export default ImagesController;
