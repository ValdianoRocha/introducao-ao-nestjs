
import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "../users.controller";
import { UsersService } from "../users.service";


const mockUserService = {
    // create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
}

describe("UserController", () => {
    let testUserController: UsersController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: mockUserService,
                },
            ],
        }).compile()

        testUserController = module.get<UsersController>(UsersController)
    })


    it("deve listar todos os usuario!", async () => {
        const users = [
            { name: 'valdiano', email: "valdiano@gmail.com" },
            { name: 'steh', email: "steh@gmail.com" }
        ]

        mockUserService.findAll.mockResolvedValue(users)

        const result = await testUserController.findAll()

        expect(result).toEqual(users)
    })


    it("deve trazer um unico usuario!", async () => {
        const users = { id: "acb123", name: 'valdiano', email: "valdiano@gmail.com" }

        mockUserService.findOne.mockResolvedValue(users)

        const result = await testUserController.findOne(users.id)

        expect(result).toEqual(users)
        expect(mockUserService.findOne).toHaveBeenCalledWith(users.id)
    })


    it("deve atualizar um usuario!", async () => {
        const users = { id: "acb123", name: 'valdiano', email: "valdiano@gmail.com" }
        const data = { name: 'valdiano', email: "valdian@gmail.com" }

        mockUserService.update.mockResolvedValue(users)

        const result = await testUserController.updateUser(users.id, data)

        expect(result).toEqual(users)
        expect(mockUserService.update).toHaveBeenCalledWith(users.id, data)
    })


    it("deve apagar um usuario!", async () => {
        const users = { id: "acb123", name: 'valdiano', email: "valdiano@gmail.com" }

        mockUserService.remove.mockResolvedValue(users)

        const result = await testUserController.remove(users.id)

        expect(result).toEqual(users)
        expect(mockUserService.remove).toHaveBeenCalledWith(users.id)
    })
})


