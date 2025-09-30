import fs from "fs";
import * as readline from "readline";

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const simulationID = JSON.parse(body).simulationID

    const exporter = new Scenario2OpenMetricsExporter()
    const openMetrics = await exporter.produceOpenMetricsExport(simulationID)

    console.log(openMetrics)

    const formData = prepareFormData(openMetrics);
    const config = useRuntimeConfig(event)
    return await fetch(`http://${config.public.prometheusServiceDomain}:${config.public.prometheusServicePort}/api/import`, {
        method: "POST",
        body: formData
    });
})

function prepareFormData(openMetrics: string) {
    const blob = new Blob([openMetrics], {type: "text/plain"});
    const formData = new FormData();
    formData.append("file", blob, "metrics.om");
    return formData
}

class Scenario2OpenMetricsExporter {
    private START_TIMESTAMP: number = 0;
    private TIME_STEP_LENGTH_IN_SECONDS: number = 1;
    private CSV_SEPARATOR: string = ",";

    async produceOpenMetricsExport(simulationID: number): Promise<string> {
        await this.loadScenario(simulationID);

        let openMetrics = "";
        openMetrics += await this.prepareMonitoringFileContents(simulationID);
        openMetrics += await this.prepareScenarioOccurrenceContents(simulationID);
        openMetrics += "# EOF\n"; // OpenMetrics footer

        return openMetrics;
    }

    private async loadScenario(simulationID: any) {
        const scenario = await Scenario.findOne({simulationID: simulationID});

        if (!scenario) {
            throw new Error('Scenario not found');
        }

        // Set the values from the scenario
        this.START_TIMESTAMP = scenario.prometheusStartTimestamp!;
        this.TIME_STEP_LENGTH_IN_SECONDS = scenario.secondsPerTimeStep!;
    }


    private async getMonitoringFilePath(simulationID: any) {
        const scenario = await Scenario.findOne({simulationID: simulationID})
        const monitoringData = scenario!.environment!.monitoringData
        const monitoringFile = Object.keys(monitoringData[0])[0]
        return "./uploaded/" + monitoringFile
    }

    private getReadLine(filePath: string) {
        const fileStream = fs.createReadStream(filePath);
        return readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity,
        });
    }

    private convertToPrometheusTime(timeStep: number) {
        return this.START_TIMESTAMP + (timeStep * this.TIME_STEP_LENGTH_IN_SECONDS);
    }

    private splitAndTrim(line: string) {
        return line.split(this.CSV_SEPARATOR).map((p) => p.trim());
    }

    private isEmptyLine(line: string) {
        return !line.trim()
    }

    private isEmptyHeaders(headers: string[]) {
        return headers.length === 0;
    }

    private getMetricTypeLine(metricName: string, metricType: string) {
        return `# TYPE ${metricName} ${metricType}\n`
    }

    private getMetricValueLine(metric: string, val: string, absTimeMs: number) {
        return `${metric} ${val} ${absTimeMs}\n`
    }

    private writeMetricTypes(headers: string[], output: string) {
        for (let i = 1; i < headers.length; i++) {
            const metric = headers[i];
            if (!metric) {
                continue;
            }
            if (metric.endsWith("_total")) {
                output += this.getMetricTypeLine(metric, "counter");
            } else {
                output += this.getMetricTypeLine(metric, "gauge");
            }
        }
        return output;
    }

    private writeMetricValues(headers: string[], lineEntries: string[], output: string) {
        const relTime = parseInt(lineEntries[0], 10);
        const absTimeMs = this.convertToPrometheusTime(relTime);
        for (let i = 1; i < lineEntries.length; i++) {
            const metric = headers[i];
            const valStr = lineEntries[i];
            if (!metric || !valStr) {
                continue;
            }

            const val = parseFloat(valStr);
            if (isNaN(val)) {
                continue;
            }

            output += this.getMetricValueLine(metric, valStr, absTimeMs);
        }
        return output;
    }

    /**
     * Writes the contents of the monitoring file (input metrics) as Open Metrics
     *
     * @param simulationID
     * @private
     */
    private async prepareMonitoringFileContents(simulationID: any): Promise<string> {
        const monitoringFilePath = await this.getMonitoringFilePath(simulationID)
        const readline = this.getReadLine(monitoringFilePath)

        let headers: string[] = [];
        let openMetrics = "";

        for await (const line of readline) {

            if (this.isEmptyLine(line)) {
                continue;
            }

            const lineEntries = this.splitAndTrim(line);

            // Initialize Headers from first row
            if (this.isEmptyHeaders(headers)) {
                headers = this.sanitizeMetricNames(lineEntries);
                openMetrics = this.writeMetricTypes(headers, openMetrics);
                continue;
            }

            openMetrics = this.writeMetricValues(headers, lineEntries, openMetrics);
        }
        return openMetrics
    }

    /**
     * Writes the scenario occurrence data as one metrics with tags for the results
     *
     * @param simulationID
     * @private
     */
    private async prepareScenarioOccurrenceContents(simulationID: any) {
        let openMetrics = "";
        const result = await Result.findOne({simulationID: simulationID});
        const metric = "scenario_occurrence";
        openMetrics += this.getMetricTypeLine(metric, "gauge");
        for (let i = 0; i < result!.searchNames.length; i++) {
            const searchName = result!.searchNames[i];

            const startRel = searchName.RelativeStartTime;
            const endRel = searchName.RelativeEndTime;
            const startAbsMs = this.convertToPrometheusTime(startRel!);
            const endAbsMs = this.convertToPrometheusTime(endRel!);

            const scenarioSuccess = result!.searchResultsScenarioSuccesses[i];

            const responseSuccesses = result!.searchResults[i];
            const responseResultsTags = this.formatResponsesAsTags(responseSuccesses)

            openMetrics += `${metric}{id="${searchName.id}",responseTotal="${scenarioSuccess}"${responseResultsTags}} 0 ${this.START_TIMESTAMP}\n`;
            openMetrics += `${metric}{id="${searchName.id}",responseTotal="${scenarioSuccess}"${responseResultsTags}} 1 ${startAbsMs}\n`;
            openMetrics += `${metric}{id="${searchName.id}",responseTotal="${scenarioSuccess}"${responseResultsTags}} 0 ${endAbsMs}\n`;
        }
        return openMetrics
    }

    private formatResponsesAsTags(responseSuccesses: any): string {
        let j = 0;
        let responseResults = ""
        for (let value of Object.values(responseSuccesses)) {
            responseResults += `,response${j}="${value}"`;
            j++;
        }
        return responseResults
    }

    private sanitizeMetricName(name: string) {
        const whitespaces = /\s+/g
        name = name.replaceAll(".", "_")
        name = name.replaceAll("-", "_")
        return name.replaceAll(whitespaces, "")
    }

    private sanitizeMetricNames(names: string[]) {
        for (let i = 0; i < names.length; i++) {
            names[i] = this.sanitizeMetricName(names[i]);
        }
        return names;
    }
}

