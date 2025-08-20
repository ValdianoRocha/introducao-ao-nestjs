import { Test, TestingModule } from "@nestjs/testing";
import { PlaceController } from "../place.controller";
import { PlaceService } from "../place.service";
import { CloudinaryService } from "../cloudinary.service";
import { Place, placeType } from "@prisma/client";
import { CreatePlaceDto } from "../dto/create-place.dto";
import { BadRequestException } from "@nestjs/common";
import { PaginationDto } from "../dto/pagination.dto";
import { ImageObject } from "../types/image_object";

const data: Place[] = [
    {
        id: "123",
        name: "valdiano",
        type: placeType.BAR,
        phone: "123",
        latitude: 12.123,
        longitude: 98.987,
        images: [
            { url: "url_antiga", public_id: "pid123" },
            { url: "url_antiga", public_id: "pid123" }
        ],
        created_at: new Date()
    },
    {
        id: "456",
        name: "valdiano",
        type: placeType.BAR,
        phone: "123",
        latitude: 12.123,
        longitude: 98.987,
        images: [
            { url: "url_antiga", public_id: "pid123" },
            { url: "url_antiga", public_id: "pid123" }
        ],
        created_at: new Date()
    },
]

describe("PlaceController testes", () => {

    let testController: PlaceController;
    let placeService: jest.Mocked<PlaceService>;
    let cloudinaryService: jest.Mocked<CloudinaryService>;

    beforeEach(async () => {
        const mockPlaceService = {
            findAll: jest.fn(),
            findPaginated: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        } as any;

        const mockCloudinaryService = {
            uploadImage: jest.fn(),
            deleteImage: jest.fn(),
        } as any;

        const module: TestingModule = await Test.createTestingModule({
            controllers: [PlaceController],
            providers: [
                { provide: PlaceService, useValue: mockPlaceService },
                { provide: CloudinaryService, useValue: mockCloudinaryService }
            ]
        }).compile();

        testController = module.get<PlaceController>(PlaceController);
        placeService = module.get(PlaceService);
        cloudinaryService = module.get(CloudinaryService);
    });

    // Deve listar todos os locais
    it("deve listar todos os places", async () => {
        placeService.findAll.mockResolvedValue(data);

        expect(await testController.findAll()).toEqual(data);
        expect(placeService.findAll).toHaveBeenCalled();
    });

    // Deve apagar um place
    it("deve apagar um place", async () => {
        placeService.remove.mockResolvedValue(data[0]);

        expect(await testController.remove(data[0].id)).toEqual(data[0]);
        expect(placeService.remove).toHaveBeenCalledWith(data[0].id);
    });

    // Deve lançar um erro se não encontrar o id
    it("deve lançar um erro se não encontrar o id", async () => {
        const id = "";

        placeService.remove.mockRejectedValue(new BadRequestException("Local não encontrado!"));

        await expect(placeService.remove(id)).rejects.toThrow(BadRequestException);
    });

    // Deve criar um place com imagens
    it("deve criar um place com imagens", async () => {
        const dto: CreatePlaceDto = { name: "valdiano", type: placeType.BAR, phone: "123", latitude: 12.123, longitude: 98.987 };
        const file = {
            images: [
                { buffer: Buffer.from('img') },
                { buffer: Buffer.from('img') }
            ]
        }
        const images: ImageObject[] = [{ url: "url", public_id: "public_id" }, { url: "url", public_id: "public_id" }]

        cloudinaryService.uploadImage.mockResolvedValue({ url: "url", public_id: "public_id" });
        placeService.create.mockResolvedValue(data[0]);

        const result = await testController.create(dto, file);

        expect(cloudinaryService.uploadImage).toHaveBeenCalled();
        expect(placeService.create).toHaveBeenCalledWith({ ...dto, images });
        expect(result.id).toBe('123');
    });

    // Deve lançar erro ao criar sem imagens
    it("deve lançar um erro se não for enviado nenhuma imagem na hora de criar", async () => {
        const dto: CreatePlaceDto = { name: "valdiano", type: placeType.BAR, phone: "123", latitude: 12.123, longitude: 98.987 };
        const file = { images: [] } as any;

        await expect(testController.create(dto, file)).rejects.toThrow(BadRequestException);
    });

    // Deve listar a paginação
    it("deve retornar os endereços da paginação", async () => {
        const dto: PaginationDto = { limit: 10, page: 1 };
        const paginated = {
            data,
            meta: {
                total: 2,
                page: 1,
                lastPage: 1,
            }
        };

        placeService.findPaginated.mockResolvedValue(paginated);

        const result = await testController.pagination(dto);

        expect(result).toEqual(paginated);
        expect(placeService.findPaginated).toHaveBeenCalledWith(dto.page, dto.limit);
    });

    // Deve atualizar um place
    it("Deve atualizar um place", async () => {
        const id = "123"
        const dto: CreatePlaceDto = { name: "valdiano", type: placeType.BAR, phone: "123", latitude: 12.123, longitude: 98.987 };
        const file = {
            images: [
                { buffer: Buffer.from('img') },
                { buffer: Buffer.from('img') }
            ]
        }

        // {"images": [{"buffer": {"data": [105, 109, 103], "type": "Buffer"}}]}

        placeService.update.mockResolvedValue(data[0])

        expect(await testController.update(id, dto, file)).toEqual(data[0])
        expect(placeService.update).toHaveBeenCalledWith(id, dto, [file.images[0].buffer, file.images[1].buffer])



    })

});
