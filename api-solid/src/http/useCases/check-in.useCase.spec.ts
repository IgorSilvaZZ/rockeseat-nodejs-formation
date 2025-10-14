import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

import { InMemoryCheckInsRepository } from "../repositories/in-memory/in-memory.check-ins-repository";
import { InMemoryGymsRepository } from "../repositories/in-memory/in-memory-gym-repository";

import { CheckInUseCase } from "./check-in.useCase";
import { Decimal } from "@prisma/client/runtime/library";

describe("CheckIn Use Case", () => {
  let gymsRepositoryInMemory: InMemoryGymsRepository;
  let checkInsRepositoryInMemory: InMemoryCheckInsRepository;

  let checkInUseCase: CheckInUseCase;

  beforeEach(() => {
    gymsRepositoryInMemory = new InMemoryGymsRepository();
    checkInsRepositoryInMemory = new InMemoryCheckInsRepository();

    checkInUseCase = new CheckInUseCase(
      checkInsRepositoryInMemory,
      gymsRepositoryInMemory
    );

    gymsRepositoryInMemory.allGym.push({
      id: "gym-id-01",
      title: "Test Gym",
      description: "Test Gym Description",
      latitude: new Decimal(0),
      longitude: new Decimal(0),
      phone: "",
      createdAt: new Date(),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("Should be able to create check-in", async () => {
    const { checkIn } = await checkInUseCase.execute({
      gymId: "gym-id-01",
      userId: "user-id-01",
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("Should not be able to check-in twice in the same day", async () => {
    vi.setSystemTime(new Date(2025, 0, 2, 17, 45, 0));

    await checkInUseCase.execute({
      gymId: "gym-id-01",
      userId: "user-id-01",
      userLatitude: 0,
      userLongitude: 0,
    });

    await expect(() => {
      return checkInUseCase.execute({
        gymId: "gym-id-01",
        userId: "user-id-01",
        userLatitude: 0,
        userLongitude: 0,
      });
    }).rejects.toBeInstanceOf(Error);
  });

  it("Should able to check-in twice but in different days", async () => {
    vi.setSystemTime(new Date(2025, 0, 2, 17, 45, 0));

    await checkInUseCase.execute({
      gymId: "gym-id-01",
      userId: "user-id-01",
      userLatitude: 0,
      userLongitude: 0,
    });

    vi.setSystemTime(new Date(2025, 0, 3, 17, 45, 0));

    const { checkIn } = await checkInUseCase.execute({
      gymId: "gym-id-01",
      userId: "user-id-01",
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
