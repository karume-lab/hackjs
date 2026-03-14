import type { Metadata } from "next";
import { AccountProfileClient } from "@/features/account/components/AccountProfileClient";

export const metadata: Metadata = {
  title: "Account Profile | HackJS",
  description: "Manage your account settings and profile information.",
};

const ProfilePage = () => {
  return <AccountProfileClient />;
};

export default ProfilePage;
