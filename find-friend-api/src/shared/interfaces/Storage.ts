/* Melhoria colocar em um bucket S3 */
export interface Storage {
	getUrl(filename: string): string;
	save(buffer: Buffer, filename: string): Promise<string>;
	delete(filename: string): Promise<void>;
}
