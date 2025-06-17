import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/RatingStars";
import { ReviewForm } from "@/components/ReviewForm";
import { ReviewList } from "@/components/ReviewList";
import { UserPrompt } from "@/components/UserPrompt";
import { ApiClient, Product, formatPrice } from "@/lib/api";
import { UserStorage } from "@/lib/userStorage";
import { toast } from "sonner";
import {
  ArrowLeft,
  BookOpen,
  Users,
  DollarSign,
  Star,
  AlertCircle,
} from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [user, setUser] = useState(UserStorage.getUser());
  const [showUserPrompt, setShowUserPrompt] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProduct(parseInt(id));
    }
  }, [id]);

  useEffect(() => {
    if (product && user) {
      checkCanReview();
    }
  }, [product, user]);

  const loadProduct = async (productId: number) => {
    try {
      setIsLoading(true);
      const data = await ApiClient.getProduct(productId);
      setProduct(data);
    } catch (error) {
      console.error("Error loading product:", error);
      toast.error("Failed to load product");
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const checkCanReview = async () => {
    if (!product || !user) return;

    try {
      const canUserReview = await ApiClient.canUserReview(
        product.id,
        user.username,
      );
      setCanReview(canUserReview);
    } catch (error) {
      console.error("Error checking review permission:", error);
    }
  };

  const handleReviewSubmitted = () => {
    if (product) {
      loadProduct(product.id);
      setCanReview(false);
    }
  };

  const handleUserSet = (username: string) => {
    setUser({ username, created_at: new Date().toISOString() });
    setShowUserPrompt(false);
    toast.success(`Welcome, ${username}!`);
  };

  const handleWriteReview = () => {
    if (!user) {
      setShowUserPrompt(true);
      return;
    }

    // Scroll to review form
    const reviewForm = document.getElementById("review-form");
    reviewForm?.scrollIntoView({ behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fitness-50 to-energy-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fitness-50 to-energy-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Book Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The book you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/")}>Back to Books</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fitness-50 to-energy-50">
      {/* Header */}
      <header className="gradient-bg text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-white hover:bg-white/20 mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Books
          </Button>
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Fitness Books Reviews</h1>
              <p className="text-green-100">Book Details & Reviews</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Info */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">
                        {product.title}
                      </h1>
                      <p className="text-lg text-muted-foreground">
                        by {product.author}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <RatingStars rating={product.average_rating} size="lg" />
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{product.review_count} reviews</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(product.price)}
                      </span>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>

                    <Badge variant="secondary">{product.category}</Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Reviews Section */}
            <div className="mt-8">
              {product.reviews && <ReviewList reviews={product.reviews} />}
            </div>
          </div>

          {/* Review Form Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Average Rating
                    </span>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span>{product.average_rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Reviews</span>
                    <span>{product.review_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span className="capitalize">{product.category}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Review Action */}
            {user && canReview && (
              <div id="review-form">
                <ReviewForm
                  productId={product.id}
                  onReviewSubmitted={handleReviewSubmitted}
                />
              </div>
            )}

            {user && !canReview && (
              <Card>
                <CardContent className="p-6 text-center">
                  <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    You have already reviewed this book.
                  </p>
                </CardContent>
              </Card>
            )}

            {!user && (
              <Card>
                <CardContent className="p-6 text-center space-y-4">
                  <Star className="h-8 w-8 mx-auto text-primary" />
                  <div>
                    <h3 className="font-semibold mb-2">Share Your Review</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Sign in to rate and review this book
                    </p>
                    <Button onClick={handleWriteReview} className="gradient-bg">
                      Write a Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* User Prompt Modal */}
      <UserPrompt
        isOpen={showUserPrompt}
        onUserSet={handleUserSet}
        onClose={() => setShowUserPrompt(false)}
      />
    </div>
  );
}
