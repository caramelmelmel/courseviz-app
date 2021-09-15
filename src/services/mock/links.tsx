const mockLinks: MOLink[] = [
    {src: 4, dst: 1},
    {src: 5, dst: 1},
    {src: 0, dst: 6},
    {src: 0, dst: 7},
    {src: 0, dst: 8},
]

async function mockCreate(src: number, dst: number, error=false): Promise <[MOLink | null, ServiceError | null]> {
    if (error) {
        return [null, { message: "mock error" }];
    }

    const link = mockLinks.find((l) => l.src === src && l.dst === dst );
    if (link != null){
        return [null, { message: "link already exists" }];
    }

    const l = {src, dst};
    mockLinks.push(l);

    return [l, null];
}

async function mockReadAll(src: number | null = null, error = false): Promise<[MOLink[] | null, ServiceError | null]> {
    if (error) {
        return [null, { message: "mock error" }];
    }

    if (src != null) {
        return [
            mockLinks.filter((l) => l.src === src),
            null,
        ]
    }

    return [mockLinks, null];
}

async function mockDelete(src: number, dst: number, error=false): Promise <ServiceError | null> {
    if (error) {
        return { message: "mock error" };
    }

    const i = mockLinks.findIndex((l) => l.src === src && l.dst === dst);
    if (i === -1){
        return { message: "link does not exists" };
    }

    mockLinks.splice(i, 1);

    return null;
}

const mockLinksService = {
    create: mockCreate,
    readAll: mockReadAll,
    delete: mockDelete,
}

export default mockLinksService;
