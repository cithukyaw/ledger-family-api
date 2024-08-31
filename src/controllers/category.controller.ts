import {Request, Response} from "express";
import {findCategories} from "../services/category.service";
import {CategoriesResponse} from "../types/declarations";

class CategoryController {
  /**
   * Return all categories
   */
  public static async getCategories(req: Request, res: Response<CategoriesResponse>) {
    const categories = await findCategories();

    return res.status(200).json(categories);
  }
}

export default CategoryController
