type Pillar = {
    id: number,
    name: string,
    description: string,
    website: string,
}

type PillarView = {
    name: string,
    description: string,
    website: string,
}

type Course = {
    id_int: number,
    id: string,
    pillar_id: Pillar["id"],
    name: string,
    description: string,
}

type CourseView = {
    id: string,
    name: string,
    description: string,
}

// Measureable Outcome
type MO = {
    id_int: number,
    id: string,
    course_id: Course["id_int"],
    pillar_id: Pillar["id"],
    name: string,
}

type MOView = {
    id: string,
    name: string,
}

// Links are directed from src -> dst
type MOLink = {
    src: MO["id_int"],
    dst: MO["id_int"],
}

// Error type for all service methods (create, read, update, delete)
type ServiceError = {
    message: string,
}

type EntityService<T, TV> = {
    async create(i: TV, ...rest: any[]): Promise<[T | null, ServiceError | null]>
    async read(id: string | number, ...rest: any[]): Promise<[T | null, ServiceError | null]>
    async readAll(...rest: any[]): Promise<[T[] | null, ServiceError | null]>
    async update(id: string | number, i: TV, ...rest: any[]): Promise<[T | null, ServiceError | null]>
    async delete(id: string | number, ...rest: any[]): Promise<ServiceError | null>
}

type RelationshipSevice<T> = {
    async create(src: string | number, dst: string | number, ...rest: any[]): Promise <[T | null, ServiceError | null]>
    async readAll(...rest: any[]): Promise<[T[] | null, ServiceError | null]>
    async delete(src: string | number, dst: string | number, ...rest: any[]): Promise<ServiceError | null>
}
