import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

type CourseRes = {
    id: string,
    pillar_id: string,
    label: string,
    name: string,
    description: string,
}

async function create(course: CourseView, pid: number): Promise<[Course | null, ServiceError | null]> {
    const res = await axios.post(BASE_URL + "/admin/course/create.php", {
        name: course.name,
        description: course.name,
        label: course.id,
        pillar_id: pid,
    });

    const c = {
        ...course,
        id_int: 0,
        pillar_id: pid,
    };

    return [c, null]
}

async function read(id: number): Promise<[Course | null, ServiceError | null]> {
    const res = await axios.get<CourseRes>(BASE_URL + `/getSingleCourse.php?id=${id}`);
    const c = res.data;

    const course = {
        id_int: Number(c.id),
        id: c.label,
        pillar_id: Number(c.pillar_id),
        name: c.name,
        description: c.description,
    }

    return [course, null]
}

async function readAll(pid: number | null = null): Promise<[Course[] | null, ServiceError | null]> {
    const res = await axios.get<CourseRes[]>(BASE_URL + `/getallcourse.php`);
    const cs = res.data;

    let courses = cs.map((c) => ({
        id_int: Number(c.id),
        id: c.label,
        pillar_id: Number(c.pillar_id),
        name: c.name,
        description: c.description,
    }));

    if (pid != null) {
        courses = courses.filter((c) => c.pillar_id == pid);
    }

    return [courses, null];
}

async function update(id: number, course: CourseView): Promise<[Course | null, ServiceError | null]> {
    return [null, { message: "not implemented" }];
}

async function del(id: number): Promise<ServiceError | null> {
    return { message: "not implemented" };
}

const mockCoursesService = {
    create,
    read,
    readAll,
    update,
    delete: del,
};

export default mockCoursesService;