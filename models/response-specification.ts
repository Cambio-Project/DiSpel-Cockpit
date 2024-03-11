import type { MeasurementPoint } from "./measurement-point";
import type { Predicate } from "./predicate";

export interface ResponseSpecification {
    behavior_description: string;
    specification: string,
    specification_type: 'mtl' | 'psp';
    predicates_info: Predicate[],
    measurement_source: 'csv';
    measurement_points: MeasurementPoint[];
}