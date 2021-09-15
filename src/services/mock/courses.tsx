const mockCourses: Course[] = [
    { id_int: 0, id: "50.001", pillar_id: 0, name: "Introduction to Information Systems and Programming", description: "This course is an introduction to the design and programming of information systems." },
    { id_int: 1, id: "50.002", pillar_id: 0, name: "Computation Structures", description: "This course introduces architecture of digital systems, emphasising structural principles common to a wide range of technologies." },
    { id_int: 2, id: "50.003", pillar_id: 0, name: "Elements of Software Construction", description: "This course is an introduction to the fundamental principles and techniques of software construction that have greatest impact on practice. " },
    { id_int: 3, id: "50.004", pillar_id: 0, name: "Algorithms", description: "This course is an introduction to algorithms and algorithmic thinking." },
    { id_int: 4, id: "10.020", pillar_id: 4, name: "Data Driven World", description: "Students will dive in into the world of computing and data. " },
]

async function mockCreate(course: CourseView, pid: number, error = false): Promise<[Course | null, ServiceError | null]> {
    if (error) {
        return [null, { message: "mock error" }];
    }

    const final = mockCourses.at(-1);
    let i: number;
    if (!final) {
        i = 1;
    }
    else {
        i = final.id_int + 1;
    }

    const c = {
        id_int: i,
        pillar_id: pid,
        ...course,
    }

    mockCourses.push(c);

    return [c, null];
}

async function mockRead(id: number, error = false): Promise<[Course | null, ServiceError | null]> {
    if (error) {
        return [null, { message: "mock error" }];
    }

    const course = mockCourses.find((c) => c.id_int === id);
    if (!course) {
        return [null, { message: "course not found" }];
    }

    return [course, null];
}

async function mockReadAll(pid: number | null = null, error = false): Promise<[Course[] | null, ServiceError | null]> {
    if (error) {
        return [null, { message: "mock error" }];
    }

    if (pid != null) {
        return [
            mockCourses.filter(c => c.pillar_id === pid),
            null
        ]

    }

    return [mockCourses, null];
}

async function mockUpdate(id: number, course: CourseView, error = false): Promise<[Course | null, ServiceError | null]> {
    if (error) {
        return [null, { message: "mock error" }];
    }

    const c = mockCourses.findIndex((c) => c.id_int === id);
    if (c === -1) {
        return [null, { message: "course not found" }];
    }

    mockCourses[c] = { ...mockCourses[c], ...course };

    return [mockCourses[c], null];
}

async function mockDelete(id: number, error = false): Promise<ServiceError | null> {
    if (error) {
        return { message: "mock error" };
    }

    const c = mockCourses.findIndex((c) => c.id_int === id);
    if (c === -1) {
        return { message: "course not found" };
    }

    mockCourses.splice(c, 1);

    return null;
}

const mockCoursesService = {
    create: mockCreate,
    read: mockRead,
    readAll: mockReadAll,
    update: mockUpdate,
    delete: mockDelete,
};

export default mockCoursesService;