import {PrismaClient} from "@prisma/client";
import {CategoryFields} from "../types/declarations";

const prisma = new PrismaClient();

const publicCategoryFields: CategoryFields = {
  id: true,
  name: true,
}

export const findCategories = () => {
  return prisma.category.findMany({
    where: {
      deletedAt: null
    },
    select: publicCategoryFields,
    orderBy: [{
      name: 'asc'
    }]
  });
}
