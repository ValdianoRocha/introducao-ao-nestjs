// Testando o service de Place

import { Test, TestingModule } from "@nestjs/testing";
import { PlaceService } from "../place.service";
import { PrismaService } from "../../prisma/prisma.service";
import { CloudinaryService } from "../cloudinary.service";

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
    let placeService: PlaceService;
    let cloudinaryService: CloudinaryService;

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
                        uploadImage: jest.fn(),
                    },
                }
            ],
        }).compile();

        placeService = module.get<PlaceService>(PlaceService);
        cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
    });

    // Início dos testes

    // Teste de criação
    it("deve criar um novo endereço", async () => {
        const dto = { 
            name: "Amontada", 
            latitude: 12.123456, 
            longitude: 12.987654, 
            images: [{ url: "jbhasdfpiuapi", public_id: "jhsadgfçpasiugfpiu" }] 
        };

        mockPrisma.place.create.mockResolvedValue(dto);

        const result = await placeService.create(dto as any);

        expect(result).toEqual(dto);
        expect(mockPrisma.place.create).toHaveBeenCalledWith({ data: dto });
    });

    // Teste findAll
    it("deve retornar todos os places", async () => {
        const dto = [
            { id: "abcd123", name: "Amontada", latitude: 12.123456, longitude: 12.987654, images: [{ url: "jbhasdfpiuapi", public_id: "jhsadgfçpasiugfpiu" }] },
            { id: "efgh456", name: "Amontada", latitude: 12.123456, longitude: 12.987654, images: [{ url: "jbhasdfpiuapi", public_id: "jhsadgfçpasiugfpiu" }] },
            { id: "ijkl789", name: "Amontada", latitude: 12.123456, longitude: 12.987654, images: [{ url: "jbhasdfpiuapi", public_id: "jhsadgfçpasiugfpiu" }] },
        ];

        mockPrisma.place.findMany.mockResolvedValue(dto);

        const result = await placeService.findAll();

        expect(result).toEqual(dto);
        expect(mockPrisma.place.findMany).toHaveBeenCalled();
    });

    // Teste do findOne
    it("deve retornar um place único pelo ID", async () => {
        const id = "abc123";
        const data = { id: "abc123", name: "Amontada", latitude: 12.123456, longitude: 12.987654, images: [{ url: "jbhasdfpiuapi", public_id: "jhsadgfçpasiugfpiu" }] };

        mockPrisma.place.findUnique.mockResolvedValue(data);

        const result = await placeService.findOne(id);

        expect(result).toEqual(data);
        expect(mockPrisma.place.findUnique).toHaveBeenCalledWith({ where: { id } });
    });

    // Teste update
    it("deve atualizar um place existente sem novas imagens", async () => {
        const id = "abc123";
        const placeExistente = {
            id,
            name: "Praia Antiga",
            latitude: 12.123456,
            longitude: 12.987654,
            images: [{ url: "url_antiga", public_id: "pid123" }]
        };
        const dadosAtualizados = {
            name: "Amontada",
            latitude: 11.111111,
            longitude: 22.222222,
        };
        const placeAtualizado = { ...placeExistente, ...dadosAtualizados };

        mockPrisma.place.findUnique.mockResolvedValue(placeExistente);
        mockPrisma.place.update.mockResolvedValue(placeAtualizado);

        const result = await placeService.update(id, dadosAtualizados);

        expect(result).toEqual(placeAtualizado);
        expect(mockPrisma.place.findUnique).toHaveBeenCalledWith({ where: { id } });
        expect(mockPrisma.place.update).toHaveBeenCalledWith({
            where: { id },
            data: expect.objectContaining(dadosAtualizados)
        });
    });

    // Teste delete
    it("deve apagar um place", async () => {
        const id = "qweadsdgfsa";
        const retornoEsperado = {
            id: "abc123",
            name: "Amontada",
            latitude: 12.123456,
            longitude: 12.987654,
            images: [
                { url: "jbhasdfpiuapi", public_id: "jhsadgfçpasiugfpiu" },
            ],
        };

        mockPrisma.place.findUnique.mockResolvedValue(retornoEsperado);
        mockPrisma.place.delete.mockResolvedValue(retornoEsperado);

        const result = await placeService.remove(id);

        expect(result).toEqual(retornoEsperado);
        expect(mockPrisma.place.findUnique).toHaveBeenCalledWith({ where: { id } });
        expect(mockPrisma.place.delete).toHaveBeenCalledWith({ where: { id } });
    });
});
