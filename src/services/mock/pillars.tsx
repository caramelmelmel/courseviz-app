let mockPillars: Pillar[] = [
    { id: 0, name: "ISTD", description: "Information Systems Technology and Design", website: "https://istd.sutd.edu.sg" },
    { id: 1, name: "EPD", description: "Engineering Product Development", website: "https://epd.sutd.edu.sg" },
    { id: 2, name: "ESD", description: "Engineering Systems Design", website: "https://esd.sutd.edu.sg" },
    { id: 3, name: "ASD", description: "Architecture and Sustainable Design", website: "https://asd.sutd.edu.sg" },
    { id: 4, name: "Freshmore", description: "Freshmore Term", website: "https://smt.sutd.edu.sg" },
]

async function mockCreate(pillar: PillarView, error = false): Promise<[Pillar | null, ServiceError | null]> {
    if (error) {
        return [null, { message: "mock error" }];
    }

    const final = mockPillars.at(-1);
    let i: number;
    if (!final) {
        i = 1;
    }
    else {
        i = final.id + 1;
    }

    const p = {
        id: i,
        ...pillar,
    }

    mockPillars = [...mockPillars, p];

    return [p, null];
}

async function mockRead(id: number, error = false): Promise<[Pillar | null, ServiceError | null]> {
    if (error) {
        return [null, { message: "mock error" }];
    }

    const pillar = mockPillars.find((p) => p.id === id);
    if (!pillar) {
        return [null, { message: "pillar not found" }];
    }

    return [pillar, null];
}

async function mockReadAll(error = false): Promise<[Pillar[] | null, ServiceError | null]> {
    if (error) {
        return [null, { message: "mock error" }];
    }

    return [mockPillars, null];
}

async function mockUpdate(id: number, pillar: PillarView, error = false): Promise<[Pillar | null, ServiceError | null]> {
    if (error) {
        return [null, { message: "mock error" }];
    }

    const p = mockPillars.findIndex((p) => p.id === id);
    if (p === -1) {
        return [null, { message: "pillar not found" }];
    }
    
    mockPillars[p] = { id, ...pillar };

    return [mockPillars[p], null];
}

async function mockDelete(id: number, error = false): Promise<ServiceError | null> {
    if (error) {
        return { message: "mock error" };
    }

    const p = mockPillars.findIndex((p) => p.id === id);
    if (p === -1) {
        return { message: "pillar not found" };
    }

    mockPillars = mockPillars.filter((p) => p.id !== id);

    return null;
}

const mockPillarsService = {
    create: mockCreate,
    read: mockRead,
    readAll: mockReadAll,
    update: mockUpdate,
    delete: mockDelete,
}

export default mockPillarsService;