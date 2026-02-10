import { vi } from "vitest";
import type { Storage } from "@/shared/interfaces/Storage";

export class StorageFake implements Storage {
	save = vi.fn<(buffer: Buffer, filename: string) => Promise<string>>();

	delete = vi.fn<(filename: string) => Promise<void>>();

	getUrl = vi.fn<(filename: string) => string>();
}
