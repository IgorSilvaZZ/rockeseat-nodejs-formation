import { faker } from "@faker-js/faker";

import type { CreateOrgUseCaseRequest } from "@/modules/org/useCases/create-org.useCase";

type Override = Partial<CreateOrgUseCaseRequest>;

export const makeOrgMock = (override: Override = {}) => ({
	name: override.name ?? faker.person.firstName(),
	email: override.email ?? faker.internet.email(),
	phone: override.phone ?? faker.phone.number(),
	password: override.password ?? faker.internet.password(),
	address: {
		cep: override.address?.cep ?? faker.location.zipCode(),
		street: override.address?.street ?? faker.location.street(),
		number: override.address?.number ?? faker.location.buildingNumber(),
		neighborhood: override.address?.neighborhood ?? "",
		city: override.address?.city ?? faker.location.city(),
		state: override.address?.state ?? faker.location.state(),
	},
});
