import { User } from "~/server/models/user.model";
import mongoose from "mongoose";

export default defineEventHandler(async (event) => {
    const endpointStatus = {
        pspWizard: {
            domain: "http://localhost:8081",
            status: "red"
        },
        miSim: {
            domain: "http://localhost:8084",
            status: "red"
        },
        tbVerifier: {
            domain: "http://localhost:8083",
            status: "red"
        },
        tqPropRefiner: {
            domain: "http://localhost:8082",
            status: "red"
        },
        db: {
            domain: "",
            status: "red"
        }
    };

    for (let endpoint in endpointStatus) {
        if (endpoint === "db") {
            continue
        }
        try {
            // @ts-ignore
            const response = await fetch(endpointStatus[endpoint].domain, { method: 'POST' });
            console.log(response.status)
            // @ts-ignore
            endpointStatus[endpoint].status = "green"
        } catch (error) {}
    }

    if (mongoose.connection.readyState === 1){
        endpointStatus.db.status = "green"
    }

    return endpointStatus;
});