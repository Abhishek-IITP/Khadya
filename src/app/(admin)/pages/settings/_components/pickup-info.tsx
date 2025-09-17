"use client";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import InputGroup from "@/components/FormElements/InputGroup";
import { useEffect, useState } from "react";

export function PickupInfoCard() {
  const [pickupInfo, setPickupInfo] = useState<any>(null);

  useEffect(() => {
    async function fetchPickupInfo() {
      try {
        const res = await fetch("/api/settings");
        if (!res.ok) throw new Error("Failed to fetch user info");
        const { pickup } = await res.json();
        if (!pickup) {
          setPickupInfo({
            unit_number: "",
            building_name: "",
            road_name: "",
            area: "",
            city: "",
            state: "",
            country: "",
            pincode: ""
          });
        } else {
          setPickupInfo({
            unit_number: pickup.unit_number || "",
            building_name: pickup.building_name || "",
            road_name: pickup.road_name || "",
            area: pickup.area || "",
            city: pickup.city || "",
            state: pickup.state || "",
            country: pickup.country || "",
            pincode: pickup.pincode || ""
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchPickupInfo();
  }, []);

  if (!pickupInfo) return null;

  return (
    <ShowcaseSection title="Pickup Information" className="!p-7 mt-6">
      <form>
        <InputGroup
          className="mb-5.5"
          type="text"
          name="unitNumber"
          label="Unit Number"
          placeholder="Unit Number"
          value={pickupInfo.unit_number}
        />
        <InputGroup
          className="mb-5.5"
          type="text"
          name="buildingName"
          label="Building Name"
          placeholder="Building Name"
          value={pickupInfo.building_name}
        />
        <InputGroup
          className="mb-5.5"
          type="text"
          name="roadName"
          label="Road Name"
          placeholder="Road Name"
          value={pickupInfo.road_name}
        />
        <InputGroup
          className="mb-5.5"
          type="text"
          name="area"
          label="Area"
          placeholder="Area"
          value={pickupInfo.area}
        />
        <InputGroup
          className="mb-5.5"
          type="text"
          name="city"
          label="City"
          placeholder="City"
          value={pickupInfo.city}
        />
        <InputGroup
          className="mb-5.5"
          type="text"
          name="state"
          label="State"
          placeholder="State"
          value={pickupInfo.state}
        />
        <InputGroup
          className="mb-5.5"
          type="text"
          name="country"
          label="Country"
          placeholder="Country"
          value={pickupInfo.country}
        />
        <InputGroup
          className="mb-5.5"
          type="text"
          name="pincode"
          label="Pincode"
          placeholder="Pincode"
          value={pickupInfo.pincode}
        />
      </form>
    </ShowcaseSection>
  );
}
