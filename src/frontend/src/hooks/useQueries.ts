import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ExternalBlob } from "../backend";
import type { Inquiry, Product, UserProfile } from "../backend.d";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useGetAllActiveProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["activeProducts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllActiveProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProductsByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["productsByCategory", category],
    queryFn: async () => {
      if (!actor) return [];
      if (category === "All") return actor.getAllActiveProducts();
      return actor.getProductsByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProductById(productId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Product | null>({
    queryKey: ["product", productId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProductById(productId);
    },
    enabled: !!actor && !isFetching && !!productId,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useGetAllInquiries() {
  const { actor, isFetching } = useActor();
  return useQuery<Inquiry[]>({
    queryKey: ["inquiries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllInquiries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSubmitInquiry() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      name,
      email,
      productId,
      message,
    }: {
      name: string;
      email: string;
      productId: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.submitInquiry(name, email, productId, message);
    },
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: string;
      name: string;
      description: string;
      price: bigint;
      category: string;
      imageBlob: ExternalBlob;
      stock: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.addProduct(
        data.id,
        data.name,
        data.description,
        data.price,
        data.category,
        data.imageBlob,
        data.stock,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["activeProducts"] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: string;
      name: string;
      description: string;
      price: bigint;
      category: string;
      imageBlob: ExternalBlob;
      stock: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updateProduct(
        data.id,
        data.name,
        data.description,
        data.price,
        data.category,
        data.imageBlob,
        data.stock,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["activeProducts"] });
    },
  });
}

export function useToggleProductActive() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      await actor.toggleProductActive(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["activeProducts"] });
    },
  });
}
