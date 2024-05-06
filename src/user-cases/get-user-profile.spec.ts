import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

// Testes unitarios nunca vão lidar com banco de dados, ou camadas externas da aplicação.
describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    // Instancia o repository em memoria
    usersRepository = new InMemoryUsersRepository()
    // Instancia o useCase que vai ser testado
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able to get user profile', async () => {
    // Cria usuario para o teste
    const createdUser = await usersRepository.create({
      name: 'John doe',
      email: 'johndow@example.com',
      password_hash: await hash('123456', 6),
    })

    // Instancia do login
    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    // Eu espero que o nome do usuario seja igual a John doe
    expect(user.name).toEqual('John doe')
  })

  it('should not be able to get user profile with wrong id', async () => {
    // Esperando que o erro seja uma instancia da nossa classe de erro para senha ou email incorreta.
    await expect(() =>
      sut.execute({
        userId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
