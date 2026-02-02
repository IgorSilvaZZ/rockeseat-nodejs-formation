import type { Org } from "@prisma/client";
import { compare } from "bcryptjs";
import { InvalidCredentialsError } from "../errors/InvalidCredentialsError";
import type { OrgsRepository } from "../repositories/orgs.repository";

export interface AuthenticateUseCaseRequest {
	email: string;
	password: string;
}

export interface AuthenticateUseCaseResponse {
	org: Org;
}

export class AuthenticateUseCase {
	constructor(private orgsRepository: OrgsRepository) {}

	async execute({
		email,
		password,
	}: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
		const org = await this.orgsRepository.findByEmail(email);

		if (!org) {
			throw new InvalidCredentialsError();
		}

		const doesPasswordMatches = await compare(password, org.passwordHash);

		if (!doesPasswordMatches) {
			throw new InvalidCredentialsError();
		}

		return {
			org,
		};
	}
}
