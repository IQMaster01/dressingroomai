
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS: only admins can read user_roles
CREATE POLICY "Admins can view roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Products table for gallery
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  affiliate_link TEXT NOT NULL DEFAULT '#',
  click_count INTEGER NOT NULL DEFAULT 0,
  tryon_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public read for products
CREATE POLICY "Anyone can view products"
ON public.products FOR SELECT USING (true);

-- Only admins can insert/update/delete products
CREATE POLICY "Admins can insert products"
ON public.products FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products"
ON public.products FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products"
ON public.products FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial products from mock data
INSERT INTO public.products (name, description, image_url, affiliate_link, click_count, tryon_count) VALUES
('Classic Black Blazer', 'Tailored slim-fit blazer in premium wool blend.', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop', '#', 234, 89),
('White Silk Blouse', 'Elegant silk blouse with a relaxed fit.', 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=400&h=500&fit=crop', '#', 178, 56),
('Tailored Chinos', 'Modern-fit cotton chinos in khaki.', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop', '#', 312, 145),
('Cashmere Sweater', 'Luxurious cashmere crew neck in navy.', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop', '#', 156, 67),
('Denim Jacket', 'Classic denim trucker jacket in mid-wash.', 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=500&fit=crop', '#', 203, 91),
('Linen Summer Dress', 'Breezy linen midi dress in soft cream.', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop', '#', 287, 110);
