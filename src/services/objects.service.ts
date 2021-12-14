import { getRepository } from 'typeorm';
import { CreateImageDto } from '@/dtos/images.dto';
import { ObjectEntity } from '@entity/objects.entity';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import DetectService from './detect.service';

class ObjectService {
  public objects = ObjectEntity;

  public async createObjects(imageData: CreateImageDto): Promise<ObjectEntity[]> {
    if (isEmpty(imageData)) throw new HttpException(400, "You're not objectData");

    if (!imageData.analyze) return [];

    let detectedObjects: string[];
    try {
      detectedObjects = await DetectService.analyzeImage(imageData.path);
    } catch (error) {
      throw new HttpException(500, `Failed to Scan Image`);
    }

    try {
      const objectRepository = getRepository(this.objects);

      const results: ObjectEntity[] = [];

      for (const name of detectedObjects) {
        const object = await objectRepository.save({ name });
        results.push(object);
      }

      return results;
    } catch (error) {
      throw new HttpException(500, `Failed to Save Objects ${error}`);
    }
  }
}

export default ObjectService;
