export interface Category {
  categoryId: string;
  categoryName: string;
  categoryStatus: string;
}

export interface Ingredient {
  warehouseId: string;
  ingredientName: string;
  quantityUsed: number;
  unit: string;
}

export interface RecipeDto {
  warehouseId: string;
  ingredientName: string;
  ingredientId: string;
  quantityUsed: number;
  unit: string;
  recipeId: string;
  } 

export interface Option {
  optionId: string;
  optionName: string;
  additionalPrice: number;
  optionSelectionId: string;
}

export interface OptionGroup {
  optionGroupId: string;
  
  optionGroupName: string;
  options: Option[];
}

export interface OptionSelection {
  optionId: string;
  optionSelectionId: string;
  optionName: string;
  additionalPrice: number;
}

export interface DishImage {
  imageId: string;
  imageUrl: string;
  originFileObj: File;
}

export interface Dish {
  dishId: string;
  dishName: string;
  description: string;
  longDescription: string;
  status: string;
  thumbImage: {
    file: {
      uid: string;
    };
    fileList: Array<{
      uid: string;
      lastModified: number;
      lastModifiedDate: string;
      name: string;
      size: number;
      type: string;
      percent: number;
      originFileObj: File;
      thumbUrl: string;
    }>;
  };
  offerPrice: number;
  price: number;
  categoryId: string;
  categoryName: string;
  images: Array<{
    imageId?: string;
    imageUrl?: string;
    originFileObj?: File;
  }>;
  recipes: RecipeDto[];
  Options: Option[];
  optionSelections: OptionSelection[];
  listOptions: OptionGroup[];
}

export interface Options {
  optionId: string;
  additionalPrice: number;
}