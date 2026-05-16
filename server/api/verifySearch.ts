import {ResponseSpecification} from "~/models/response-specification";
import fs from "fs";
import {pushSearchResult} from "~/server/utils/pushSearchResult";
import {getMeasurementPointsFromPredicates, sendVerificationRequest} from "~/server/utils/verifyUtils";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event)

    const TBVERIFIER_URL = 'http://' + config.public.tbVerifierDomain + ':' + config.public.tbVerifierPort + '/monitor';

    const body = await readBody(event)

    const scenario = body.scenario;
    const simulationID = scenario.simulationID;
    const responses = scenario.responses;
    const result = await Result.findOne({simulationID: simulationID})

    if(result == null){
        return;
    }

    const testFolder = 'data/search_results/' + simulationID;
    const allVerificationResults = []
    if (fs.existsSync(testFolder)) {
        const allResponseVerificationResultPromises = []

        for (let searchName of result.searchNames) {
            const fileResponseVerificationResultPromises = responses.map((response: any) => {
                let specification = determineFormula(response);
                let predicates = response.predicates_info;
                const endMode = determineEndMode(response);
                const measurementPoints = getMeasurementPointsFromPredicates(predicates);
                
                if (endMode) {
                    specification = modifySpecificationWithEndMode(specification);
                    predicates = modifyPredicatesWithEndMode(predicates);
                }

                const responseSpecification: ResponseSpecification = {
                    behavior_description: 'Description',
                    specification,
                    specification_type: 'tbv',
                    predicates_info: predicates,
                    "future-mtl": true,
                    measurement_source: "remote-csv",
                    "remote-csv-address": "/app/search_results/" + simulationID + "/" + searchName.fileName,
                    measurement_points: measurementPoints,
                    endMode,
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
    }
    await pushSearchResult(simulationID, allVerificationResults)
    return {
        files: result.searchNames,
        results: allVerificationResults,
    }
})

function modifySpecificationWithEndMode(specification: string): string {
    return specification.replaceAll("$END", "(END(end))");
}

function modifyPredicatesWithEndMode(predicates: any[]): any[] {
    const endModePredicate = {
        predicate_name: 'END',
        predicate_logic: 'equal',
        measurement_source: 'end',
        predicate_comparison_value: '1'
    }
    return [...predicates, endModePredicate];
}

function determineFormula(response: any): string{
    if(response.specification.selectedTimeBound == null){
        return response.TBV_untimed
    }else{
        return response.TBV_timed
    }
}

function determineEndMode(response: any): boolean{
    if(response.specification.selectedTimeBound == null){
        return response.TBV_untimed_requires_end_mode
    }
    else{
        return response.TBV_timed_requires_end_mode
    }
}