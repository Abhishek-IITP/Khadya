"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";

import { useEffect, useState } from "react";
import { CameraIcon } from "./_components/icons";
import { SocialAccounts } from "./_components/social-accounts";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import InputGroup from "@/components/FormElements/InputGroup";

export default function Page() {
  const [data, setData] = useState({
    name: "Danish Heilium",
    profilePhoto: "/images/user/user-03.png",
    coverPhoto: "/images/cover/cover-01.png",
  });
  const [profile, setProfile] = useState<any>(null);
  const [bank, setBank] = useState<any>(null);
  const [pickup, setPickup] = useState<any>(null);

  useEffect(() => {
    async function fetchAll() {
      try {
        const res = await fetch("/api/settings");
        if (!res.ok) throw new Error("Failed to fetch profile info");
        const { user, bank, pickup } = await res.json();
        setProfile(user);
        setBank(bank);
        setPickup(pickup);
      } catch (error) {
        console.error(error);
      }
    }
    fetchAll();
  }, []);

  const handleChange = (e: any) => {
    if (e.target.name === "profilePhoto") {
      const file = e.target?.files[0];

      setData({
        ...data,
        profilePhoto: file && URL.createObjectURL(file),
      });
    } else if (e.target.name === "coverPhoto") {
      const file = e.target?.files[0];

      setData({
        ...data,
        coverPhoto: file && URL.createObjectURL(file),
      });
    } else {
      setData({
        ...data,
        [e.target.name]: e.target.value,
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-[970px]">
      <Breadcrumb pageName="Profile" />

      <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="relative z-20 h-35 md:h-65">
          <Image
            src={data?.coverPhoto || "/images/cover/cover-01.png"}
            alt="profile cover"
            className="h-full w-full rounded-tl-[10px] rounded-tr-[10px] object-cover object-center"
            width={970}
            height={260}
            style={{
              width: "auto",
              height: "auto",
            }}
          />
          <div className="absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4">
            <label
              htmlFor="cover"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-[15px] py-[5px] text-body-sm font-medium text-white hover:bg-opacity-90"
            >
              <input
                type="file"
                name="coverPhoto"
                id="coverPhoto"
                className="sr-only"
                onChange={handleChange}
                accept="image/png, image/jpg, image/jpeg"
              />

              <CameraIcon />

              <span>Edit</span>
            </label>
          </div>
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-[176px] sm:p-3">
            <div className="relative drop-shadow-2">
              {data?.profilePhoto && (
                <>
                  <Image
                    src={data?.profilePhoto || "/images/user/user-03.png"}
                    width={160}
                    height={160}
                    className="overflow-hidden rounded-full"
                    alt="profile"
                  />

                  <label
                    htmlFor="profilePhoto"
                    className="absolute bottom-0 right-0 flex size-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
                  >
                    <CameraIcon />

                    <input
                      type="file"
                      name="profilePhoto"
                      id="profilePhoto"
                      className="sr-only"
                      onChange={handleChange}
                      accept="image/png, image/jpg, image/jpeg"
                    />
                  </label>
                </>
              )}
            </div>
          </div>
          <div className="mt-4">
            <h3 className="mb-1 text-heading-6 font-bold text-dark dark:text-white">
              {profile?.firstName || profile?.name || "User"} {profile?.lastName || ""}
            </h3>
            <p className="font-medium">{profile?.role || "User"}</p>
            <div className="mx-auto mb-5.5 mt-5 grid max-w-[370px] grid-cols-3 rounded-[5px] border border-stroke py-[9px] shadow-1 dark:border-dark-3 dark:bg-dark-2 dark:shadow-card">
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-dark-3 xsm:flex-row">
                <span className="font-medium text-dark dark:text-white">
                  {bank?.account_number ? 1 : 0}
                </span>
                <span className="text-body-sm">Bank Accounts</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-dark-3 xsm:flex-row">
                <span className="font-medium text-dark dark:text-white">
                  {pickup?.city ? 1 : 0}
                </span>
                <span className="text-body-sm">Pickup Locations</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row">
                <span className="font-medium text-dark dark:text-white">
                  {profile?.email ? 1 : 0}
                </span>
                <span className="text-body-sm-sm">Verified Email</span>
              </div>
            </div>

            <div className="mx-auto max-w-[720px]">
              <h4 className="font-medium text-dark dark:text-white">
                About Me
              </h4>
              <p className="mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Pellentesque posuere fermentum urna, eu condimentum mauris
                tempus ut. Donec fermentum blandit aliquet. Etiam dictum dapibus
                ultricies. Sed vel aliquet libero. Nunc a augue fermentum,
                pharetra ligula sed, aliquam lacus.
              </p>
            </div>

            <SocialAccounts />
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-8">
        <ShowcaseSection title="Personal Information" className="!p-7">
          <form>
            <InputGroup
              className="mb-5.5"
              type="text"
              name="firstName"
              label="First Name"
              placeholder="First Name"
              value={profile?.firstName || ""}
              disabled
            />
            <InputGroup
              className="mb-5.5"
              type="text"
              name="lastName"
              label="Last Name"
              placeholder="Last Name"
              value={profile?.lastName || ""}
              disabled
            />
            <InputGroup
              className="mb-5.5"
              type="text"
              name="phoneNumber"
              label="Phone Number"
              placeholder="Phone Number"
              value={profile?.phone || ""}
              disabled
            />
            <InputGroup
              className="mb-5.5"
              type="email"
              name="email"
              label="Email Address"
              placeholder="Email Address"
              value={profile?.email || ""}
              disabled
            />
          </form>
        </ShowcaseSection>
        <ShowcaseSection title="Bank Information" className="!p-7">
          <form>
            <InputGroup
              className="mb-5.5"
              type="text"
              name="beneficiaryName"
              label="Account Holder Name"
              placeholder="Account Holder Name"
              value={bank?.beneficiary_name || ""}
              disabled
            />
            <InputGroup
              className="mb-5.5"
              type="text"
              name="bankName"
              label="Bank Name"
              placeholder="Bank Name"
              value={bank?.bank_name || ""}
              disabled
            />
            <InputGroup
              className="mb-5.5"
              type="text"
              name="accountNumber"
              label="Account Number"
              placeholder="Account Number"
              value={bank?.account_number || ""}
              disabled
            />
            <InputGroup
              className="mb-5.5"
              type="text"
              name="ifscCode"
              label="IFSC Code"
              placeholder="IFSC Code"
              value={bank?.ifsc_code || ""}
              disabled
            />
          </form>
        </ShowcaseSection>
        <ShowcaseSection title="Pickup Information" className="!p-7">
          <form>
            <InputGroup
              className="mb-5.5"
              type="text"
              name="unitNumber"
              label="Unit Number"
              placeholder="Unit Number"
              value={pickup?.unit_number || ""}
              disabled
            />
            <InputGroup
              className="mb-5.5"
              type="text"
              name="buildingName"
              label="Building Name"
              placeholder="Building Name"
              value={pickup?.building_name || ""}
              disabled
            />
            <InputGroup
              className="mb-5.5"
              type="text"
              name="roadName"
              label="Road Name"
              placeholder="Road Name"
              value={pickup?.road_name || ""}
              disabled
            />
            <InputGroup
              className="mb-5.5"
              type="text"
              name="area"
              label="Area"
              placeholder="Area"
              value={pickup?.area || ""}
              disabled
            />
            <InputGroup
              className="mb-5.5"
              type="text"
              name="city"
              label="City"
              placeholder="City"
              value={pickup?.city || ""}
              disabled
            />
            <InputGroup
              className="mb-5.5"
              type="text"
              name="state"
              label="State"
              placeholder="State"
              value={pickup?.state || ""}
              disabled
            />
            <InputGroup
              className="mb-5.5"
              type="text"
              name="country"
              label="Country"
              placeholder="Country"
              value={pickup?.country || ""}
              disabled
            />
            <InputGroup
              className="mb-5.5"
              type="text"
              name="pincode"
              label="Pincode"
              placeholder="Pincode"
              value={pickup?.pincode || ""}
              disabled
            />
          </form>
        </ShowcaseSection>
      </div>
    </div>
  );
}
