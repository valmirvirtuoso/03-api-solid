import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredencialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

// Testes unitarios nunca vão lidar com banco de dados, ou camadas externas da aplicação.
describe('Autehnticate Use Case', () => {
  beforeEach(() => {
    // Instancia o repository em memoria
    usersRepository = new InMemoryUsersRepository()
    // Instancia o useCase que vai ser testado
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    // Cria usuario para o teste
    await usersRepository.create({
      name: 'John doe',
      email: 'johndow@example.com',
      password_hash: await hash('123456', 6),
    })

    // Instancia do login
    const { user } = await sut.execute({
      email: 'johndow@example.com',
      password: '123456',
    })

    // Eu espero que o id do usuario criado seja qualquer string
    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    // Cria usuario para o teste
    await usersRepository.create({
      name: 'John doe',
      email: 'johndow@example.com',
      password_hash: await hash('123456', 6),
    })

    // Esperando que o erro seja uma instancia da nossa classe de erro para senha ou email incorreta.
    await expect(() =>
      sut.execute({
        email: 'johndo2@example.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredencialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    // Esperando que o erro seja uma instancia da nossa classe de erro para senha ou email incorreta.
    await expect(() =>
      sut.execute({
        email: 'johndo2@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredencialsError)
  })
})
