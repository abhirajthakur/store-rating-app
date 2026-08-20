export type UserStore = {
  id: string;
  name: string;
  address: string;
  overallRating: number;
  userRating: number | null;
};

export type GetStoresParams = {
  name?: string;
  address?: string;
  sortBy?: "name" | "address" | "rating";
  sortOrder?: "asc" | "desc";
};

export type GetStoresResponse = {
  stores: UserStore[];
};

export type SubmitRatingInput = {
  rating: number;
};

export type Rating = {
  id: string;
  userId: string;
  storeId: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
};

export type SubmitRatingResponse = {
  rating: Rating;
};
