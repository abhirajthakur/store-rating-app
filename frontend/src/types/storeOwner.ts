export type StoreOwnerStore = {
  id: string;
  name: string;
  address: string;
};

export type StoreRater = {
  userId: string;
  name: string;
  email: string;
  rating: number;
  ratedAt: string;
};

export type StoreOwnerDashboard = {
  store: StoreOwnerStore;
  averageRating: number;
  raters: StoreRater[];
};
