import {ResponseSpecification} from "~/models/response-specification";
import {pushSimulationResult} from "~/server/utils/pushSimulationResult";
import {getMeasurementPointsFromPredicates, sendVerificationRequest} from "~/server/utils/verifyUtils";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event)
    const TBVERIFIER_URL = 'http://' + config.public.tbVerifierDomain + ':' + config.public.tbVerifierPort + '/monitor';
    const body = await readBody(event)
    const scenario = body.scenario;
    const simulationID = scenario.simulationID;
    const responses = scenario.responses;

    const responseVerificationResultPromises = responses.map((response: any) => {
        const specification = response.TBV_timed;
        const predicates = response.predicates_info;

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
                store_combined_misim_results: true,
            }
        }
        return sendVerificationRequest(responseSpecification, TBVERIFIER_URL);
    })

    const responseVerificationResults = await Promise.all(responseVerificationResultPromises);

    const simulationNames: string[] = [simulationID]
    const resultArray: boolean[][] = [responseVerificationResults]
    await pushSimulationResult(simulationID, simulationNames, resultArray)

    return {
        result: responseVerificationResults,
    }
})
