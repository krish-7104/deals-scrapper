const isClothingProduct = (product: string) => {
  const clothingKeywords = [
    "shirt",
    "t-shirt",
    "blouse",
    "top",
    "dress",
    "skirt",
    "pants",
    "trousers",
    "jeans",
    "shorts",
    "jacket",
    "coat",
    "sweater",
    "hoodie",
    "sweatshirt",
    "suit",
    "tie",
    "scarf",
    "hat",
    "cap",
    "gloves",
    "socks",
    "shoes",
    "boots",
    "sandals",
    "heels",
    "flats",
    "sneakers",
    "trainers",
    "flip flops",
    "swimsuit",
  ];
  return clothingKeywords.some((keyword) =>
    product.toLowerCase().includes(keyword)
  );
};

export default isClothingProduct;
