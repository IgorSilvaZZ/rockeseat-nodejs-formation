import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import type { Storage } from "./interfaces/Storage";

export class LocalStorage implements Storage {
	public pathUploads = path.resolve(__dirname, "..", "..", "tmp", "uploads");

	getUrl(filename: string): string {
		return `/tmp/uploads/${filename}`;
	}

	async save(buffer: Buffer, filename: string): Promise<string> {
		// Cria o diretorio de uploads caso ele nao existir]
		await fs.mkdir(this.pathUploads, { recursive: true });

		// Gerando nomes unicos
		const ext = path.extname(filename);
		const uniqueFileName = `${randomUUID()}${ext}`;

		// Salvando arquivo
		await fs.writeFile(path.join(this.pathUploads, uniqueFileName), buffer);

		return uniqueFileName;
	}

	async delete(filename: string): Promise<void> {
		const filePath = path.join(this.pathUploads, filename);

		const fileExists = await fs
			.access(filePath, fs.constants.F_OK)
			.then(() => true)
			.catch(() => false);

		if (!fileExists) {
			console.log("Arquivo informado não encontrado!");

			return;
		}

		try {
			await fs.unlink(filePath);

			console.log("Arquivo deletado com sucesso!");
		} catch (error) {
			console.log("Ocorreu algum erro ao deletar arquivo!");

			console.log(error);

			return;
		}
	}
}
