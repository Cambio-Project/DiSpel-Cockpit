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

export const sendVerificationRequest = async (responseSepcification: ResponseSpecification, TBVERIFIER_URL: string) => {
  const response = await $fetch<VerificationResponse>(TBVERIFIER_URL, {
  method: 'POST',
  body: responseSepcification,
  headers: {
    'Content-Type': 'application/json',
  }});
    console.log(response)
    console.log(response.result === 'True')

    // Result
    return response.result === 'True';
}

interface VerificationResponse {
  result: 'True' | 'False'
}