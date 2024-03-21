import { User } from "~/server/models/user.model";
import mongoose from "mongoose";

export default defineEventHandler(async (event) => {

    const config = useRuntimeConfig(event)

    const endpointStatus = {
        pspWizard: {
            domain: "http://"+config.public.pspDomain+":"+config.public.pspPort,
            status: "red"
        },
        miSim: {
            domain: "http://"+config.public.miSimDomain+":"+config.public.miSimPort,
            status: "red"
        },
        tbVerifier: {
            domain: "http://"+config.public.tbVerifierDomain+":"+config.public.tbVerifierPort,
            status: "red"
        },
        tqPropRefiner: {
            domain: "http://tqproprefiner:80",
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
            // @ts-ignore
            endpointStatus[endpoint].status = "green"
        } catch (error) {}
    }

    if (mongoose.connection.readyState === 1){
        endpointStatus.db.status = "green"
    }

    return endpointStatus;
});