export interface OrgsRepository {
	findByEmail(email: string): Promise<any>;
	create(data: any): Promise<any>;
}
