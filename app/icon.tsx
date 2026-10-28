import { markIcon } from "@/lib/mark-icon";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return markIcon(size.width);
}
