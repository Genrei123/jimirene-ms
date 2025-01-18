import { Item } from "./Item";
import { RenderedServiceDetail } from "./RenderedServiceDetail";

export interface RenderedService {
    id: number;
    patientId: number;
    services: RenderedServiceDetail[];
    items: Item[];
    totalCost: number;
    notes: string;
}