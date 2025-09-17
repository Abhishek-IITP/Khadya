"use server";

import { createClient } from "@/auth/server";

export async function getOverviewData() {
  const supabase = await createClient();

  // Fetch all product stocks
  const { data: products, error } = await supabase
    .from("products")
    .select("stock");

  if (error || !products) {
    // console.error("Error fetching products:", error);
    return {
      views: { value: 0, growthRate: 0 },
      profit: { value: 0, growthRate: 0 },
      products: {
        total: 0,
        inStock: 0,
        outOfStock: 0,
        aboutToFinish: 0,
      },
      users: { value: 0, growthRate: 0 },
    };
  }

  const total = products.length;
  const inStock = products.filter((p) => Number(p.stock) > 0).length;
  const outOfStock = products.filter((p) => Number(p.stock) === 0).length;
  const aboutToFinish = products.filter((p) => Number(p.stock) < 100).length;

  return {
    products: {
      total,
      inStock,
      outOfStock,
      aboutToFinish,
    },
    users: {
      value: 3456,
      growthRate: -0.95,
    },
  };
}

export async function getTopChannels(page: number = 1, limit: number = 10) {
  const supabase = await createClient();

  // Calculate offset for pagination
  const offset = (page - 1) * limit;

  // Get total count first
  const { count: totalCount, error: countError } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  if (countError) {
    console.error("Error fetching products count:", countError);
    return { products: [], totalCount: 0, totalPages: 0, currentPage: page };
  }

  // Fetch paginated products with a_status = 'a'
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("a_status", "a")
    .order("updated_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching products:", error);
    return {
      products: [],
      totalCount: totalCount || 0,
      totalPages: Math.ceil((totalCount || 0) / limit),
      currentPage: page,
    };
  }

  const formattedProducts =
    products?.map((product) => {
      // ...existing code...
      let productImages = [];
      if (product.productimagesurl) {
        if (Array.isArray(product.productimagesurl)) {
          productImages = product.productimagesurl.filter(
            (url: any) => url && url.trim() !== "",
          );
        } else if (
          typeof product.productimagesurl === "string" &&
          product.productimagesurl.trim() !== ""
        ) {
          try {
            const parsed = JSON.parse(product.productimagesurl);
            productImages = Array.isArray(parsed)
              ? parsed.filter((url: any) => url && url.trim() !== "")
              : [product.productimagesurl];
          } catch {
            productImages = [product.productimagesurl];
          }
        }
      }
      if (productImages.length === 0) {
        productImages = ["https://placehold.co/600x400"];
      }
      let productVideo = product.productvideourl;
      if (!productVideo || productVideo.trim() === "") {
        productVideo =
          "https://videocdn.cdnpk.net/videos/48264b9c-b179-507e-be6d-3142ce612ef8/horizontal/previews/clear/large.mp4?token=exp=1749724842~hmac=8757286b8c7f1842c69fc47e9d8c0062bd6514d2a14b39683c8bacfb367ce45d";
      }
      return {
        id: product.id,
        title: product.title || "",
        sku: product.sku || "",
        size: product.size || "",
        productimagesurl: productImages,
        productvideourl: productVideo,
        stock: product.stock || "",
        sold: product.sold || 0,
        updated_at: product.updated_at,
        price: product.price || "",
        wholesaleprice: product.wholesaleprice || "",
        gst: product.gst || "",
        brand: product.brand || "",
        countryoforigin: product.countryoforigin || "",
        category: product.category || "",
        subcategory: product.subcategory || "",
        gender: product.gender || "",
        returnpol: product.returnpol || "",
        clothingtype: product.clothingtype || "",
        fit: product.fit || "",
        sleeve: product.sleeve || "",
        neck: product.neck || "",
        bottom: product.bottom || "",
        closure: product.closure || "",
        fabric: product.fabric || "",
        strech: product.strech || "",
        pattern: product.pattern || "",
        washcare: product.washcare || "",
        occasion: product.occasion || "",
        gsm: product.gsm || "",
        color: product.color || "",
        stylef: product.stylef || "",
        stitchf: product.stitchf || "",
        dupatta: product.dupatta || "",
        lining: product.lining || "",
        dimension: product.dimension || "",
        weight: product.weight || "",
        shipping: product.shipping || "",
        inv_location: product.inv_location || "",
        tags: product.tags || "",
        metatitle: product.metatitle || "",
        metades: product.metades || "",
        sellernotes: product.sellernotes || "",
        embellishments: product.embellishments || "",
        moq: product.moq || "",
        dispatch: product.dispatch || "",
        manufacturer: product.manufacturer || "",
        manufactureraddr: product.manufactureraddr || "",
        hsn: product.hsn || "",
      };
    }) || [];

  const totalPages = Math.ceil((totalCount || 0) / limit);

  return {
    products: formattedProducts,
    totalCount: totalCount || 0,
    totalPages,
    currentPage: page,
  };
}

export async function getProductById(productId: string) {
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single(); // fetch exactly one row

  if (error) {
    // console.error("Error fetching product by ID:", error);
    return null;
  }

  // Format product with fallbacks
  const formattedProduct = {
    id: product.id,
    title: product.title || "",
    sku: product.sku || "",
    size: product.size || "",
    productimagesurl: product.productimagesurl || [
      "https://placehold.co/600x400",
    ],
    productvideourl:
      product.productvideourl ||
      "https://videocdn.cdnpk.net/videos/48264b9c-b179-507e-be6d-3142ce612ef8/horizontal/previews/clear/large.mp4?token=exp=1749724842~hmac=8757286b8c7f1842c69fc47e9d8c0062bd6514d2a14b39683c8bacfb367ce45d",
    stock: product.stock || "",
    sold: product.sold || 0,
    price: product.price || "",
    gst: product.gst || "",
    brand: product.brand || "",
    countryoforigin: product.countryoforigin || "",
    category: product.category || "",
    subcategory: product.subcategory || "",
    gender: product.gender || "",
    returnpol: product.returnpol || "",
    clothingtype: product.clothingtype || "",
    fit: product.fit || "",
    sleeve: product.sleeve || "",
    neck: product.neck || "",
    bottom: product.bottom || "",
    closure: product.closure || "",
    fabric: product.fabric || "",
    strech: product.strech || "",
    pattern: product.pattern || "",
    washcare: product.washcare || "",
    occasion: product.occasion || "",
    gsm: product.gsm || "",
    color: product.color || "",
    stylef: product.stylef || "",
    stitchf: product.stitchf || "",
    dupatta: product.dupatta || "",
    lining: product.lining || "",
    dimension: product.dimension || "",
    weight: product.weight || "",
    shipping: product.shipping || "",
    inv_location: product.inv_location || "",
    tags: product.tags || "",
    metatitle: product.metatitle || "",
    metades: product.metades || "",
    sellernotes: product.sellernotes || "",
    embellishments: product.embellishments || "",
    moq: product.moq || "",
    dispatch: product.dispatch || "",
    manufacturer: product.manufacturer || "",
    manufactureraddr: product.manufactureraddr || "",
    hsn: product.hsn || "",
  };

  return formattedProduct;
}

export async function getChatsData() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return [
    {
      name: "Jacob Jones",
      profile: "/images/user/user-01.png",
      isActive: true,
      lastMessage: {
        content: "See you tomorrow at the meeting!",
        type: "text",
        timestamp: "2024-12-19T14:30:00Z",
        isRead: false,
      },
      unreadCount: 3,
    },
    {
      name: "Wilium Smith",
      profile: "/images/user/user-03.png",
      isActive: true,
      lastMessage: {
        content: "Thanks for the update",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
    {
      name: "Johurul Haque",
      profile: "/images/user/user-04.png",
      isActive: false,
      lastMessage: {
        content: "What's up?",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
    {
      name: "M. Chowdhury",
      profile: "/images/user/user-05.png",
      isActive: false,
      lastMessage: {
        content: "Where are you now?",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 2,
    },
    {
      name: "Akagami",
      profile: "/images/user/user-07.png",
      isActive: false,
      lastMessage: {
        content: "Hey, how are you?",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
  ];
}

import * as logos from "@/assets/logos";

export async function getTopProducts() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return [
    {
      image: "/images/product/product-01.png",
      name: "Apple Watch Series 7",
      category: "Electronics",
      price: 296,
      sold: 22,
      profit: 45,
    },
    {
      image: "/images/product/product-02.png",
      name: "Macbook Pro M1",
      category: "Electronics",
      price: 546,
      sold: 12,
      profit: 125,
    },
    {
      image: "/images/product/product-03.png",
      name: "Dell Inspiron 15",
      category: "Electronics",
      price: 443,
      sold: 64,
      profit: 247,
    },
    {
      image: "/images/product/product-04.png",
      name: "HP Probook 450",
      category: "Electronics",
      price: 499,
      sold: 72,
      profit: 103,
    },
  ];
}

export async function getInvoiceTableData() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1400));

  return [
    {
      name: "Free package",
      price: 0.0,
      date: "2023-01-13T18:00:00.000Z",
      status: "Paid",
    },
    {
      name: "Standard Package",
      price: 59.0,
      date: "2023-01-13T18:00:00.000Z",
      status: "Paid",
    },
    {
      name: "Business Package",
      price: 99.0,
      date: "2023-01-13T18:00:00.000Z",
      status: "Unpaid",
    },
    {
      name: "Standard Package",
      price: 59.0,
      date: "2023-01-13T18:00:00.000Z",
      status: "Pending",
    },
  ];
}

// ✅ Update Product
export async function updateProduct(productId: string, updatedData: any) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .update(updatedData)
    .eq("id", productId);

  if (error) {
    // console.error("Error updating product:", error);
    return { success: false, error };
  }

  return { success: true };
}

// ✅ Delete Product
export async function deleteProduct(productId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    // console.error("Error deleting product:", error);
    return { success: false, error };
  }

  return { success: true };
}
