export const resolveRefs = (data) => {
    const idMap = {};
    const resolve = (item) => {
        if (item["$ref"]) {
            return idMap[item["$ref"].replace("$id:", "")];
        }
        if (item["$id"]) {
            idMap[item["$id"]] = item;
        }
        for (const key in item) {
            if (typeof item[key] === "object" && item[key] !== null) {
                item[key] = resolve(item[key]);
            }
        }
        return item;
    };
    return resolve(JSON.parse(JSON.stringify(data)));
};
