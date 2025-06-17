const API_BASE_URL = "/api";

export interface Product {
  id: number;
  title: string;
  author: string;
  description: string;
  image_url: string;
  price: number;
  category: string;
  average_rating: number;
  review_count: number;
  created_at: string;
  reviews?: Review[];
}

export interface Review {
  id: number;
  product_id: number;
  username: string;
  rating: number;
  review_text?: string;
  image_url?: string;
  tags?: string;
  created_at: string;
}

export interface CreateReviewData {
  product_id: number;
  username: string;
  rating: number;
  review_text?: string;
  image?: File;
}

export class ApiClient {
  static async getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return response.json();
  }

  static async getProduct(id: number): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }
    return response.json();
  }

  static async createReview(data: CreateReviewData): Promise<Review> {
    const formData = new FormData();
    formData.append("product_id", data.product_id.toString());
    formData.append("username", data.username);
    formData.append("rating", data.rating.toString());
    if (data.review_text) {
      formData.append("review_text", data.review_text);
    }
    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = "Failed to create review";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // If response is not JSON, use status message
        errorMessage = `Server error: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    try {
      return await response.json();
    } catch (error) {
      console.error("Failed to parse response as JSON:", error);
      throw new Error("Invalid response from server");
    }
  }

  static async canUserReview(
    productId: number,
    username: string,
  ): Promise<boolean> {
    const response = await fetch(
      `${API_BASE_URL}/reviews/can-review/${productId}/${username}`,
    );
    if (!response.ok) {
      throw new Error("Failed to check review permission");
    }
    const result = await response.json();
    return result.canReview;
  }

  static async getProductReviews(productId: number): Promise<Review[]> {
    const response = await fetch(
      `${API_BASE_URL}/reviews/product/${productId}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch reviews");
    }
    return response.json();
  }
}

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};
