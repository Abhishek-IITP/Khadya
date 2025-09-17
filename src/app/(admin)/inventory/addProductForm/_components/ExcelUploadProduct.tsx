'use client';

import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import React from 'react';

export default function UploadPage() {
  const router = useRouter();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      // Check for required ProductImageURL column
      const hasProductImageURL =
        jsonData.length > 0 &&
        Object.keys(jsonData[0] as object).some(
          (key) => key.trim().toLowerCase() === 'productimageurl'
        );
      if (!hasProductImageURL) {
        alert('The uploaded file must include a ProductImageURL column.');
        return;
      }

      // Store data in localStorage or use context/state (simplified here)
      localStorage.setItem('excelData', JSON.stringify(jsonData));

      // Navigate to view page
      router.push('/view-data');
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-xl font-bold">Upload Excel File</h1>
      <p className="text-sm text-red-600 max-w-md text-center">
        Note: If you provide a <b>productvideourl</b> in your CSV, the video file at that URL must be 5MB or less. Oversized videos will be rejected during processing.
      </p>
      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFile}
        className="px-4 py-2 border rounded"
      />
    </div>
  );
}
