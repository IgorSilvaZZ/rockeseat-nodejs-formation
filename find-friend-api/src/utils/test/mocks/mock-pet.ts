import { faker } from "@faker-js/faker";
import { AmbiencePet, Levels, PetAge, TypePet } from "@prisma/client";
import type { CreatePetUseCaseRequest } from "@/modules/pet/useCases/create-pet.useCase";

type Override = Partial<CreatePetUseCaseRequest>;

export const makePetMock = (override: Override = {}) => ({
	name: override.name ?? faker.animal.petName(),
	type: override.type ?? TypePet.CAT,
	about: override.about ?? "",
	age: override.age ?? PetAge.ADULT,
	size: override.size ?? Levels.MEDIUM,
	energyLevel: override.energyLevel ?? faker.number.int({ min: 0, max: 5 }),
	independencyLevel: override.independencyLevel ?? Levels.MEDIUM,
	ambience: override.ambience ?? AmbiencePet.MEDIUM,
	photos: override.photos ?? [],
	orgId: override.orgId,
	requirements: override.requirements ?? [],
});
