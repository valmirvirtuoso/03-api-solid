import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

let usersRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

// Testes unitarios nunca vão lidar com banco de dados, ou camadas externas da aplicação.
describe('Create Gym Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(usersRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'JavaScript-Gym',
      description: null,
      latitude: -22.8684495,
      longitude: -43.2618207,
      phone: null,
    })

    // Eu espero que o id do usuario criado seja qualquer string
    expect(gym.id).toEqual(expect.any(String))
  })
})
