export { services } from "./services";
export { stores } from "./stores";

import type { ProductData } from "@/types";
import { services } from "./services";

export const products: readonly ProductData[] = services.flatMap((s) => s.products);
