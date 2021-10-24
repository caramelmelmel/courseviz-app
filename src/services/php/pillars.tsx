import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

let mockPillars: Pillar[] = [
    { id: 0, name: "ISTD", description: "Information Systems Technology and Design", website: "https://istd.sutd.edu.sg" },
    { id: 1, name: "EPD", description: "Engineering Product Development", website: "https://epd.sutd.edu.sg" },
    { id: 2, name: "ESD", description: "Engineering Systems Design", website: "https://esd.sutd.edu.sg" },
    { id: 3, name: "ASD", description: "Architecture and Sustainable Design", website: "https://asd.sutd.edu.sg" },
    { id: 4, name: "Freshmore", description: "Freshmore Term", website: "https://smt.sutd.edu.sg" },
]

async function create(pillar: PillarView): Promise<[Pillar | null, ServiceError | null]> {
    return [null, { message: "not implemented" }];

}

async function read(id: number): Promise<[Pillar | null, ServiceError | null]> {
    const res = await axios.get<Pillar>(BASE_URL + `/read_single_pillar.php?id=${id}`);

    const pillar = res.data;

    return [pillar, null];
}

async function readAll(): Promise<[Pillar[] | null, ServiceError | null]> {
    const res = await axios.get<Pillar[]>(BASE_URL + "/getallpillar.php");

    const pillars = res.data;

    return [pillars, null]
}

async function update(id: number, pillar: PillarView): Promise<[Pillar | null, ServiceError | null]> {
    return [null, { message: "not implemented" }];
}

async function del(id: number): Promise<ServiceError | null> {
    return { message: "not implemented" };
}

const mockPillarsService = {
    create,
    read,
    readAll,
    update,
    delete: del,
}

export default mockPillarsService;