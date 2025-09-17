'use client';

import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui-elements/button';
import Link from 'next/link';

export default function EditProductButton({ channel }: { channel: any }) {
  const handleEditClick = () => {



    localStorage.setItem('editProductData', JSON.stringify(channel));
    // console.log("HANDLE EDIT CLICK");
    // console.log(channel);
    // console.log("HANDLE EDIT CLICK");
  };

  return (
    <Link href={`/inventory/addProductForm?mode=edit&id=${channel.id}`}>
      <Button
        icon={<Pencil className="h-4 w-4 dark:text-white" />}
        label=""
        size="small"
        variant="outlinePrimary"
        className="h-8 w-8"
        title="Edit"
        onClick={handleEditClick}
      />
    </Link>
  );
}
