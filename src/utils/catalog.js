/* Shared catalog helpers — mirrors the web store's common.js / index logic
 * (wazobia-shop.netlify.app) so pricing, sizes, filters, and cart items are
 * identical across web and mobile. */

// Filter options (match web store exactly)
export const CATEGORIES = ['All', 'Men', 'Women', 'Accessories'];

export const SIZE_OPTIONS = [
  { value: '', label: 'All Sizes' },
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
  { value: 'XXL', label: 'XXL' },
];

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured / Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

// Prices in the database are USD. Same as web: "$" + n.toFixed(2)
export const formatPrice = (n) => '$' + (Number(n) || 0).toFixed(2);

// DB stores sizes as "S, M, L, XL" (or occasionally a JSON array string)
export const normalizeSizes = (s) => {
  if (Array.isArray(s)) return s.map(String);
  if (typeof s === 'string') {
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {}
    return s.split(',').map((x) => x.trim()).filter(Boolean);
  }
  return [];
};

// Default size selection rule used by the web store
export const defaultSizeFor = (sizes) =>
  sizes.includes('M') ? 'M' : sizes[0] || 'One Size';

export const normalizeProduct = (p) => {
  const sizes = normalizeSizes(p.sizes);
  return {
    ...p,
    name: p.name || '',
    category: p.category || '',
    description: p.description || '',
    image_url: p.image_url || null,
    price: Number(p.price) || 0,
    sizes: sizes.length ? sizes : ['One Size'],
  };
};

// Cart items use the web store shape: { id, name, price, image_url, size, quantity }
export const normalizeCartItem = (i) => ({
  id: i.id,
  name: i.name ?? i.title ?? '',
  price: Number(i.price) || 0,
  image_url: i.image_url ?? i.image ?? null,
  size: i.size ?? i.selectedSize ?? '',
  quantity: Number(i.quantity) || 1,
});

export const filterAndSortProducts = (
  products,
  { category = 'All', size = '', sortBy = 'featured', query = '' } = {}
) => {
  const q = query.trim().toLowerCase();
  const list = products.filter((p) => {
    const catOk = category === 'All' || p.category === category;
    const sizeOk = !size || p.sizes.includes(size);
    const queryOk =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);
    return catOk && sizeOk && queryOk;
  });
  if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
  else if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
  return list;
};

// Same name resolution as the web store greeting
export const getUserProfile = (user) => {
  const m = user?.user_metadata || {};
  const fullName = m.full_name || m.name || user?.email || '';
  const firstName = fullName.trim().split(' ')[0] || 'Friend';
  const avatarUrl = m.avatar_url || m.picture || null;
  return { fullName, firstName, avatarUrl, email: user?.email || '' };
};
