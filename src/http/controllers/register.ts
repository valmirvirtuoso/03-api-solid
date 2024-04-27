import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { registerUseCase } from '@/user-cases/register'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  // parse vs safeParse -> se houver um erro o parse para a aplicação
  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    // Chama o use-case de registro do usuario
    await registerUseCase({
      name,
      email,
      password,
    })
  } catch (error) {
    return reply.status(409).send()
  }

  return reply.status(201).send()
}
