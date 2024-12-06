import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/utils/types";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/NavBar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Plus, Pencil, Trash2 } from "lucide-react";

const Products = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([
    {
      reference: "TBL-001",
      description: "Table à manger extensible en chêne",
      initialQuantity: 20,
      availableQuantity: 0,
      imageUrl: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=500"
    },
    {
      reference: "TBL-002",
      description: "Table basse design scandinave",
      initialQuantity: 15,
      availableQuantity: 0,
      imageUrl: "https://images.unsplash.com/photo-1533090368676-1fd25485db88?w=500"
    },
    {
      reference: "CHR-001",
      description: "Chaise en velours bleu",
      initialQuantity: 40,
      availableQuantity: 0,
      imageUrl: "https://images.unsplash.com/photo-1503602642458-232111445657?w=500"
    },
    {
      reference: "CHR-002",
      description: "Chaise de salle à manger moderne",
      initialQuantity: 30,
      availableQuantity: 0,
      imageUrl: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500"
    },
    {
      reference: "TBL-003",
      description: "Table de cuisine en marbre",
      initialQuantity: 10,
      availableQuantity: 0,
      imageUrl: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=500"
    },
    {
      reference: "CHR-003",
      description: "Lot de 6 chaises en bois massif",
      initialQuantity: 25,
      availableQuantity: 0,
      imageUrl: "https://images.unsplash.com/photo-1503602642458-232111445657?w=500"
    }
  ]);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<Product>({
    defaultValues: {
      reference: "",
      description: "",
      initialQuantity: 0,
      availableQuantity: 0,
      imageUrl: ""
    }
  });

  const handleQuantityChange = (reference: string, newQuantity: string) => {
    const quantity = parseInt(newQuantity);
    if (isNaN(quantity) || quantity < 0) return;

    setProducts(products.map(product => {
      if (product.reference === reference) {
        return {
          ...product,
          availableQuantity: quantity
        };
      }
      return product;
    }));
  };

  const handleSave = () => {
    toast({
      title: "Quantités sauvegardées",
      description: "Les quantités ont été sauvegardées avec succès.",
    });
  };

  const handleAddProduct = (data: Product) => {
    setProducts([...products, data]);
    setIsDialogOpen(false);
    form.reset();
    toast({
      title: "Produit ajouté",
      description: "Le produit a été ajouté avec succès.",
    });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    form.reset(product);
    setIsDialogOpen(true);
  };

  const handleUpdateProduct = (data: Product) => {
    setProducts(products.map(p => 
      p.reference === editingProduct?.reference ? data : p
    ));
    setIsDialogOpen(false);
    setEditingProduct(null);
    form.reset();
    toast({
      title: "Produit mis à jour",
      description: "Le produit a été mis à jour avec succès.",
    });
  };

  const handleDeleteProduct = (reference: string) => {
    setProducts(products.filter(p => p.reference !== reference));
    toast({
      title: "Produit supprimé",
      description: "Le produit a été supprimé avec succès.",
    });
  };

  const storeName = "Mon Magasin";

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gestion des Produits</h1>
          <div className="text-lg font-medium text-muted-foreground">
            Magasin : {storeName}
          </div>
        </div>

        <div className="mb-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter un produit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? "Modifier le produit" : "Ajouter un produit"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(editingProduct ? handleUpdateProduct : handleAddProduct)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="reference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Référence</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="initialQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantité initiale</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL de l'image</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    {editingProduct ? "Mettre à jour" : "Ajouter"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.reference}>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{product.description}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditProduct(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteProduct(product.reference)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <img 
                  src={product.imageUrl || "/placeholder.svg"} 
                  alt={product.description}
                  className="w-full h-48 object-cover mb-4 rounded-md"
                />
                <p>Référence: {product.reference}</p>
                <div className="flex items-center gap-2 mt-2">
                  <p>Quantité souhaitée:</p>
                  <Input
                    type="number"
                    value={product.availableQuantity}
                    onChange={(e) => handleQuantityChange(product.reference, e.target.value)}
                    min="0"
                    className="w-24"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} className="px-6">
            Sauvegarder les quantités
          </Button>
        </div>
      </div>
    </>
  );
};

export default Products;