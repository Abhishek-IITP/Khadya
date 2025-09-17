'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui-elements/button';
import { Alert } from '@/components/ui-elements/alert'; // Your custom Alert
import { deleteProduct } from '../../action/product';
import { useRouter } from 'next/navigation';

export default function DeleteProductButton({ channel }: { channel: any }) {


     const router = useRouter(); // ✅ Next.js router
  const [alertType, setAlertType] = useState<
    null | 'warning' | 'success' | 'error'
  >(null);
  const [alertMessage, setAlertMessage] = useState({ title: '', description: '' });
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const showWarning = () => {
    setAlertType('warning');
    setAlertMessage({
      title: 'Confirm Deletion',
      description: 'Are you sure you want to delete this product? This action cannot be undone.',
    });
    setIsConfirming(true);
  };

  const handleCancel = () => {
    setAlertType(null);
    setIsConfirming(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProduct(channel.id);
      setAlertType('success');
      setAlertMessage({
        title: 'Product Deleted',
        description: 'The product was successfully deleted.',
      });

           setTimeout(() => {
        router.push('/inventory');
      }, 2000);


    } catch (err) {
      setAlertType('error');
      setAlertMessage({
        title: 'Delete Failed',
        description: 'There was an error deleting the product.',
      });

                 setTimeout(() => {
        router.push('/inventory');
      }, 2000);
    } finally {
      setIsDeleting(false);
      setIsConfirming(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Delete Button */}
      <Button
        icon={<Trash2 className="h-4 w-4 dark:text-white" />}
        label=""
        size="small"
        variant="outlinePrimary"
        className="h-8 w-8"
        title="Delete"
        onClick={showWarning}
      />

      {/* Conditional Alert */}
 {alertType && (
  <div className="fixed inset-0 z-50 flex items-center justify-center  ">
    <div className="max-w-md w-full px-4 ">
      <Alert

        variant={alertType}
        title={alertMessage.title}
        description={
          <>
            <p>{alertMessage.description}</p>
            {isConfirming && (
              <div className="mt-4 flex gap-4">
                <Button
                disabled={isDeleting}
                  variant="outlinePrimary"
                  size="small"
                  onClick={handleDelete}
                 label='Delete'
                >
                  {isDeleting ? 'Deleting...' : 'Confirm'}
                </Button>
                <Button
                  variant="outlinePrimary"
                  size="small"
                  onClick={handleCancel}
                  label='Cancel'
                >
                  Cancel
                </Button>
              </div>
            )}
          </>
        }
      />
    </div>
  </div>
)}

    </div>
  );
}
