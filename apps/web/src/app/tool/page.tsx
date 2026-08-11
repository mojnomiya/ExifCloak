import type { Metadata } from "next";
import { ToolApp } from "@/components/tool/tool-app";

export const metadata: Metadata = {
  title: "Online EXIF & Metadata Editor — ExifCloak Web Tool",
  description:
    "View, edit, and strip image metadata (EXIF, IPTC, XMP, GPS) directly in your browser. 100% client-side — nothing uploaded. Free.",
};

export default function ToolPage() {
  return <ToolApp />;
}
