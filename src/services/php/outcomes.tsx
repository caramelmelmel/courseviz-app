import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

type MORes = {
    mo_id: string,
    pillar_id: string,
    course_id: string,
    label: string,
    description: string
}

async function create(mo: MOView, cid: number, pid: number): Promise<[MO | null, ServiceError | null]> {
    const res = await axios.post(BASE_URL + `/admin/measurableOutcome/create.php`, {
        course_id: cid,
        pillar_id: pid,
        label: mo.id,
        description: mo.name
    });

    const m = {
        id_int: 0,
        id: mo.id,
        course_id: cid,
        pillar_id: pid,
        name: mo.name,
    }

    return [m, null]
}

async function read(id: number): Promise<[MO | null, ServiceError | null]> {
    const res = await axios.post<MORes>(BASE_URL + `/getSingleMo.php?id=${id}`);

    const m = res.data;

    const mo = {
        id_int: Number(m.mo_id),
        id: m.label,
        course_id: Number(m.course_id),
        pillar_id: Number(m.pillar_id),
        name: m.description,
    }

    return [mo, null]
}

async function readAll(cid: number | null = null): Promise<[MO[] | null, ServiceError | null]> {
    const q = cid == null ? `` : `?id=${cid}`; 
    const res = await axios.get<MORes[]>(BASE_URL + `/getAllMOs.php` + q);


    const ms = res.data;

    let mos = ms.map(m => ({
        id_int: Number(m.mo_id),
        id: m.label,
        course_id: Number(m.course_id),
        pillar_id: Number(m.pillar_id),
        name: m.description,
    }));

    if (cid != null) {
        mos = mos.filter((m) => m.course_id == cid);
    }

    return [mos, null]
}

async function update(id: number, mo: MOView, error = false): Promise<[MO | null, ServiceError | null]> {
    return [null, { message: "not implemented" }];
}

async function del(id: number): Promise<ServiceError | null> {
    return { message: "not implemented" };
}

const mockOutcomesService = {
    create,
    read,
    readAll,
    update,
    delete: del,
}

export default mockOutcomesService;
