"use client";
import {
  CallIcon,
  EmailIcon,
  UserIcon,
} from "@/assets/icons";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";


export function PersonalInfoForm() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/settings");
        if (!res.ok) throw new Error("Failed to fetch user info");
  const { user } = await res.json();
  setProfile(user);
      } catch (error) {
        console.error(error);
      }
    }
    fetchProfile();
  }, []);

  if (!profile) return null;

  return (
    <ShowcaseSection title="Personal Information" className="!p-7">
      <form>
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <InputGroup
            className="w-full sm:w-1/2"
            type="text"
            name="firstName"
            label="First Name"
            placeholder="First Name"
            value={profile.firstName || ""}
            icon={<UserIcon />}
            iconPosition="left"
            height="sm"
          />

          <InputGroup
            className="w-full sm:w-1/2"
            type="text"
            name="lastName"
            label="Last Name"
            placeholder="Last Name"
            value={profile.lastName || ""}
            icon={<UserIcon />}
            iconPosition="left"
            height="sm"
          />
        </div>

        <InputGroup
          className="mb-5.5"
          type="text"
          name="phoneNumber"
          label="Phone Number"
          placeholder="Phone Number"
          value={profile.phone ?? profile.mobile ?? profile.contact ?? profile.telephone ?? ""}
          icon={<CallIcon />}
          iconPosition="left"
          height="sm"
        />

        <InputGroup
          className="mb-5.5"
          type="email"
          name="email"
          label="Email Address"
          placeholder="Email Address"
          value={profile.email || profile.mail || profile.emailAddress || profile.user_email || ""}
          icon={<EmailIcon />}
          iconPosition="left"
          height="sm"
        />

        {/* Example: Display all other fields */}


        <div className="flex justify-end gap-3">
          <button
            className="rounded-lg border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
            type="button"
          >
            Cancel
          </button>

          <button
            className="rounded-lg text-lg flex gap-2 bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
            type="submit"
          >
            <Pencil className="size-4 mt-2 " />
            Edit Profile
          </button>
        </div>
      </form>
    </ShowcaseSection>
  );
}
