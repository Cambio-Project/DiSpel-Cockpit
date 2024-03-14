import { MeasurementPoint } from "~/models/measurement-point";
import { Predicate } from "~/models/predicate";
import { ResponseSpecification } from "~/models/response-specification";

//const TBVERIFIER_URL = 'http://localhost:8083/monitor';
const TBVERIFIER_URL = 'http://localhost:5000/monitor';


export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const scenario = body.scenario;
    const simulationID = scenario.simulationID;
    const responses = scenario.responses;
    
    const responseVerificationResultPromises = responses.map((response: any) => {
        const specification = response[6];
        const predicates = response[8];

        const responseSpecification: ResponseSpecification = {
            behavior_description: 'Description',
            specification,
            specification_type: 'tbv',
            predicates_info: predicates,
            measurement_source: "misim",
            "remote-misim-address": "/app/simulations_results/" + simulationID,
            measurement_points: getMeasurementPointsFromPredicates(predicates),
            options: {
                create_plots: false,
                store_combined_misim_results: false,
            }
        } 
        return sendVerificationRequest(responseSpecification);
    })

    const responseVerificationResults = await Promise.all(responseVerificationResultPromises);

    return {
        result: responseVerificationResults,
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

const sendVerificationRequest = async (responseSepcification: ResponseSpecification) => {
    const formdata = new FormData();
    formdata.append("formula_json", JSON.stringify(responseSepcification));
    const requestOptions: RequestInit = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
    };
    const response = await fetch(TBVERIFIER_URL, requestOptions);

    // Result
    const verificationResult = await response.json();
    return verificationResult.result === 'True';
}


/* const DEMO_SPECIFICATION = {
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
}; */