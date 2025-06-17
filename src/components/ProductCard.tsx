import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RatingStars } from "./RatingStars";
import { Product, formatPrice } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { BookOpen, Users } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Card className="group card-hover overflow-hidden">
      <div className="relative">
        <img
          src={product.image_url}
          alt={product.title}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/90 text-black">
            {formatPrice(product.price)}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>by {product.author}</span>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-3">
            {product.description}
          </p>

          <div className="flex items-center justify-between pt-2">
            <RatingStars rating={product.average_rating} size="sm" />

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{product.review_count}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleViewDetails}
          className="w-full gradient-bg hover:opacity-90"
        >
          View Details & Reviews
        </Button>
      </CardFooter>
    </Card>
  );
}
