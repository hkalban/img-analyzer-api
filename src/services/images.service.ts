import { getRepository } from 'typeorm';
import { CreateImageDto } from '@dtos/images.dto';
import { ImageEntity } from '@entity/images.entity';
import { HttpException } from '@exceptions/HttpException';
import { Image } from '@interfaces/images.interface';
import { isEmpty } from '@utils/util';
import ObjectService from './objects.service';
import { ObjectEntity } from '@/entity/objects.entity';

class ImageService {
  public images = ImageEntity;

  public async findAllImages(searchTerms?: string[]): Promise<Image[]> {
    const imageRepository = getRepository(this.images);

    let images: Image[] = [];

    // If search term(s) are provided
    if (searchTerms) {
      // Add wildcards to search terms for full text search
      searchTerms = searchTerms.map(term => `%${term}%`);

      images = await imageRepository
        .createQueryBuilder('images')
        .leftJoin('images.objects', 'object')
        .leftJoinAndSelect('images.objects', 'objectsSelect')
        .where('object.name ILIKE ANY (array[:...searchTerms])', { searchTerms })
        .orderBy('images.createdAt', 'DESC')
        .getMany();
    } else {
      images = await imageRepository.find({
        relations: ['objects'],
        order: {
          createdAt: 'DESC',
        },
      });
    }

    return images;
  }

  public async findImageById(imageId: number): Promise<Image> {
    if (isEmpty(imageId)) throw new HttpException(400, "imageId can't be empty");

    const imageRepository = getRepository(this.images);
    const findImage: Image = await imageRepository.findOne({ where: { id: imageId }, relations: ['objects'] });
    if (!findImage) throw new HttpException(404, `imageId ${imageId} not found`);

    return findImage;
  }

  public async createImage(imageData: CreateImageDto): Promise<Image> {
    if (isEmpty(imageData)) throw new HttpException(400, 'Invalid input');

    try {
      // Detect objects and save metadata
      const objects: ObjectEntity[] = await new ObjectService().createObjects(imageData);

      // Save Image metadata
      const imageRepository = getRepository(this.images);
      const createImageData: Image = await imageRepository.save({ ...imageData, objects });

      return createImageData;
    } catch (error) {
      throw error;
    }
  }
}

export default ImageService;
