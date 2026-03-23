export interface User {
  _id: string;
  nameAr: string;
  nameEn: string;
  email: string;
  isAdmin: boolean;
  status: string;
  image: string;
  token?: string;
}

export interface BlogPost {
  _id: string;
  titleAr: string;
  titleEn: string;
  category: string;
  status: string;
  contentAr: string;
  contentEn: string;
  image: string;
  slug: string;
  authorName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Portfolio {
  _id: string;
  companyName: string;
  logo: string;
  image: string;
  desc: string;
  contractDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Offer {
  _id: string;
  offerName: string;
  image: string;
  desc: string;
  link: string;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  _id: string;
  clientName: string;
  logo: string;
  createdAt: string;
  updatedAt: string;
}

export interface Setting {
  _id: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  youtube: string;
  aboutUsAr: string;
  aboutUsEn: string;
  phoneNumber: string;
}

export interface MainCategory {
  _id: string;
  nameAr: string;
  nameEn: string;
  slug?: string;
}

export interface SubCategory {
  _id: string;
  fatherId: string;
  nameAr: string;
  nameEn: string;
  slug?: string;
}

export interface NestedCategory {
  _id: string;
  subCategoryId: string;
  nameAr: string;
  nameEn: string;
  slug?: string;
}

export interface Product {
  _id?: string;
  category: string;
  subCategory?: string;
  subSubCategory?: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  promoTitle: string;
  promoTitleAr?: string;
  promoTitleEn?: string;
  subTitle: string;
  subTitleAr?: string;
  subTitleEn?: string;
  brand: string;
  brandAr?: string;
  brandEn?: string;
  price: number;
  costPrice: number;
  discountPrice: number;
  weight: number;
  requiresShipping: boolean;
  sku: string;
  trackQuantity: boolean;
  maxQuantityPerCustomer: number;
  channels: string[];
  description: string;
  descriptionAr?: string;
  descriptionEn?: string;
  image?: string;
  imageUrl?: string;
  media?: string[];
  seoTitle: string;
  seoTitleAr?: string;
  seoTitleEn?: string;
  seoUrl: string;
  seoDescription: string;
  seoDescriptionAr?: string;
  seoDescriptionEn?: string;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
}

export interface FAQ {
  _id?: string;
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
  createdAt?: string;
  updatedAt?: string;
}
