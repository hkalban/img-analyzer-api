import { Image, ImageRO } from '@/interfaces/images.interface';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateImageDto {
  @IsOptional()
  @IsString()
  public label: string;

  @IsOptional()
  @IsString()
  public path: string;

  @IsOptional()
  @IsUrl()
  public url?: string;

  @IsOptional()
  @IsString()
  public analyze: boolean;
}

export class ImageMapper {
  public static toRO = (image: Image): ImageRO => {
    return {
      id: image.id,
      label: image.label,
      path: image.path,
      analyze: image.analyze,
      objects: !image.objects ? [] : image.objects.map(obj => obj.name),
    } as ImageRO;
  };

  public static toROs = (images: Image[]): ImageRO[] => {
    return images.map(image => {
      return this.toRO(image);
    });
  };
}
