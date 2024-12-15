import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ProductsHeaderContent = () => {
  const { data: content, isLoading } = useQuery({
    queryKey: ['header-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_blocks')
        .select('content')
        .eq('placement', 'products_header')
        .single();

      if (error) {
        console.error('Error fetching header content:', error);
        return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
      }

      return data?.content;
    },
  });

  if (isLoading) {
    return <div className="h-4 w-full animate-pulse bg-gray-200 rounded"></div>;
  }

  return (
    <div className="prose prose-gray max-w-none mb-6">
      <p className="text-gray-600">{content}</p>
    </div>
  );
};

export default ProductsHeaderContent;