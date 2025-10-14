import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

import { InMemoryCheckInsRepository } from "../repositories/in-memory/in-memory.check-ins-repository";

import { CheckInUseCase } from "./check-in.useCase";

describe("CheckIn Use Case", () => {
  let checkInsRepositoryInMemory: InMemoryCheckInsRepository;
  let checkInUseCase: CheckInUseCase;

  beforeEach(() => {
    checkInsRepositoryInMemory = new InMemoryCheckInsRepository();

    checkInUseCase = new CheckInUseCase(checkInsRepositoryInMemory);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("Should be able to create check-in", async () => {
    const { checkIn } = await checkInUseCase.execute({
      gymId: "gym-id-01",
      userId: "user-id-01",
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("Should not be able to check-in twice in the same day", async () => {
    vi.setSystemTime(new Date(2025, 0, 2, 17, 45, 0));

    await checkInUseCase.execute({
      gymId: "gym-id-01",
      userId: "user-id-01",
    });

    await expect(() => {
      return checkInUseCase.execute({
        gymId: "gym-id-01",
        userId: "user-id-01",
      });
    }).rejects.toBeInstanceOf(Error);
  });

  it("Should able to check-in twice but in different days", async () => {
    vi.setSystemTime(new Date(2025, 0, 2, 17, 45, 0));

    await checkInUseCase.execute({
      gymId: "gym-id-01",
      userId: "user-id-01",
    });

    vi.setSystemTime(new Date(2025, 0, 2, 18, 45, 0));

    const { checkIn } = await checkInUseCase.execute({
      gymId: "gym-id-01",
      userId: "user-id-01",
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
