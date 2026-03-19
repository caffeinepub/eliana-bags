import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Inquiry {
    name: string;
    productId: string;
    email: string;
    message: string;
    timestamp: bigint;
}
export interface UserProfile {
    name: string;
}
export interface Product {
    id: string;
    name: string;
    createdAt: bigint;
    description: string;
    isActive: boolean;
    stock: bigint;
    category: string;
    imageId?: ExternalBlob;
    price: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    _initializeAccessControlWithSecret(secret: string): Promise<void>;
    addProduct(id: string, name: string, description: string, price: bigint, category: string, imageId: ExternalBlob, stock: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllActiveProducts(): Promise<Array<Product>>;
    getAllInquiries(): Promise<Array<Inquiry>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProductById(productId: string): Promise<Product | null>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitInquiry(name: string, email: string, productId: string, message: string): Promise<void>;
    toggleProductActive(id: string): Promise<void>;
    updateProduct(id: string, name: string, description: string, price: bigint, category: string, imageId: ExternalBlob, stock: bigint): Promise<void>;
}
