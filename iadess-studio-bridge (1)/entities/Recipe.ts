
export interface RecipeRequirement {
  itemId: string;
  quantity: number;
}

export interface Recipe {
  id: string;
  name: string;
  outputCategory: string;
  difficulty: number; // 1..10
  requirements: RecipeRequirement[];
}
