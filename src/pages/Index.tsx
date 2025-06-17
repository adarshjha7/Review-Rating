import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { UserPrompt } from "@/components/UserPrompt";
import { PopularTags } from "@/components/PopularTags";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ApiClient, Product } from "@/lib/api";
import { UserStorage } from "@/lib/userStorage";
import { toast } from "sonner";
import { Search, BookOpen, Users, LogOut } from "lucide-react";

export default function Index() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(UserStorage.getUser());
  const [showUserPrompt, setShowUserPrompt] = useState(!user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await ApiClient.getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const filterProducts = () => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = products.filter(
      (product) =>
        product.title.toLowerCase().includes(query) ||
        product.author.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query),
    );
    setFilteredProducts(filtered);
  };

  const handleUserSet = (username: string) => {
    setUser({ username, created_at: new Date().toISOString() });
    setShowUserPrompt(false);
    toast.success(`Welcome, ${username}!`);
  };

  const handleLogout = () => {
    UserStorage.clearUser();
    setUser(null);
    setShowUserPrompt(true);
  };

  const totalReviews = products.reduce(
    (sum, product) => sum + product.review_count,
    0,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-fitness-50 to-energy-50">
      {/* Header */}
      <header className="gradient-bg text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Fitness Books Reviews</h1>
                <p className="text-green-100">
                  Discover the best fitness books and share your insights
                </p>
              </div>
            </div>

            {user && (
              <div className="flex items-center gap-4">
                <span className="text-green-100">
                  Welcome, {user.username}!
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-black border-white hover:bg-white/20"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards and Popular Tags */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 mx-auto text-primary mb-2" />
              <h3 className="text-2xl font-bold">{products.length}</h3>
              <p className="text-muted-foreground">Fitness Books,<br/>  Total number of books currently available in the application</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 mx-auto text-primary mb-2" />
              <h3 className="text-2xl font-bold">{totalReviews}</h3>
              <p className="text-muted-foreground">Reviews, <br/> Total number of reviews submitted so far</p>
            </CardContent>
          </Card>

          <PopularTags products={products} />
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search books by title, author, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <CardContent className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No books found</h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? "Try adjusting your search terms"
                : "No books available"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
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
