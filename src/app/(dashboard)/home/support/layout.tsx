import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support - Calibre Web",
  description: "Find answers, explore our documentation, or join the community discussion.",
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
