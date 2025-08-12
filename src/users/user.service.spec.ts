//testando as funções do service de user

import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { PrismaService } from "../prisma/prisma.service";
import { NotFoundException } from "@nestjs/common";


// ==============================
// testando as funções do service de user
// ==============================

// Mock do PrismaService
// Criamos um objeto "falso" que simula o comportamento do PrismaService.
// Isso evita acessar o banco de dados real e nos permite controlar o retorno dos métodos.
const mockPrisma = {
    user: {

        // jest.fn() cria uma função "falsa" que podemos configurar e inspecionar.
        // Simula o método prisma.user.create()
        create: jest.fn(),

        // Simula o método prisma.user.findMany()
        findMany: jest.fn(),

        // Simula o método prisma.user.findUnique()
        findUnique: jest.fn(),

        // Simula o método prisma.user.update()
        update: jest.fn(),

        // Simula o método prisma.user.delete()
        delete: jest.fn(),

        // Obs: Aqui só colocamos os métodos que vamos usar/testar.
        // Se no futuro formos testar outros, basta adicionar mais mocks.
    }
}

// ==============================
// Suite de testes para o UsersService
// ==============================
describe("UsersService", () => {
    // Variável onde vamos armazenar a instância do serviço que está sendo testado
    let service: UsersService;

    // beforeEach executa ANTES de cada teste ("it")
    // Aqui criamos um módulo de teste do NestJS e registramos o UsersService e o mock do PrismaService.
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService, // Serviço que queremos testar
                {
                    provide: PrismaService, // Quando UsersService pedir PrismaService...
                    useValue: mockPrisma,   // ...vamos dar o mock no lugar do real.
                },
            ],
        }).compile(); // Compila o módulo de teste e o deixa pronto.

        // Pegamos a instância do UsersService gerada pelo módulo de teste
        service = module.get<UsersService>(UsersService);
    });

    // ==============================
    // Teste 1 — Criar um usuário
    // ==============================
    it("deve criar um usuário", async () => {
        // Criamos um objeto DTO (dados que seriam enviados na criação)
        const dto = { name: "Jonas", email: "jonas@example.com", password: "123" };

        // Configuramos o mock para, quando "prisma.user.create" for chamado,
        // ele retornar esse mesmo DTO (simulando que o usuário foi criado no banco)
        mockPrisma.user.create.mockResolvedValue(dto);

        // Chamamos o método do service com o DTO
        const result = await service.create(dto as any);

        // Verificamos se o retorno do método é exatamente o DTO esperado
        expect(result).toEqual(dto);

        // Verificamos se o mock foi chamado com os dados corretos
        expect(mockPrisma.user.create).toHaveBeenCalledWith({ data: dto });
    });

    // ==============================
    // Teste 2 — Listar todos os usuários
    // ==============================
    it("deve listar todos os usuarios", async () => {
        // dado que (exemplo do que o banco retornaria)
        const exemploUser = [{ id: "qweadsdgfsa", name: "valdiano", email: "valdiano@example.com", password: "hsafdhasvjvsajh1545", role: "TURISTA" }]

        mockPrisma.user.findMany.mockResolvedValue(exemploUser); // isso é o que eu to recebendo

        const result = await service.findAll() // isso é o que eu estou enviando 

        expect(result).toEqual(exemploUser); // tem que ser tal igual
    });

    // ==============================
    // Teste 3 — retornar um usuario expecifico pelo ID
    // ==============================
    it("deve retornar um usuario expecifico pelo ID", async () => {
        const entrada = "qweadsdgfsa" // isso é o que eu vou enviar como parâmetro
        const saida = { id: "qweadsdgfsa", name: "valdiano", email: "valdiano@example.com", password: "hsafdhasvjvsajh1545", role: "TURISTA" } // isso é o que eu espero receber

        mockPrisma.user.findUnique.mockResolvedValue(saida); // simulando retorno do banco

        const result = await service.findOne(entrada as any) // chamando o service com o ID

        expect(result).toEqual(saida) // verificando se o retorno é igual ao esperado

        expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: entrada } }); // verificando se o método foi chamado com o ID certo
    });

    // ==============================
    // Teste 4 — atualizar um usuario ja existente
    // ==============================
    it("deve atualizar um usuario ja existente", async () => {
        const entrada = { name: "valdiano", email: "valdiano@example.com", password: "hsafdhasvjvsajh1545", role: "TURISTA" } // dados para atualizar
        const id = "qweadsdgfsa" // id do usuário que vai ser atualizado
        const saida = { id: "qweadsdgfsa", name: "valdiano", email: "valdiano@example.com", password: "hsafdhasvjvsajh1545", role: "TURISTA" } // retorno esperado

        mockPrisma.user.update.mockResolvedValue(saida); // simulando atualização no banco

        const result = await service.update(id, entrada as any) // chamando o service com o id e os dados

        expect(result).toEqual(saida) // verificando se o retorno é igual ao esperado

        expect(mockPrisma.user.update).toHaveBeenCalledWith({ where: { id: id }, data: entrada }); // verificando se o update foi chamado com os parâmetros certos
    });

    // ==============================
    // Teste 5 — apagar um usuario
    // ==============================
    it("deve apagar um usuario", async () => {
        const entrada = "qweadsdgfsa" // id do usuário que quero deletar
        const saida = { id: "qweadsdgfsa", name: "valdiano", email: "valdiano@example.com", password: "hsafdhasvjvsajh1545", role: "TURISTA" } // retorno esperado

        mockPrisma.user.delete.mockResolvedValue(saida); // simulando deleção no banco

        const result = await service.remove(entrada as any) // chamando o service com o id

        expect(result).toEqual(saida) // verificando se o retorno é igual ao esperado

        expect(mockPrisma.user.delete).toHaveBeenCalledWith({ where: { id: entrada } }); // verificando se o delete foi chamado com o id certo
    });
});





// Executar os  testes: npm test