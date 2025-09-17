'use client';

import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import React from 'react';
import InputGroup from "@/components/FormElements/InputGroup";
import { showErrorToast } from '../../lib/toast-utils';

export default function UploadPage() {
  const router = useRouter();

  const REQUIRED_FIELDS = [
    'title', 'gender', 'category', 'countryoforigin', 'gst', 'returnpol',
    'subcategory', 'sku', 'brand', 'manufacturer', 'manufactureraddr',
    'hsn', 'price', 'wholesaleprice', 'moq', 'dispatch', 'stock',
    'clothingtype', 'fit', 'sleeve', 'neck', 'bottom', 'closure', 'fabric',
    'strech', 'pattern', 'washcare', 'occasion', 'gsm', 'size', 'color',
    'stylef', 'stitchf', 'dupatta', 'lining', 'dimension', 'weight',
    'shipping', 'inv_location', 'tags', 'metatitle', 'metades',
    'sellernotes', 'embellishments',  'productvideourl',
      'productimagesurl'

  ];

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      if (!Array.isArray(jsonData) || jsonData.length === 0) {
        showErrorToast("The Excel file is empty or invalid.");
        return;
      }

      const firstRowKeys = Object.keys(jsonData[0] || {}).map(key =>
        key.trim().toLowerCase()
      );

      const missingFields = REQUIRED_FIELDS.filter(
        (field) => !firstRowKeys.includes(field.toLowerCase())
      );

      if (missingFields.length > 0) {
        showErrorToast(
          `Missing required fields in Excel: ${missingFields.join(", ")}`
        );
        return;
      }

      // All good, store in localStorage and redirect
      localStorage.setItem('excelData', JSON.stringify(jsonData));
      router.push('/inventory/view-data');
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className=" mt-10 flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-xl font-bold text-black dark:text-white">Upload Bulk Data Using Excel File</h1>
      <InputGroup
        type="file"
        fileStyleVariant="style1"
        accept=".xlsx,.xls,.csv"
        handleChange={handleFile}
        className="px-4 py-2 rounded"
        label="Upload Excel File"
        placeholder="Please read guideline before uploading file."
      />

      <div className="max-w-2xl mt-4 text-sm text-gray-700 dark:text-gray-300">
        <p className="font-semibold mb-2">📋 Please follow the guidelines before uploading:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>The file must be in <strong>.xlsx</strong>, <strong>.xls</strong>, or <strong>.csv</strong> format.</li>
          <li>The first row should contain the column headers.</li>
          <li>Required columns: <code>title</code>, <code>price</code>, <code>category</code>, <code>description</code> and other mandatory fields.</li>
          <li>Ensure there are no merged cells or empty header fields.</li>
          <li>Maximum file size: <strong>1 MB</strong>.</li>
        </ul>

        <a
          href="/sample/product-upload-template.xlsx"
          download
          className="text-blue-600 underline mt-3 inline-block hover:text-blue-800"
        >
          📥 Download Sample Excel Template
        </a>
      </div>
    </div>
  );
}
