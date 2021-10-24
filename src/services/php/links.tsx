import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

async function create(src: number, dst: number): Promise<[MOLink | null, ServiceError | null]> {
    const res = axios.post(BASE_URL + `/admin/measurableOutcome/create_link.php`, {
        src_id: src,
        dst_id: dst,
    })

    const l = {
        src,
        dst,
    }

    return [l, null];
}

async function readAll(dst: number | null = null): Promise<[MOLink[] | null, ServiceError | null]> {
    const res = await axios.get<any[]>(BASE_URL + `/getAllPrereq.php`);

    let ls = res.data || [];

    ls = ls.map((l) => ({
        src: Number(l.src_mo_id),
        dst: Number(l.dst_mo_id),
    }))

    if (dst != null) {
        ls = ls.filter(l => l.dst == dst);
    }

    return [ls, null];
}

async function del(src: number, dst: number): Promise<ServiceError | null> {
    const res = axios.post(BASE_URL + `/admin/measurableOutcome/delete_link.php`, {
        src_id: src,
        dst_id: dst,
    })

    return null;
}

const mockLinksService = {
    create,
    readAll,
    delete: del,
}

export default mockLinksService;
