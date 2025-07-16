import { Controller, Get, Post, Body, Param, Delete, BadRequestException, UseInterceptors, UploadedFiles, Put } from '@nestjs/common';
import { PlaceService } from './place.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { CloudinaryService } from './cloudinary.service';
import { File as MulterFile } from 'multer'
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UpdatePlaceDto } from './dto/update-place.dto';

@Controller('place')
export class PlaceController {
  constructor(
    private readonly placeService: PlaceService,
    private cloudinary: CloudinaryService
  ) { }

  @Post()
  @UseInterceptors( // midwrere  interceptação das requisiçoes
    FileFieldsInterceptor([{ name: 'images', maxCount: 3 }]))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Cadastrar novo local' })
  @ApiResponse({ status: 201, description: 'place criado com sucesso' })
  @ApiBody({
    description: 'Formulário com os dados do local + imagens',
    schema: {
      type: 'object',
      required: ['name', 'type', 'phone', 'latitude', 'longitude', 'images'],
      properties: {
        name: { type: 'string', example: 'Praça Central' },
        type: { type: 'string', enum: ['RESTAURANTE', 'BAR', 'HOTEL'] },
        phone: { type: 'string', example: '(88) 99999-9999' },
        latitude: { type: 'number', example: -3.7327 },
        longitude: { type: 'number', example: -38.5267 },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Máximo de 3 imagens',
        },
      },
    },
  })
  async create(
    @Body() data: CreatePlaceDto,
    @UploadedFiles() files: { images?: MulterFile[] }
  ) {

    if (!files.images || files.images.length === 0) {
      throw new BadRequestException('Pelo menos ima imagem deve ser enviada')
    }

    const imagesUrls = await Promise.all(
      files.images.map((file) => this.cloudinary.uploadImage(file.buffer))
    )
    return this.placeService.create({ ...data, images: imagesUrls });
  }

  @Get()
  async findAll() {
    return this.placeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.placeService.findOne(id);
  }

  @UseInterceptors( // midwrere  interceptação das requisiçoes
    FileFieldsInterceptor([{ name: 'images', maxCount: 3 }]))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Atualizar um local' })
  @ApiResponse({ status: 200, description: 'place Atualizado com sucesso' })
  @ApiBody({
    description: 'Formulário com dados opcionais para atualizar um local + imagens',
    schema: {
      type: 'object',
      required: ['name', 'type', 'phone', 'latitude', 'longitude', 'images'],
      properties: {
        name: { type: 'string', example: 'Praça Central' },
        type: { type: 'string', enum: ['RESTAURANTE', 'BAR', 'HOTEL'] },
        phone: { type: 'string', example: '(88) 99999-9999' },
        // latitude: { type: 'number', example: -3.7327 },
        // longitude: { type: 'number', example: -38.5267 },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'As novas imagens substituem as anteriores. (Máximo de 3 imagens)',
        },
      },
    },
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePlaceDto: UpdatePlaceDto,
    @UploadedFiles() files: { images?: MulterFile[] }
  ) {
    const newImages = files.images?.map(img => img.buffer)

    return this.placeService.update(id, updatePlaceDto, newImages);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleta um local com suas imagens' })
  @ApiResponse({ status: 200, description: 'Local deletado com Sucesso!' })
  async remove(@Param('id') id: string) {
    return this.placeService.remove(id);
  }
}
