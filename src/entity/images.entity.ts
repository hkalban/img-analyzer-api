import { IsNotEmpty } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Image } from '@interfaces/images.interface';
import { ObjectEntity } from './objects.entity';

@Entity()
export class ImageEntity implements Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column()
  @IsNotEmpty()
  path: string;

  @Column()
  @IsNotEmpty()
  analyze: boolean;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => ObjectEntity)
  @JoinTable()
  objects: ObjectEntity[];
}
