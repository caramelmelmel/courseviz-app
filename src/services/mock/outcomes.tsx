const mockOutcomes: MO[] = [
    { id_int: 0, id: "MO 1", course_id: 0, pillar_id: 0, name: "Identify and describe the requirements for an information system." },
    { id_int: 1, id: "MO 2", course_id: 0, pillar_id: 0, name: "Use object-oriented methodology to produce a modular and testable design." },
    { id_int: 2, id: "MO 3", course_id: 0, pillar_id: 0, name: "Work as part of a team to produce a working system on time." },
    { id_int: 3, id: "MO 1", course_id: 2, pillar_id: 0, name: "Design medium-scale software system from scratch: formulating and analyzing the problem to be solved;" },
    { id_int: 4, id: "MO 2", course_id: 2, pillar_id: 0, name: "Apply key software engineering ideas, including invariants, decoupling, and data abstraction." },
    { id_int: 5, id: "MO 3", course_id: 2, pillar_id: 4, name: "Apply key software engineering ideas, including software design, specification, abstraction, verification and correctness." },
    { id_int: 6, id: "MO 1", course_id: 4, pillar_id: 4, name: "Analyse different algorithms’s complexity in terms of computation time using Python computational model." },
    { id_int: 7, id: "MO 2", course_id: 4, pillar_id: 4, name: "Identify recursive structure in a problem and implement its solution in Python." },
    { id_int: 8, id: "MO 3", course_id: 4, pillar_id: 4, name: "Explain UML diagrams and design software using basic UML diagrams." },
]

async function mockCreate(mo: MOView, cid: number, pid: number, error = false): Promise<[MO | null, ServiceError | null]> {
    if (error) {
        return [null, { message: "mock error" }];
    }

    const final = mockOutcomes.at(-1);
    let i: number;
    if (!final) {
        i = 1;
    }
    else {
        i = final.id_int + 1;
    }

    const m = {
        id_int: i,
        course_id: cid,
        pillar_id: pid,
        ...mo
    }

    mockOutcomes.push(m);

    return [m, null];
}

async function mockRead(id: number, error = false): Promise<[MO | null, ServiceError | null]> {
    if (error) {
        return [null, { message: "mock error" }];
    }

    const mo = mockOutcomes.find((m) => m.id_int === id);
    if (!mo) {
        return [null, { message: "outcome not found" }];
    }

    return [mo, null];
}

async function mockReadAll(cid: number | null = null, error = false): Promise<[MO[] | null, ServiceError | null]> {
    if (error) {
        return [null, { message: "mock error" }];
    }

    if (cid != null) {
        return [
            mockOutcomes.filter(m => m.course_id === cid),
            null
        ]

    }

    return [mockOutcomes, null];
}

async function mockUpdate(id: number, mo: MOView, error = false): Promise<[MO | null, ServiceError | null]> {
    if (error) {
        return [null, { message: "mock error" }];
    }

    const m = mockOutcomes.findIndex((m) => m.id_int === id);
    if (m === -1) {
        return [null, { message: "outcome not found" }];
    }

    mockOutcomes[m] = { ...mockOutcomes[m], ...mo };

    return [mockOutcomes[m], null];
}

async function mockDelete(id: number, error = false): Promise<ServiceError | null> {
    if (error) {
        return { message: "mock error" };
    }

    const m = mockOutcomes.findIndex((m) => m.id_int === id);
    if (m === -1) {
        return { message: "outcome not found" };
    }

    mockOutcomes.splice(m, 1);

    return null;
}

const mockOutcomesService = {
    create: mockCreate,
    read: mockRead,
    readAll: mockReadAll,
    update: mockUpdate,
    delete: mockDelete,
}

export default mockOutcomesService;
