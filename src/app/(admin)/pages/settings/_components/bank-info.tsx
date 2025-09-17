"use client";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import InputGroup from "@/components/FormElements/InputGroup";
import { useEffect, useState } from "react";

export function BankInfoCard() {
  const [bankInfo, setBankInfo] = useState<any>(null);

  useEffect(() => {
    async function fetchBankInfo() {
      try {
        const res = await fetch("/api/settings");
        if (!res.ok) throw new Error("Failed to fetch user info");
        const { bank } = await res.json();
        let info;
        if (!bank) {
          info = { bank_name: "", account_number: "", ifsc_code: "", branch: "", beneficiary_name: "" };
        } else {
          info = {
            bank_name: bank.bank_name || bank.beneficiary_name || "",
            account_number: bank.account_number || "",
            ifsc_code: bank.ifsc_code || "",
            branch: bank.branch || "",
            beneficiary_name: bank.beneficiary_name || ""
          };
        }
        setBankInfo(info);
        console.log("BankInfo:", info);
      } catch (error) {
        console.error(error);
      }
    }
    fetchBankInfo();
  }, []);

  if (!bankInfo) return null;

  return (
    <ShowcaseSection title="Bank Information" className="!p-7 mt-6">
      <form>
                <InputGroup
          className="mb-5.5"
          type="text"
          name="beneficiaryName"
          label="Account Holder Name"
          placeholder="Account Holder Name"
          value={bankInfo.beneficiary_name || ""}
        />
        
        <InputGroup
          className="mb-5.5"
          type="text"
          name="bankName"
          label="Bank Name"
          placeholder="Bank Name"
          value={bankInfo.bank_name}
        />
        <InputGroup
          className="mb-5.5"
          type="text"
          name="accountNumber"
          label="Account Number"
          placeholder="Account Number"
          value={bankInfo.account_number}
        />
        <InputGroup
          className="mb-5.5"
          type="text"
          name="ifscCode"
          label="IFSC Code"
          placeholder="IFSC Code"
          value={bankInfo.ifsc_code}
        />

      </form>
    </ShowcaseSection>
  );
}
