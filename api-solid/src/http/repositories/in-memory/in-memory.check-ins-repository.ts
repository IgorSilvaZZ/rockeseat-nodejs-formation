import { CheckIn, Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { randomUUID } from "node:crypto";

import { CheckInsRepository } from "../check-ins-repository";

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public checkIns: CheckIn[] = [];

  async findById(id: string): Promise<CheckIn | null> {
    const checkIn = this.checkIns.find((item) => item.id === id);

    if (!checkIn) {
      return null;
    }

    return checkIn;
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date
  ): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf("date"); // Começo do dia
    const endOfTheDay = dayjs(date).endOf("date"); // Fim do dia

    const checkOnSameDate = this.checkIns.find((item) => {
      const checkInDate = dayjs(item.createdAt);

      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);

      return item.userId === userId && isOnSameDate;
    });

    if (!checkOnSameDate) {
      return null;
    }

    return checkOnSameDate;
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      gymId: data.gymId,
      userId: data.userId,
      validatedAt: data.validatedAt ? new Date(data.validatedAt) : null,
      createdAt: new Date(),
    };

    this.checkIns.push(checkIn);

    return checkIn;
  }
}
