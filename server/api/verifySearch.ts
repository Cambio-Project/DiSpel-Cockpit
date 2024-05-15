import {MeasurementPoint} from "~/models/measurement-point";
import {Predicate} from "~/models/predicate";
import {ResponseSpecification} from "~/models/response-specification";
import fs from "fs";
import {pushSearchResult} from "~/server/utils/pushSearchResult";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event)

    const TBVERIFIER_URL = 'http://' + config.public.tbVerifierDomain + ':' + config.public.tbVerifierPort + '/monitor';

    const body = await readBody(event)

    const scenario = body.scenario;
    const simulationID = scenario.simulationID;
    const responses = scenario.responses;

    const testFolder = 'data/search_results/' + simulationID;
    const fileNames: string[] = []
    const allVerificationResults = []
    if (fs.existsSync(testFolder)) {
        const fileNames = fs.readdirSync(testFolder);
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
                    measurement_source: "remote-csv",
                    "remote-csv-address": "/app/search_results/" + simulationID + "/" + fileName,
                    measurement_points: getMeasurementPointsFromPredicates(predicates),
                    options: {
                        create_plots: false,
                        store_combined_misim_results: false,
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

        await pushSearchResult(simulationID, fileNames, allVerificationResults)
    }
    return {
        files: fileNames,
        results: allVerificationResults,
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

const sendVerificationRequest = async (responseSepcification: ResponseSpecification, TBVERIFIER_URL: string) => {
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
