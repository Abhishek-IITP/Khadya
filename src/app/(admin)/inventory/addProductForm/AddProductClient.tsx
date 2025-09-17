
'use client';

import React, {useEffect, useState } from 'react';
import { CoreProductInfoForm } from './_components/coreProductInfo';
import { MaleClothingInfoForm } from './_components/maleClothingInfo';
import { LogisticsInfoForm } from './_components/logisticsInfo';
import { SeoTagsInfo } from './_components/seoTagsInfo';
import { FemaleClothingInfoForm } from './_components/femaleClothingInfo';
import { addProduct } from '../../action/product';
import PreviewForm from './_components/PreviewForm';
import ExcelUploadTable from './_components/ExcelUploadProduct';
import { useRouter } from 'next/navigation';
import { parse } from 'path';

const steps = [
  "Basic Product Info ",
  "More Product Info",
  "Logisitcs",
  "SEO Tags",

];



const stepIndexMap: Record<string, number> = {
  userDetails: 1,
  documents: 2,
  pickupAddress: 3,
  bankDetails: 4,
  bankVerification: 5,
};

interface CoreProductInfoFormProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}


export default function AddProductForm() {

  const [step, setStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);



  const [formData, setFormData] = useState({
    title: '',
    gender: '',
    category: '',
    countryoforigin: '',
    gst: '',
    returnpol: '',
    subcategory: '',
    sku: '',
    brand: '',
    manufacturer: '',
    manufactureraddr: '',
    hsn: '',
    price: '',
    wholesaleprice: '',
    moq: '',
    dispatch: '',
    stock: '',
    clothingtype: '',
    fit: '',
    sleeve: '',
    neck: '',
    bottom: '',
    closure: '',
    fabric: '',
    strech: '',
    pattern: '',
    washcare: '',
    occasion: '',
    gsm: '',
    size: '',
    color: '',
    stylef: '',
    stitchf: '',
    dupatta: '',
    lining: '',
    dimension: '',
    weight: '',
    shipping: '',
    inv_location: '',
    tags: '',
    metatitle: '',
    metades: '',
    sellernotes: '',
    embellishments : '',
    productvideourl : null as File | null,
    productimagesurl : [] as File[],
  });


const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value, type } = e.target;

  // Handle file inputs
  if (type === 'file' && e.target instanceof HTMLInputElement) {
    const files = e.target.files;
    if (!files) return;

    if (name === 'productvideourl') {
      // Validate video file type and size
      const videoFile = files[0];
      if (videoFile) {
        const validVideoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'];
        if (!validVideoTypes.includes(videoFile.type)) {
          alert('Please upload a valid video file (MP4, AVI, MOV, WMV)');
          return;
        }
        if (videoFile.size > 50 * 1024 * 1024) { // 50MB limit
          alert('Video file size should not exceed 50MB');
          return;
        }
      }
      setFormData((prev) => ({
        ...prev,
        [name]: videoFile, // Single file
      }));
    } else if (name === 'productimagesurl') {
      // Validate image files
      const imageFiles = Array.from(files);
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxFileSize = 5 * 1024 * 1024; // 5MB per image
      
      for (const file of imageFiles) {
        if (!validImageTypes.includes(file.type)) {
          alert('Please upload valid image files (JPEG, JPG, PNG, WEBP)');
          return;
        }
        if (file.size > maxFileSize) {
          alert('Each image file should not exceed 5MB');
          return;
        }
      }
      
      setFormData((prev) => ({
        ...prev,
        [name]: imageFiles, // Multiple files
      }));
    }

    return;
  }

  // Handle text/select inputs
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

  const router = useRouter();


  const handleNext = () => {

    if (step < steps.length - 1) {
      // console.log("formData.gender");
      // console.log(formData.gender);
      setStep(step + 1);
    } else {
      setIsModalOpen(true); // Open modal instead of alert
    }
  };


  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };


    const [hasExcelData, setHasExcelData] = useState(false);

useEffect(() => {
  // Check for bulk Excel data
  const storedExcelData = localStorage.getItem('excelData');
  setHasExcelData(!!storedExcelData);

  // Check for edit mode and prefill form data
  const params = new URLSearchParams(window.location.search);
   const editMode = params.get('mode') === 'edit';
   setIsEdit(editMode);

  if (editMode) {
    const storedEditData = localStorage.getItem('editProductData');
    // console.log("storedEditData");
    // console.log(storedEditData);
    // console.log("storedEditData");
    if (storedEditData) {

      
      try {
        const parsed = JSON.parse(storedEditData);

        setFormData((prev) => ({
          ...prev,
          ...parsed,
        }));
        // localStorage.removeItem('editProductData'); 
        // optional: clear after loading
      } catch (error) {
        console.error('Failed to parse edit product data:', error);
      }
    }
  }
}, []);







  return (
    <div className="mx-auto p-6">
      <div className='flex flex-row justify-between'>
      <h1 className="text-2xl text-dark dark:text-white font-bold mb-4">{isEdit ? 'Edit Product'  : 'Product Product'}</h1>


 {isEdit ?<button
            onClick={() => router.push('/inventory')}
            className="px-6 py-3 bg-green-600 text-white mb-4 rounded-lg hover:bg-green-700"
          >
            New Product
          </button> :  hasExcelData ? (
          <button
            onClick={() => router.push('/inventory/view-data')}
            className="px-6 py-3 bg-green-600 text-white mb-4 rounded-lg hover:bg-green-700"
          >
            View Bulk Data
          </button>
        ) : (

             <button
        onClick={() => router.push('/inventory/upload')}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg mb-4 hover:bg-blue-700"
      >
        Upload Bulk Data
      </button>
        )}



   
 
</div>
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar Tabs */}
        <div className="flex flex-row lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 mb-6 lg:mb-0 lg:mr-6 lg:sticky lg:top-6 lg:h-fit">
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`px-4 py-2 rounded text-left border-b-2 lg:border-b-0 lg:border-l-4 transition-all duration-200
          ${step === i
                  ? 'border-dark dark:border-white font-bold'
                  : 'border-transparent font-normal'}
          ${step === i ? 'bg-primary text-white' : 'bg-primary bg-opacity-55 text-white'}
        `}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div className="flex-1 space-y-4">
          {step === 0 && (
            <CoreProductInfoForm
              formData={formData}
              onChange={handleChange}
              goToNextStep={handleNext}
            />
          )}

          {step === 1 && (
            <>
              {formData.gender.toLowerCase() === 'male' && <MaleClothingInfoForm formData={formData} onChange={handleChange} goToNextStep={handleNext} />}
              {formData.gender.toLowerCase() === 'female' && <FemaleClothingInfoForm formData={formData} onChange={handleChange} goToNextStep={handleNext} />}
              {formData.gender.toLowerCase() === 'unisex' && <div>UnisexClothingInfoForm Coming Soon...</div>}
              {!formData.gender && (
                <div className="text-red-500">
                  Please select gender in Step 1 (Basic Product Info) to continue.
                </div>
              )}
            </>
          )}

          {step === 2 && <LogisticsInfoForm formData={formData} onChange={handleChange} goToNextStep={handleNext} />}
          {step === 3 && <SeoTagsInfo formData={formData} onChange={handleChange} goToNextStep={handleNext} />}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={handlePrev}
          disabled={step === 0}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Back to Previous Step
        </button>
      </div>

      {isModalOpen && (
    <PreviewForm product={formData} mode={isEdit} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );

}
