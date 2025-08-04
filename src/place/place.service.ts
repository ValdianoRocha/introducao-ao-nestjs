import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from './cloudinary.service';
import { ImageObject } from './types/image_object';
import { Place } from '@prisma/client';

@Injectable()
export class PlaceService {

  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService
  ) { }

  async create(data: {
    name: string,
    type: any,
    phone: string,
    latitude: number,
    longitude: number,
    images: ImageObject[]
  }) {
    return this.prisma.place.create({ data })
  }

  async findAll() {
    return this.prisma.place.findMany()
  }

  async findPaginated(page: number, limit: number) {
    // const skip = (page - 1) * limit

    const [places, total] = await this.prisma.$transaction([
      this.prisma.place.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { created_at: 'desc' }
      }),
      this.prisma.place.count(),
    ]);

    return {
      data: places,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit)
      }
    }

  }

  async findOne(id: string) {
    return this.prisma.place.findUnique({
      where: { id }
    })
  }

  async update(id: string, data: Partial<Place>, newImages?: Buffer[]): Promise<Place> {

    const place = await this.prisma.place.findUnique(
      { where: { id } }
    )
    if (!place) throw new BadRequestException('Local não encontrado!')

    //se forem inviado imagens 
    let images = place.images as ImageObject[]

    if (newImages && newImages.length > 0) {

      //deleta as imagens existernte no cloudinary
      await Promise.all(images.map(img =>
        this.cloudinary.deleteImage(img.public_id)
      ))


      //Upload de novas imagens a serem armazendas
      images = await Promise.all(
        newImages.map(
          newImg => {
            return this.cloudinary.uploadImage(newImg)
          }
        )
      )
    }
    return this.prisma.place.update({
      where: { id },
      data: {
        ...data,
        ...(newImages ?
          { images: JSON.parse(JSON.stringify(images)) } : {})
      }
    })
  }

  async remove(id: string): Promise<void> {
    //verifica se existe o local
    const place = await this.prisma.place.findUnique({
      where: { id }
    })
    if (!place) throw new BadRequestException('Local não encontrado!')

    //apaga as imagens no cloudinary
    const images = place.images as ImageObject[]

    await Promise.all(images.map(
      (image) => this.cloudinary.deleteImage(image.public_id)
    ))

    // apaga o local no banco de dados
    await this.prisma.place.delete({
      where: { id }
    })
  }
}
