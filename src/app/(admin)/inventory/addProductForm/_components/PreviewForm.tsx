
import { addProduct, editProduct } from "@/app/(admin)/action/product";
import { showErrorToast, showSuccessToast, showWarningToast } from "@/app/(admin)/lib/toast-utils";
import { useRouter, useSearchParams } from "next/navigation";

export default function PreviewForm({ product, mode,  onClose }: { product: any, mode: boolean, onClose: () => void; }) {
 const searchParams = useSearchParams();
  const productId = searchParams.get("id");
const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

showWarningToast("Uploading Details....")
    const result = await addProduct(product);
    if(!result.success){
      showErrorToast("Error Occured " +result.error);
    }else{
      showSuccessToast("Details Uploaded Succesfully!");
             router.push("/inventory"); // ✅ redirect after add
    }
    // console.log(result);

  };




  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

if (!productId) {
  showErrorToast("Product ID is missing for editing.");
  return;
}

showWarningToast("Saving Edited Details....")
const { sold,id,  ...cleanedProduct } = product;

    const result = await editProduct(productId,cleanedProduct);
    if(!result.success){
      showErrorToast("Error Occured " +result.error);
    }else{
      showSuccessToast("Details Uploaded Succesfully!");
        router.push("/inventory"); // ✅ redirect after add
    }
    // console.log(result);

  };


const excludeKeys = ['sold', 'productimages', 'productvideo', 'id', 'userid'];

  return (
    <div className="fixed inset-0 pt-30 pl-50  backdrop-blur-sm z-100 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-4xl w-full max-h-[70vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-6 text-center text-dark dark:text-white">
       {mode ? "Verify your edited details" : "Submitted Product Details"}  
        </h2>

        <form onSubmit={mode ? handleEditSubmit : handleSubmit}>
          <div className="grid grid-cols-2 gap-4 text-sm text-dark dark:text-gray-300">
{Object.entries(product)
 .filter(([key]) => !excludeKeys.includes(key))
  .map(([key, value]) => (

              <div key={key} className="border rounded p-3 bg-gray-50 dark:bg-gray-800">
                <p className="font-semibold text-gray-600 dark:text-gray-400 mb-1 capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </p>
                   <p className="text-black dark:text-white break-words">
      {Array.isArray(value)
        ? value.map((item) => {
            if (typeof item === "object" && "name" in item) {
              return item.name;
            }
            return String(item);
          }).join(", ")
        : typeof value === "object" && value !== null && "name" in value
        ? (value as { name: string }).name
        : String(value || '—')}
    </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded"
              onClick={onClose} // You can trigger a "close" function instead
          
            >
              Edit Again
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"

            >
              {"Confirm & Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
