import { hash } from "bcryptjs";

import { OrgAlreadyExistsError } from "../errors/OrgAlreadyExistsError";
import type { OrgsRepository } from "../repositories/orgs.repository";

export interface CreateOrgUseCaseRequest {
	name: string;
	email: string;
	cep: string;
	street: string;
	number: string;
	neighborhood: string;
	city: string;
	state: string;
	phone: string;
	password: string;
}

export class CreateOrgUseCase {
	constructor(private orgsRepository: OrgsRepository) {}

	async execute({
		name,
		email,
		cep,
		street,
		number,
		neighborhood,
		city,
		state,
		phone,
		password,
	}: CreateOrgUseCaseRequest) {
		const orgAlreadyExists = await this.orgsRepository.findByEmail(email);

		if (orgAlreadyExists) {
			throw new OrgAlreadyExistsError();
		}

		const passwordHash = await hash(password, 10);

		const org = await this.orgsRepository.create({
			name,
			email,
			phone,
			passwordHash,
			cep,
			street,
			number,
			neighborhood,
			city,
			state,
		});

		return {
			org,
		};
	}
}
