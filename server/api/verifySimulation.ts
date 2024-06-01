import {ResponseSpecification} from "~/models/response-specification";
import {pushSimulationResult} from "~/server/utils/pushSimulationResult";
import {getMeasurementPointsFromPredicates, sendVerificationRequest} from "~/server/utils/verifyUtils";
import fs from "fs";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event)
    const TBVERIFIER_URL = 'http://' + config.public.tbVerifierDomain + ':' + config.public.tbVerifierPort + '/monitor';
    const body = await readBody(event)
    const scenario = body.scenario;
    const simulationID = scenario.simulationID;
    const responses = scenario.responses;

    const testFolder = 'data/simulations_results/' + simulationID;
    let fileNames: string[] = []
    const allVerificationResults = []
    if (fs.existsSync(testFolder)) {
        fileNames = fs.readdirSync(testFolder);
        const allResponseVerificationResultPromises = []

        for (let fileName of fileNames) {
            const fileResponseVerificationResultPromises = responses.map((response: any) => {
                const specification = response.TBV_timed;
                const predicates = response.predicates_info;

                const responseSpecification: ResponseSpecification = {
                    behavior_description: 'Description',
                    specification,
                    specification_type: 'tbv',
                    predicates_info: predicates,
                    measurement_source: "misim",
                    "remote-misim-address": "/app/simulations_results/" + simulationID + "/" + fileName,
                    measurement_points: getMeasurementPointsFromPredicates(predicates),
                    options: {
                        create_plots: false,
                        store_combined_misim_results: true,
                    }
                }
                return sendVerificationRequest(responseSpecification, TBVERIFIER_URL);
            })
            allResponseVerificationResultPromises.push(fileResponseVerificationResultPromises)

        }

        for (let filePromises of allResponseVerificationResultPromises) {
            const fileResponseVerificationResults = await Promise.all(filePromises);
            allVerificationResults.push(fileResponseVerificationResults)
        }
    }
    await pushSimulationResult(simulationID, fileNames, allVerificationResults)
    return {
        files: fileNames,
        results: allVerificationResults
    }
})
