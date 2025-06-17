import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "./RatingStars";
import { Review, formatDate } from "@/lib/api";
import { User, Calendar, Tag } from "lucide-react";

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No reviews yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Reviews ({reviews.length})</h3>

      {reviews.map((review) => {
        let tags: string[] = [];
        try {
          if (
            review.tags &&
            typeof review.tags === "string" &&
            review.tags.trim()
          ) {
            tags = JSON.parse(review.tags);
            if (!Array.isArray(tags)) {
              tags = [];
            }
          }
        } catch {
          tags = [];
        }

        return (
          <Card key={review.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{review.username}</span>
                    </div>
                    <RatingStars rating={review.rating} size="sm" />
                  </div>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(review.created_at)}</span>
                  </div>
                </div>

                {review.review_text && (
                  <p className="text-sm leading-relaxed">
                    {review.review_text}
                  </p>
                )}

                {review.image_url && (
                  <div className="mt-3">
                    <img
                      src={
                        review.image_url.startsWith("http")
                          ? review.image_url
                          : `${window.location.protocol}//${window.location.hostname}:3002${review.image_url}`
                      }
                      alt="Review image"
                      className="max-w-sm max-h-48 object-cover rounded-md border"
                      onError={(e) => {
                        console.log("Image failed to load:", review.image_url);
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}

                {tags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    {tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
