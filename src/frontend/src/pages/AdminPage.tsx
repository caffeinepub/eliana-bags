import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Edit,
  Loader2,
  LogOut,
  MessageSquare,
  Package,
  Plus,
  ShoppingCart,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import ProductFormModal from "../components/admin/ProductFormModal";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetAllActiveProducts,
  useGetAllInquiries,
  useIsCallerAdmin,
  useToggleProductActive,
} from "../hooks/useQueries";

const KPI_KEYS = ["total", "active", "inquiries", "categories"] as const;

export default function AdminPage() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: products } = useGetAllActiveProducts();
  const { data: inquiries } = useGetAllInquiries();
  const toggleActive = useToggleProductActive();

  const [searchQuery, setSearchQuery] = useState("");
  const [formModal, setFormModal] = useState<{
    open: boolean;
    product?: Product;
  }>({
    open: false,
  });

  // After login, initialize access control so the first caller becomes admin
  useEffect(() => {
    if (!identity || !actor) return;
    actor
      ._initializeAccessControlWithSecret("")
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
      })
      .catch(() => {
        // Ignore errors — already initialized
        queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
      });
  }, [identity, actor, queryClient]);

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        if (error.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleActive.mutateAsync(id);
      toast.success("Product status updated.");
    } catch {
      toast.error("Failed to update product.");
    }
  };

  const filteredProducts = (products || []).filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const activeCount = (products || []).filter((p) => p.isActive).length;

  const kpiData = [
    {
      key: KPI_KEYS[0],
      label: "Total Products",
      value: products?.length ?? 0,
      icon: Package,
      color: "text-blue-600",
    },
    {
      key: KPI_KEYS[1],
      label: "Active Products",
      value: activeCount,
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      key: KPI_KEYS[2],
      label: "Inquiries",
      value: inquiries?.length ?? 0,
      icon: MessageSquare,
      color: "text-amber-600",
    },
    {
      key: KPI_KEYS[3],
      label: "Categories",
      value: new Set((products || []).map((p) => p.category)).size,
      icon: ShoppingCart,
      color: "text-purple-600",
    },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <p className="font-serif text-3xl mb-2">Eliana Bags</p>
          <p className="text-muted-foreground text-sm mb-8">Admin Portal</p>
          <div className="bg-card rounded-lg border border-border p-8 space-y-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto">
              <ShoppingCart className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="font-serif text-xl">Sign In</h1>
            <p className="text-sm text-muted-foreground">
              Log in with Internet Identity to access the admin dashboard.
            </p>
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm uppercase tracking-wider text-xs h-11"
              onClick={handleAuth}
              disabled={loginStatus === "logging-in"}
              data-ocid="admin.primary_button"
            >
              {loginStatus === "logging-in" ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Logging
                  in...
                </>
              ) : (
                "Login with Internet Identity"
              )}
            </Button>
            <Link
              to="/"
              className="block text-xs text-muted-foreground hover:underline mt-2"
              data-ocid="nav.link"
            >
              ← Back to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="font-serif text-2xl">Access Denied</p>
        <p className="text-muted-foreground text-sm">
          You do not have admin permissions.
        </p>
        <Button
          variant="outline"
          onClick={handleAuth}
          data-ocid="admin.secondary_button"
        >
          <LogOut className="h-4 w-4 mr-2" /> Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(var(--admin-bg))" }}
    >
      {/* Admin Header */}
      <header className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-primary-foreground/70 hover:text-primary-foreground text-sm"
            data-ocid="nav.link"
          >
            ← Store
          </Link>
          <p className="font-serif text-lg tracking-wide">Admin Dashboard</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAuth}
          className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 rounded-sm text-xs uppercase tracking-wide"
          data-ocid="admin.secondary_button"
        >
          <LogOut className="h-3.5 w-3.5 mr-1.5" /> Sign Out
        </Button>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {kpiData.map((kpi, i) => (
            <div
              key={kpi.key}
              className="bg-white rounded-lg border border-border p-5 flex items-center gap-4"
              data-ocid={`admin.card.${i + 1}`}
            >
              <div className="p-2.5 rounded-lg bg-secondary">
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {kpi.value}
                </p>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products">
          <TabsList className="mb-6 bg-secondary">
            <TabsTrigger
              value="products"
              className="text-xs uppercase tracking-wide"
              data-ocid="admin.tab"
            >
              Products
            </TabsTrigger>
            <TabsTrigger
              value="inquiries"
              className="text-xs uppercase tracking-wide"
              data-ocid="admin.tab"
            >
              Inquiries
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" data-ocid="admin.panel">
            <div className="bg-white rounded-lg border border-border">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-border">
                <h2 className="font-semibold text-sm uppercase tracking-wide">
                  Product Management
                </h2>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 text-sm w-full sm:w-48"
                    data-ocid="admin.search_input"
                  />
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm text-xs uppercase tracking-wide h-8 shrink-0"
                    onClick={() => setFormModal({ open: true })}
                    data-ocid="admin.open_modal_button"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" /> Add New
                  </Button>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="p-12 text-center" data-ocid="admin.empty_state">
                  <Package className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No products yet. Add your first product.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table data-ocid="admin.table">
                    <TableHeader>
                      <TableRow className="bg-secondary/50">
                        <TableHead className="text-xs uppercase tracking-wide">
                          Product
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-wide">
                          Category
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-wide">
                          Price
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-wide">
                          Stock
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-wide">
                          Status
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-wide text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product, i) => (
                        <TableRow
                          key={product.id}
                          className="hover:bg-secondary/30"
                          data-ocid={`admin.row.${i + 1}`}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-md bg-secondary overflow-hidden shrink-0">
                                {product.imageId && (
                                  <img
                                    src={product.imageId.getDirectURL()}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-sm">
                                  {product.name}
                                </p>
                                <p className="text-xs text-muted-foreground truncate max-w-[140px]">
                                  {product.description}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {product.category}
                          </TableCell>
                          <TableCell className="text-sm font-medium">
                            ${(Number(product.price) / 100).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-sm">
                            {Number(product.stock)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`text-xs ${
                                product.isActive
                                  ? "bg-green-100 text-green-700 border-green-200"
                                  : "bg-secondary text-muted-foreground"
                              }`}
                              variant="outline"
                            >
                              {product.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => handleToggle(product.id)}
                                className="p-1.5 hover:bg-secondary rounded-sm transition-colors"
                                title={
                                  product.isActive ? "Deactivate" : "Activate"
                                }
                                data-ocid={`admin.toggle.${i + 1}`}
                              >
                                {product.isActive ? (
                                  <ToggleRight className="h-4 w-4 text-green-600" />
                                ) : (
                                  <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setFormModal({ open: true, product })
                                }
                                className="p-1.5 hover:bg-secondary rounded-sm transition-colors"
                                data-ocid={`admin.edit_button.${i + 1}`}
                              >
                                <Edit className="h-4 w-4 text-muted-foreground" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Inquiries Tab */}
          <TabsContent value="inquiries" data-ocid="admin.panel">
            <div className="bg-white rounded-lg border border-border">
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold text-sm uppercase tracking-wide">
                  Customer Inquiries
                </h2>
              </div>
              {!inquiries || inquiries.length === 0 ? (
                <div className="p-12 text-center" data-ocid="admin.empty_state">
                  <MessageSquare className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No inquiries yet.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table data-ocid="admin.table">
                    <TableHeader>
                      <TableRow className="bg-secondary/50">
                        <TableHead className="text-xs uppercase tracking-wide">
                          Customer
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-wide">
                          Product
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-wide">
                          Message
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-wide">
                          Date
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inquiries.map((inq, i) => (
                        <TableRow
                          key={`${inq.email}-${String(inq.timestamp)}`}
                          className="hover:bg-secondary/30"
                          data-ocid={`admin.row.${i + 1}`}
                        >
                          <TableCell>
                            <p className="font-medium text-sm">{inq.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {inq.email}
                            </p>
                          </TableCell>
                          <TableCell className="text-sm">
                            {inq.productId}
                          </TableCell>
                          <TableCell className="text-sm max-w-xs">
                            <p className="truncate">{inq.message}</p>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {new Date(
                              Number(inq.timestamp) / 1_000_000,
                            ).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Form Modal */}
      <ProductFormModal
        open={formModal.open}
        product={formModal.product}
        onClose={() => setFormModal({ open: false })}
      />
    </div>
  );
}
