
export default defineEventHandler(async (event) => {

    let results:any = []

    try {
        results = await Result.find({})
    } catch (e) {
        console.log("Error finding results")
    }

    console.log(results)

    return {
        results: results
    };
});