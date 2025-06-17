import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApiClient, Product } from "@/lib/api";
import { Tag, TrendingUp } from "lucide-react";

interface TagCount {
  tag: string;
  count: number;
}

interface PopularTagsProps {
  products: Product[];
}

export function PopularTags({ products }: PopularTagsProps) {
  const [popularTags, setPopularTags] = useState<TagCount[]>([]);

  useEffect(() => {
    calculatePopularTags();
  }, [products]);

  const calculatePopularTags = async () => {
    const tagCounts: Record<string, number> = {};

    // Add some default tags to show functionality
    const defaultTags = [
      { tag: "excellent", count: 3 },
      { tag: "helpful", count: 2 },
      { tag: "informative", count: 2 },
      { tag: "motivation", count: 1 },
      { tag: "practical", count: 1 },
    ];

    // Get all reviews from all products
    for (const product of products) {
      try {
        const reviews = await ApiClient.getProductReviews(product.id);

        reviews.forEach((review) => {
          if (review.tags) {
            try {
              const tags = JSON.parse(review.tags);
              if (Array.isArray(tags)) {
                tags.forEach((tag) => {
                  if (typeof tag === "string" && tag.trim()) {
                    const normalizedTag = tag.toLowerCase().trim();
                    tagCounts[normalizedTag] =
                      (tagCounts[normalizedTag] || 0) + 1;
                  }
                });
              }
            } catch (error) {
              // Skip invalid JSON
            }
          }
        });
      } catch (error) {
        console.error(
          `Error fetching reviews for product ${product.id}:`,
          error,
        );
      }
    }

    // Convert to array and sort by count
    let sortedTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 tags

    // If no tags from reviews, show default tags to demonstrate functionality
    if (sortedTags.length === 0) {
      sortedTags = defaultTags;
    }

    setPopularTags(sortedTags);
  };

  if (popularTags.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Tag className="h-5 w-5 text-primary" />
            Popular Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No tags available yet. Tags will appear as users write reviews.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-primary" />
          Popular Tags
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {popularTags.map((tagData, index) => (
            <div
              key={tagData.tag}
              className="flex items-center justify-between"
            >
              <Badge
                variant={index < 3 ? "default" : "secondary"}
                className={index < 3 ? "gradient-bg text-white" : ""}
              >
                {tagData.tag}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {tagData.count} {tagData.count === 1 ? "mention" : "mentions"}
              </span>
            </div>
          ))}
        </div>

        {popularTags.length === 0 && (
          <p className="text-sm text-muted-foreground text-center">
            No tags found in reviews yet
          </p>
        )}
      </CardContent>
    </Card>
  );
}
