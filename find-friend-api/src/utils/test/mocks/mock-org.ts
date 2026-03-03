import { faker } from "@faker-js/faker";

import type { CreateOrgUseCaseRequest } from "@/modules/org/useCases/create-org.useCase";

/* Caso eu queira sobrescrever propriedades de um tipo existente, preciso sempre remover a propriedade antes utilizando Omit. */
type Override = Partial<Omit<CreateOrgUseCaseRequest, "address">> & {
	address?: Partial<CreateOrgUseCaseRequest["address"]>;
};

export const makeOrgMock = (override: Override = {}) => ({
	name: override.name ?? faker.person.firstName(),
	email: override.email ?? faker.internet.email(),
	phone: override.phone ?? faker.phone.number(),
	password: override.password ?? faker.internet.password(),
	passwordHash: override.password ?? faker.internet.password(),
	cep: override.address?.cep ?? faker.location.zipCode(),
	street: override.address?.street ?? faker.location.street(),
	number: override.address?.number ?? faker.location.buildingNumber(),
	neighborhood: override.address?.neighborhood ?? "",
	city: override.address?.city ?? faker.location.city(),
	state: override.address?.state ?? faker.location.state(),
});
