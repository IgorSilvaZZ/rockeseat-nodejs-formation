import { Gym } from "@prisma/client";

import { GymsRepository } from "../gyms.repository";

export class InMemoryGymsRepository implements GymsRepository {
  public allGym: Gym[] = [];

  async findById(id: string): Promise<Gym | null> {
    const gym = this.allGym.find((item) => item.id === id);

    if (!gym) {
      return null;
    }

    return gym;
  }
}
