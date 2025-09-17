// lib/toast-utils.tsx
import toast from 'react-hot-toast';
import {
  AlertErrorIcon,
  AlertSuccessIcon,
  AlertWarningIcon,
} from '@/app/(admin)/components/alert/icons';

const baseStyles =
  'flex items-center gap-3 rounded-lg shadow-md px-4 py-3 min-w-[240px]';

export const showSuccessToast = (message: string) => {
  toast.custom((t) => (
    <div
      className={`${baseStyles} bg-green-50 text-green-800 ${
        t.visible ? 'animate-enter' : 'animate-leave'
      }`}
    >
      <AlertSuccessIcon />
      <span>{message}</span>
    </div>
  ));
};

export const showErrorToast = (message: string) => {
  toast.custom((t) => (
    <div
      className={`${baseStyles} bg-red-50 text-red-800 ${
        t.visible ? 'animate-enter' : 'animate-leave'
      }`}
    >
      <AlertErrorIcon />
      <span>{message}</span>
    </div>
  ));
};

export const showWarningToast = (message: string) => {
  toast.custom((t) => (
    <div
      className={`${baseStyles} bg-yellow-50 text-yellow-800 ${
        t.visible ? 'animate-enter' : 'animate-leave'
      }`}
    >
      <AlertWarningIcon />
      <span>{message}</span>
    </div>
  ));
};
