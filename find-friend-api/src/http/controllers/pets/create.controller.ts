import { AmbiencePet, Levels, PetAge, TypePet } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import z, { transform } from "zod";
import { makeCreatePetUseCase } from "@/modules/pet/factories/make-create-pet-useCase.factory";

export async function create(req: FastifyRequest, rep: FastifyReply) {
	// Extrair os campos de texto e arquivos
	const parts = req.parts();

	// O Fastify Multipart processa os campos de texto e arquivos de forma assíncrona, então precisamos iterar sobre eles para separá-los. Os campos de texto serão armazenados em um objeto `fields`, enquanto os arquivos serão armazenados em um array `photos`.
	const fields: Record<string, any> = {};
	const photos: Array<{ filename: string; buffer: Buffer }> = [];

	for await (const part of parts) {
		if (part.type === "file") {
			const buffer = await part.toBuffer();

			photos.push({
				buffer,
				filename: part.filename,
			});
		} else {
			fields[part.fieldname] = part.value;
		}
	}

	const createPetSchema = z.object({
		name: z.string().min(1).max(250),
		about: z.string(),
		type: z.enum(TypePet),
		age: z.enum(PetAge),
		size: z.enum(Levels),
		energyLevel: z.coerce.number().int().min(1).max(5),
		independencyLevel: z.enum(Levels),
		ambience: z.enum(AmbiencePet),
		requirements: z.string().transform((str) => JSON.parse(str)),
		orgId: z.string(),
	});

	const petData = createPetSchema.parse(fields);

	const createPetUseCase = makeCreatePetUseCase();

	await createPetUseCase.execute({
		...petData,
		photos,
	});

	return rep.status(201).send();
}
