export interface ClothingItem {
  id: string;
  name: string;
  description: string;
  image_url: string;
  affiliate_link: string;
  click_count: number;
  tryon_count: number;
}

export const mockClothing: ClothingItem[] = [
  {
    id: "1",
    name: "Classic Black Blazer",
    description: "Tailored slim-fit blazer in premium wool blend.",
    image_url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop",
    affiliate_link: "#",
    click_count: 234,
    tryon_count: 89,
  },
  {
    id: "2",
    name: "White Silk Blouse",
    description: "Elegant silk blouse with a relaxed fit.",
    image_url: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=400&h=500&fit=crop",
    affiliate_link: "#",
    click_count: 178,
    tryon_count: 56,
  },
  {
    id: "3",
    name: "Tailored Chinos",
    description: "Modern-fit cotton chinos in khaki.",
    image_url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop",
    affiliate_link: "#",
    click_count: 312,
    tryon_count: 145,
  },
  {
    id: "4",
    name: "Cashmere Sweater",
    description: "Luxurious cashmere crew neck in navy.",
    image_url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop",
    affiliate_link: "#",
    click_count: 156,
    tryon_count: 67,
  },
  {
    id: "5",
    name: "Denim Jacket",
    description: "Classic denim trucker jacket in mid-wash.",
    image_url: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=500&fit=crop",
    affiliate_link: "#",
    click_count: 203,
    tryon_count: 91,
  },
  {
    id: "6",
    name: "Linen Summer Dress",
    description: "Breezy linen midi dress in soft cream.",
    image_url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop",
    affiliate_link: "#",
    click_count: 287,
    tryon_count: 110,
  },
];
