import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../../backend";
import type { Product } from "../../backend.d";
import { CATEGORIES } from "../../data/sampleProducts";
import { useAddProduct, useUpdateProduct } from "../../hooks/useQueries";

interface Props {
  open: boolean;
  product?: Product;
  onClose: () => void;
}

const DEFAULT_FORM = {
  name: "",
  description: "",
  price: "",
  category: "Tote",
  stock: "",
};

export default function ProductFormModal({ open, product, onClose }: Props) {
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const isEditing = !!product;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState(DEFAULT_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description,
        price: (Number(product.price) / 100).toString(),
        category: product.category,
        stock: Number(product.stock).toString(),
      });
      if (product.imageId) {
        setImagePreview(product.imageId.getDirectURL());
      }
    } else {
      setForm(DEFAULT_FORM);
      setImagePreview(null);
      setImageFile(null);
    }
  }, [product]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      let imageBlob: ExternalBlob;

      if (imageFile) {
        const bytes = new Uint8Array(await imageFile.arrayBuffer());
        imageBlob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
          setUploadProgress(pct);
        });
      } else if (product?.imageId) {
        // Re-wrap using the runtime ExternalBlob class
        imageBlob = ExternalBlob.fromURL(product.imageId.getDirectURL());
      } else {
        imageBlob = ExternalBlob.fromBytes(new Uint8Array([]));
      }

      const data = {
        id: product?.id ?? crypto.randomUUID(),
        name: form.name,
        description: form.description,
        price: BigInt(Math.round(Number.parseFloat(form.price) * 100)),
        category: form.category,
        imageBlob,
        stock: BigInt(Number.parseInt(form.stock)),
      };

      if (isEditing) {
        await updateProduct.mutateAsync(data);
        toast.success("Product updated successfully.");
      } else {
        await addProduct.mutateAsync(data);
        toast.success("Product added successfully.");
      }
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save product. Please try again.");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg" data-ocid="admin.dialog">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            {isEditing ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Image Upload */}
          <div>
            <Label className="text-xs uppercase tracking-wide mb-2 block">
              Product Image
            </Label>
            <label
              htmlFor="product-img-upload"
              className="relative border-2 border-dashed border-border rounded-lg h-36 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-secondary transition-colors"
              data-ocid="admin.dropzone"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload className="h-6 w-6" />
                  <span className="text-xs">Click to upload image</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                id="product-img-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                data-ocid="admin.upload_button"
              />
            </label>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <p className="text-xs text-muted-foreground mt-1">
                Uploading: {uploadProgress}%
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label className="text-xs uppercase tracking-wide mb-1 block">
                Product Name *
              </Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="e.g. Venetian Tote"
                className="h-9 text-sm"
                data-ocid="admin.input"
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wide mb-1 block">
                Price (USD) *
              </Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) =>
                  setForm((p) => ({ ...p, price: e.target.value }))
                }
                placeholder="289.00"
                className="h-9 text-sm"
                data-ocid="admin.input"
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wide mb-1 block">
                Stock *
              </Label>
              <Input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) =>
                  setForm((p) => ({ ...p, stock: e.target.value }))
                }
                placeholder="10"
                className="h-9 text-sm"
                data-ocid="admin.input"
              />
            </div>
            <div className="col-span-2">
              <Label className="text-xs uppercase tracking-wide mb-1 block">
                Category
              </Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}
              >
                <SelectTrigger className="h-9 text-sm" data-ocid="admin.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label className="text-xs uppercase tracking-wide mb-1 block">
                Description
              </Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Describe this bag..."
                rows={3}
                className="text-sm"
                data-ocid="admin.textarea"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-sm text-xs uppercase tracking-wide h-10"
              onClick={onClose}
              data-ocid="admin.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm text-xs uppercase tracking-wide h-10"
              disabled={isSubmitting}
              data-ocid="admin.submit_button"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />{" "}
                  Saving...
                </>
              ) : isEditing ? (
                "Update Product"
              ) : (
                "Add Product"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
