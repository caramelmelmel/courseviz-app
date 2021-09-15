import mockCourses from "./mock/courses";
import mockPillars from "./mock/pillars";
import mockOutcomes from "./mock/outcomes";
import mockLinks from "./mock/links";

const MOCK : boolean = process.env.REACT_APP_API_MODE?.toLowerCase() === "mock";

const services : {
    pillars: EntityService<Pillar, PillarView>,
    courses: EntityService<Course, CourseView>,
    outcomes: EntityService<MO, MOView>,
    links: RelationshipSevice<MOLink>,
} = {
    pillars: mockPillars,
    courses: mockCourses,
    outcomes: mockOutcomes,
    links: mockLinks,
}

export default services;
