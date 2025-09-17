import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import { PersonalInfoForm } from "./_components/personal-info";
import { UploadPhotoForm } from "./_components/upload-photo";
import { BankInfoCard } from "./_components/bank-info";
import { PickupInfoCard } from "./_components/pickup-info";

export const metadata: Metadata = {
  title: "Settings Page",
};

export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-[1080px]">
      <Breadcrumb pageName="Settings" />

      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 xl:col-span-3 flex flex-col gap-8">
          <PersonalInfoForm />
          <PickupInfoCard />
        </div>
        <div className="col-span-5 xl:col-span-2 flex flex-col gap-8">
          <BankInfoCard />
          <UploadPhotoForm />
        </div>
      </div>
    </div>
  );
};

