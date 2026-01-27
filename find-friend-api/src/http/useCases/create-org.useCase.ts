import { hash } from "bcryptjs";

import { OrgAlreadyExists } from "../errors/OrgAlreadyExistsError";
import type { OrgsRepository } from "../respositories/orgs.repository";

interface Address {
	cep: string;
	street: string;
	number: string;
	neighborhood: string;
	city: string;
	state: string;
	latitude: number;
	longitude: number;
}

interface CreateOrgUseCaseRequest {
	name: string;
	email: string;
	address: Address;
	phone: string;
	password: string;
}

export class CreateOrgUseCase {
	constructor(private orgsRepository: OrgsRepository) {}

	async execute({
		name,
		email,
		address,
		phone,
		password,
	}: CreateOrgUseCaseRequest) {
		const orgAlreadyExists = await this.orgsRepository.findByEmail(email);

		if (orgAlreadyExists) {
			throw new OrgAlreadyExists();
		}

		const passwordHash = await hash(password, 10);

		const org = await this.orgsRepository.create({
			name,
			email,
			address,
			phone,
			passwordHash,
		});

		return {
			org,
		};
	}
}
