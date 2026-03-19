import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import CartDrawer from "./components/CartDrawer";
import SiteFooter from "./components/SiteFooter";
import StorefrontHeader from "./components/StorefrontHeader";
import { CartProvider } from "./context/CartContext";
import AdminPage from "./pages/AdminPage";
import StorefrontPage from "./pages/StorefrontPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
});

// Root layout
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Storefront layout route
const storefrontLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "storefront-layout",
  component: () => (
    <>
      <StorefrontHeader />
      <Outlet />
      <SiteFooter />
      <CartDrawer />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => storefrontLayout,
  path: "/",
  component: StorefrontPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  storefrontLayout.addChildren([indexRoute]),
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <RouterProvider router={router} />
        <Toaster richColors />
      </CartProvider>
    </QueryClientProvider>
  );
}
