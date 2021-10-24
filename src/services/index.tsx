import mockCourses from "./mock/courses";
import mockPillars from "./mock/pillars";
import mockOutcomes from "./mock/outcomes";
import mockLinks from "./mock/links";

import courses from "./php/courses";
import pillars from "./php/pillars";
import outcomes from "./php/outcomes";
import links from "./php/links";

const MOCK: boolean = process.env.REACT_APP_API_MODE?.toLowerCase() === "mock";

const services: {
    pillars: EntityService<Pillar, PillarView>,
    courses: EntityService<Course, CourseView>,
    outcomes: EntityService<MO, MOView>,
    links: RelationshipSevice<MOLink>,
} = {
    pillars: MOCK ? mockPillars : pillars,
    courses: MOCK ? mockCourses : courses,
    outcomes: MOCK ? mockOutcomes : outcomes,
    links: MOCK ? mockLinks: links,
}

export default services;
