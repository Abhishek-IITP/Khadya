'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { showErrorToast, showSuccessToast } from '../../lib/toast-utils';
import { uploadBulkProducts } from '../../action/product';

export default function ViewDataPage() {
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);






    const router = useRouter();


    
  useEffect(() => {
    const stored = localStorage.getItem('excelData');
    if (stored) {
      const parsed = JSON.parse(stored);
      setData(parsed);
      if (parsed.length > 0) setHeaders(Object.keys(parsed[0]));
    }
  }, []);

  if (data.length === 0) {
    return (
      <div className="p-6 text-center">
        <p>No data found. Please upload an Excel file first.</p>
      </div>
    );
  }


  const handleUpload = async () => {
    const response = await uploadBulkProducts(data);

    if (response.success) {
   showSuccessToast(response.message);
      localStorage.removeItem('excelData');
      router.push("/inventory");
    } else {
     showErrorToast(response.message);
    }
  };




  return (
    <div className="p-6 overflow-x-auto">
        <div className='flex flex-row justify-between'>
      <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Uploaded Data</h2>
<div className="flex flex-row justify-end">
  <button
        onClick={() => router.push('/inventory/upload')}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-4"
      >
        New Bulk Data
      </button>


      <button
  onClick={handleUpload}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg ml-4 hover:bg-blue-700 mb-4"
      >
        Upload Data To Server
      </button>
      </div>
</div>

      <table className="table-auto w-full border border-collapse border-green-400 ">
        <thead>
          <tr className='text-white dark:text-black dark:bg-white bg-black' >
            {headers.map((header) => (
              <th key={header} className="border px-4 py-2 ">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {headers.map((header) => (
                <td key={header} className="border px-4 py-2 text-black dark:text-white">
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
