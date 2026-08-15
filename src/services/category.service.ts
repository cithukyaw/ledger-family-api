import {prisma} from "../lib/prisma.js";
import {CategoryFields} from "../types/declarations.js";


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
