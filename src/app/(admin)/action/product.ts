"use server"
import { createClient } from "@/auth/server";
import { showErrorToast, showSuccessToast } from "../lib/toast-utils";



// Add a new product
export const addProduct = async (productData: any) => {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
// console.log("HELLO");
  if (userError || !user) {
    // console.log("USER AUTH ERROR");
    return { success: false, error: "User not authenticated." };
  }






    const bucketName = "product-assets"; // Your bucket name

  // ----------- Upload Product Video (optional) -----------
  let productVideoURL = "";
  if (productData.productvideourl && productData.productvideourl instanceof File) {
    // Validate video file
    if (!productData.productvideourl.type.startsWith('video/')) {
      return { success: false, error: "Invalid video file type. Only video files are allowed." };
    }
    
    if (productData.productvideourl.size > 50 * 1024 * 1024) { // 50MB limit
      return { success: false, error: "Video file too large. Maximum size is 50MB." };
    }

    const videoPath = `videos/${user.id}/${Date.now()}_${productData.productvideourl.name}`;
    const { data, error: videoError } = await supabase.storage
      .from(bucketName)
      .upload(videoPath, productData.productvideourl, {
        cacheControl: "3600",
        upsert: false,
      });

    if (videoError) {
      console.error("VIDEO UPLOAD ERROR", videoError);
      return { success: false, error: `Video upload failed: ${videoError.message}` };
    }

    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(videoPath);
    productVideoURL = urlData.publicUrl;
  }

  // ----------- Upload Product Images (required) -----------
  let productImagesURLs: string[] = [];
  if (productData.productimagesurl && productData.productimagesurl.length > 0) {
    // Validate that all items are actual File objects
    const validFiles = productData.productimagesurl.filter((file: any) => file instanceof File);
    
    if (validFiles.length === 0) {
      return { success: false, error: "Please upload valid image files." };
    }

    for (const file of validFiles) {
      // Additional file validation
      if (!file.type.startsWith('image/')) {
        return { success: false, error: `Invalid file type: ${file.name}. Only image files are allowed.` };
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        return { success: false, error: `File too large: ${file.name}. Maximum size is 5MB.` };
      }

      const imagePath = `images/${user.id}/${Date.now()}_${file.name}`;
      const { data, error: imageError } = await supabase.storage
        .from(bucketName)
        .upload(imagePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (imageError) {
        console.error("IMAGE UPLOAD ERROR", imageError);
        return { success: false, error: `Failed to upload image: ${file.name}. ${imageError.message}` };
      }

      const { data: imgUrl } = supabase.storage
        .from(bucketName)
        .getPublicUrl(imagePath);

      productImagesURLs.push(imgUrl.publicUrl);
    }
  } else {
    return { success: false, error: "At least one product image is required." };
  }



// console.log(productData);
const { productvideo, productimages, ...productDataClean } = productData;
  const { error } = await supabase.from("products").insert([
    {
      ...productDataClean,
      userid: user.id,
      productvideourl: productVideoURL || null,
      productimagesurl: productImagesURLs, // array of URLs
    },
  ]);

  if (error) {
    // console.log("PRODUCT ERROR");
    // console.log(error);
    return { success: false, error };
  }

  // console.log("Product Added Succesfully");
  return { success: true };
};













// lib/uploadBulkProducts.ts
export const uploadBulkProducts = async (excelData: any[]) => {
  const supabase = await createClient();

  if (!excelData || excelData.length === 0) {
    return { success: false, message: 'No data to upload.' };
  }

  const requiredFields = [
    'title', 'gender', 'category', 'countryoforigin', 'gst', 'returnpol',
    'subcategory', 'sku', 'brand', 'manufacturer', 'manufactureraddr', 'hsn',
    'price', 'wholesaleprice', 'moq', 'dispatch', 'stock', 'clothingtype',
    'fit', 'sleeve', 'neck', 'bottom', 'closure', 'fabric', 'strech',
    'pattern', 'washcare', 'occasion', 'gsm', 'size', 'color', 'stylef',
    'stitchf', 'dupatta', 'lining', 'dimension', 'weight', 'shipping',
    'inv_location', 'tags', 'metatitle', 'metades', 'sellernotes', 'embellishments',
    'productvideourl', 'productimagesurl'
  ];

  for (let i = 0; i < excelData.length; i++) {
    const row = excelData[i];
    const missing = requiredFields.filter(field => !(field in row));
    if (missing.length > 0) {
      return {
        success: false,
        message: `Row ${i + 1} is missing fields: ${missing.join(', ')}`
      };
    }
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, message: 'User not authenticated.' };
  }



  const safeParseArray = (val: any) => {
  if (!val || val === '') return [];
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // fallback for comma-separated string like "a,b,c"
    return typeof val === 'string' ? val.split(',').map((s) => s.trim()) : [];
  }
};



const productsWithUser = excelData.map((product: any) => {
  const parsedImages = safeParseArray(product.productimagesurl);
  const finalImages = parsedImages.length > 0
    ? parsedImages
    : ["https://upvirspisuwlvyybjmko.supabase.co/storage/v1/object/public/product-assets//default-product-image.png"];

  return {
    ...product,
    userid: user.id,
    tags: safeParseArray(product.tags),
    productimagesurl: finalImages,
  };
});




  const { error } = await supabase.from('products').insert(productsWithUser);

  if (error) {
    // console.log(error);
    return { success: false, message: 'Failed to upload products.' };
  }

  return { success: true, message: 'Products uploaded successfully!' };
};



export const editProduct = async (productId: string, productData: any) => {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    // console.log("USER AUTH ERROR");
    return { success: false, error: "User not authenticated." };
  }

  const bucketName = "product-assets";

  // ----------- Handle Video (Upload only if it's a File) -----------
  let productVideoURL = productData.productvideourl || "";
  if (productData.productvideourl instanceof File) {
    const videoPath = `videos/${user.id}/${Date.now()}_${productData.productvideourl.name}`;
    const { data, error: videoError } = await supabase.storage
      .from(bucketName)
      .upload(videoPath, productData.productvideourl, {
        cacheControl: "3600",
        upsert: false,
      });

    if (videoError) {
      // console.log("VIDEO UPLOAD ERROR", videoError);
      return { success: false, error: "Video upload failed." };
    }

const { publicUrl } = supabase.storage
  .from(bucketName)
  .getPublicUrl(videoPath).data;
productVideoURL = publicUrl;
  }

  // ----------- Handle Images (Upload new ones, keep existing) -----------
  let productImagesURLs: string[] = [];

  // Separate new files and existing URLs
  const existingImages = productData.productimagesurl?.filter((img: any) =>
    typeof img === "string"
  );
  const newImageFiles = productData.productimagesurl?.filter((img: any) =>
    img instanceof File
  );

  // Keep existing image URLs
  if (existingImages && existingImages.length > 0) {
    productImagesURLs.push(...existingImages);
  }

  // Upload only new image files
  if (newImageFiles && newImageFiles.length > 0) {
    for (const file of newImageFiles) {
      const imagePath = `images/${user.id}/${Date.now()}_${file.name}`;
      const { data, error: imageError } = await supabase.storage
        .from(bucketName)
        .upload(imagePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (imageError) {
        // console.log("IMAGE UPLOAD ERROR", imageError);
        return { success: false, error: "Image upload failed." };
      }

      const { data: imgUrl } = supabase.storage
        .from(bucketName)
        .getPublicUrl(imagePath);
      productImagesURLs.push(imgUrl.publicUrl);
    }
  }

  // Ensure at least one image is present
  if (productImagesURLs.length === 0) {
    return { success: false, error: "At least one product image is required." };
  }

  // Clean final data
  const {
    productvideo,
    productimages,
    ...productDataClean
  } = productData;

  // ----------- Perform Update -----------
  const { error } = await supabase
    .from("products")
    .update({
      ...productDataClean,
      userid: user.id,
      productvideourl: productVideoURL || null,
      productimagesurl: productImagesURLs,
    })
    .eq("id", productId);

  if (error) {
    // console.log("PRODUCT UPDATE ERROR", error);
    return { success: false, error };
  }

  // console.log("Product Updated Successfully");
  return { success: true };
};





// Update an existing product
export const updateProduct = async (productId: number, updateData: any) => {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "User not authenticated." };
  }

  const { error } = await supabase
    .from("products")
    .update(updateData)
    .eq("id", productId)
    .eq("userid", user.id); // RLS enforced here

  if (error) {
    return { success: false, error };
  }

  return { success: true };
};

// Delete a product
export const deleteProduct = async (productId: number) => {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "User not authenticated." };
  }

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId)
    .eq("userid", user.id); // Ensure only user's own product is deleted

  if (error) {
    return { success: false, error };
  }

  return { success: true };
};

// Fetch all products for the current user
export const fetchUserProducts = async () => {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "User not authenticated.", products: [] };
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("userid", user.id);

  if (error) {
    return { success: false, error, products: [] };
  }

  return { success: true, products: data };
};
