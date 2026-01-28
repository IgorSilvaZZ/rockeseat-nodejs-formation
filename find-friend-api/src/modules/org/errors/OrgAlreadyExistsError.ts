export class OrgAlreadyExists extends Error {
	constructor() {
		super("Organization already exists!");
	}
}
