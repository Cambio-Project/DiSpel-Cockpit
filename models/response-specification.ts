import type { MeasurementPoint } from "./measurement-point";
import type { Predicate } from "./predicate";

export interface ResponseSpecification {
    behavior_description: string;
    specification: string,
    specification_type: 'mtl' | 'psp' | 'tbv';
    predicates_info: Predicate[],
    "remote-misim-address"?: string;
    measurement_source: 'csv' | 'misim';
    measurement_points: MeasurementPoint[];
    options?: {
        create_plots?: boolean;
        store_combined_misim_results?: boolean;
    }
}