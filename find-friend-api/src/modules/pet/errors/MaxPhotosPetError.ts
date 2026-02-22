export class MaxPhotosPetError extends Error {
	constructor() {
		super("Maximum number of photos exceeded!");
	}
}
