import { MeasurementPoint } from "~/models/measurement-point";
import { Predicate } from "~/models/predicate";
import { ResponseSpecification } from "~/models/response-specification";
import {id} from "postcss-selector-parser";

const TBVERIFIER_URL = 'http://localhost:8083/monitor';


export default defineEventHandler(async (event) => {
    const body = await readBody(event)

   /*  const body = await readBody(event)
    const simulationPath = '/path';
    
    const specification = 'TOOD_INPUT_SPECIFICATION';
    const predicates: Predicate[] = [

    ];

    // Create Response Specification
    const responseSpecification: ResponseSpecification = {
        behavior_description: 'Description',
        specification,
        specification_type: 'psp',
        predicates_info: predicates,
        measurement_source: 'csv',
        measurement_points: getMeasurementPointsFromPredicates(predicates),
    } */

    // Create Request
    var formdata = new FormData();
    let simulationID = body.simulationID

    const DEMO_SPECIFICATION = {
        "specification": " always(instance_dead(instance_count) since[0,3] instance_alive(instance_count)) ",
        "specification_type":"mtl",
        "predicates_info": [
            {
                "predicate_name":"instance_alive",
                "predicate_comparison_value":"0",
                "predicate_logic":"biggerEqual"
            },
            {
                "predicate_name":"instance_dead",
                "predicate_comparison_value":"0",
                "predicate_logic":"biggerEqual"
            }
        ],
        "measurement_source": "misim",
        "remote-misim-address": "/app/simulations_results/"+simulationID,
        "measurement_points": [
            {
                "measurement_name":"instance_count",
                "measurement_column":"gateway_InstanceCount"
            }
        ]
    };

    formdata.append("formula_json", JSON.stringify(DEMO_SPECIFICATION));
    var requestOptions: RequestInit = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
    };
    const response = await fetch(TBVERIFIER_URL, requestOptions);

    // Result
    const verificationResult = await response.json();
    console.log(verificationResult);

    return {
        result: verificationResult
    }
})




const getMeasurementPointsFromPredicates = (predicates: Predicate[]) => {
    return predicates.map(predicate => {
        const measurementPoint: MeasurementPoint = {
            measurement_column: predicate.measurement_source,
            measurement_name: predicate.measurement_source,
        };
        return measurementPoint;
    });
}
