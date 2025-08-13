// testando o service de place

import { Test, TestingModule } from "@nestjs/testing"
import { PlaceService } from "./place.service"
import { PrismaService } from "../prisma/prisma.service"
import { CloudinaryService } from "./cloudinary.service";


const mockPrisma = {
    place: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),

    }
}

describe("PlaceService", () => {
    let TestPlaceService: PlaceService
    let TestcloudinaryService: CloudinaryService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PlaceService,
                {
                    provide: PrismaService,
                    useValue: mockPrisma,

                },
                {
                    provide: CloudinaryService,
                    useValue: {
                        deleteImage: jest.fn(),
                        uploadImage: jest.fn()
                    }
                }
            ],
        }).compile()

        TestPlaceService = module.get<PlaceService>(PlaceService);
        TestcloudinaryService = module.get<CloudinaryService>(CloudinaryService)
    });


    // inicio dos teste
    //test de criação
    it("deve criar novo endereco", async () => {
        const dto = { name: "amontada", latitude: 12.123456, longitude: 12.987654, images: [{ url: "jbhasdfpiuapi", public_id: "jhsadgfçpasiugfpiu" }] }

        mockPrisma.place.create.mockResolvedValue(dto)

        const result = await TestPlaceService.create(dto as any)

        expect(result).toEqual(dto)
        expect(mockPrisma.place.create).toHaveBeenCalledWith({ data: dto })
    })

    //test findAll 
    it("deve retornar todos os places", async () => {
        const dto = [
            { id: "abcd123", name: "amontada", latitude: 12.123456, longitude: 12.987654, images: [{ url: "jbhasdfpiuapi", public_id: "jhsadgfçpasiugfpiu" }] },
            { id: "efgh456", name: "amontada", latitude: 12.123456, longitude: 12.987654, images: [{ url: "jbhasdfpiuapi", public_id: "jhsadgfçpasiugfpiu" }] },
            { id: "ijkl789", name: "amontada", latitude: 12.123456, longitude: 12.987654, images: [{ url: "jbhasdfpiuapi", public_id: "jhsadgfçpasiugfpiu" }] },
        ]

        mockPrisma.place.findMany.mockResolvedValue(dto);

        const result = await TestPlaceService.findAll()

        expect(result).toEqual(dto)
        expect(mockPrisma.place.findMany).toHaveBeenCalledWith()
    })

    //test do findOne
    it("deve retornar um place unico pelo ID", async () => {
        const id = "abc123"
        const data = { id: "abc123", name: "amontada", latitude: 12.123456, longitude: 12.987654, images: [{ url: "jbhasdfpiuapi", public_id: "jhsadgfçpasiugfpiu" }] }

        mockPrisma.place.findUnique.mockResolvedValue(data)

        const result = await TestPlaceService.findOne(id)

        expect(result).toEqual(data)
        expect(mockPrisma.place.findUnique).toHaveBeenCalledWith({ where: { id } })
    })

    // test updade
    it("deve atualizar um place existente sem novas imagens", async () => {
        const id = "abc123"
        const placeExistente = {
            id,
            name: "Praia antiga",
            latitude: 12.123456,
            longitude: 12.987654,
            images: [{ url: "url_antiga", public_id: "pid123" }]
        }
        const dataUpdate = {
            name: "Amontada",
            latitude: 11.111111,
            longitude: 22.222222,
        }
        const placeAtualizado = { ...placeExistente, ...dataUpdate }

        mockPrisma.place.findUnique.mockResolvedValue(placeExistente)
        mockPrisma.place.update.mockResolvedValue(placeAtualizado)

        const result = await TestPlaceService.update(id, dataUpdate)

        expect(result).toEqual(placeAtualizado)
        expect(mockPrisma.place.findUnique).toHaveBeenCalledWith({ where: { id } })
        expect(mockPrisma.place.update).toHaveBeenCalledWith({
            where: { id },
            data: expect.objectContaining(dataUpdate)
        })
    })

    // it("deve atualizar um place com novas imagens, deletando antigas e fazendo upload", async () => {  })


    // test delete
    it("deve apagar um place", async () => {
        const id = "qweadsdgfsa"
        const retornoEsperado = {
            id: "abc123",
            name: "amontada",
            latitude: 12.123456,
            longitude: 12.987654,
            images: [
                {
                    url: "jbhasdfpiuapi",
                    public_id: "jhsadgfçpasiugfpiu"
                },
            ],
        }

        mockPrisma.place.findUnique.mockResolvedValue(retornoEsperado)
        mockPrisma.place.delete.mockResolvedValue(retornoEsperado);

        const result = await TestPlaceService.remove(id)
        expect(result).toEqual(retornoEsperado)
        expect(mockPrisma.place.findUnique).toHaveBeenCalledWith({ where: { id } })
        expect(mockPrisma.place.delete).toHaveBeenCalledWith({ where: { id } });
    });
});