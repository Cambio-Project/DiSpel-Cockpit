import {Predicate} from "~/models/predicate";
import {MeasurementPoint} from "~/models/measurement-point";
import {ResponseSpecification} from "~/models/response-specification";

export const getMeasurementPointsFromPredicates = (predicates: Predicate[]) => {
    return predicates.map(predicate => {
        const measurementPoint: MeasurementPoint = {
            measurement_column: predicate.measurement_source,
            measurement_name: predicate.measurement_source,
        };
        return measurementPoint;
    });
}

export const sendVerificationRequest = async (responseSpecification: ResponseSpecification, TBVERIFIER_URL: string) => {
  const response = await $fetch(TBVERIFIER_URL, {
  method: 'POST',
  body: responseSpecification,
  headers: {
    'Content-Type': 'application/json',
  }});
    const parsed = JSON.parse(response as unknown as string)

    // Result
    return parsed.result === 'True';
}
