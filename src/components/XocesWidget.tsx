import React, { useEffect } from 'react';
import xoces from 'xoces';

const XocesWidget: React.FC<{ pillars: Pillar[], courses: Course[], mos: MO[], moLinks: MOLink[], key: any }> = ({
    pillars,
    courses,
    mos,
    moLinks,
    key,
}) => {
    const CONTAINER_ID = "xoces-widget-container";

    // set up entities
    const entities: Entity[] = [
        { id: "sutd", name: "SUTD", type: "school" },
        ...pillars.map((p) => ({ id: "pillar_" + p.id, name: p.name, type: "pillar" })),
        ...courses.map((c) => ({ id: "course_" + c.id_int, name: `${c.id} - ${c.name}`, type: "course" })),
        ...mos.map((m) => ({ id: "mo_" + m.id_int, name: `${m.id} - ${m.name}`, type: "mo" })),
    ]

    // set up relationships
    const relationships: Relationship[] = [];

    // school -> pillar
    pillars.forEach((p) => {
        relationships.push({
            type: "HAS_PARENT_OF",
            directionality: "DIRECTED",
            sourceId: "pillar_" + p.id,
            targetId: "sutd",
        })
    })

    // pillar -> course
    courses.forEach((c) => {
        relationships.push({
            type: "HAS_PARENT_OF",
            directionality: "DIRECTED",
            sourceId: "course_" + c.id_int,
            targetId: "pillar_" + c.pillar_id,
        })
    })

    // mo -> pillar
    mos.forEach((mo) => {
        relationships.push({
            type: "HAS_PARENT_OF",
            directionality: "DIRECTED",
            sourceId: "mo_" + mo.id_int,
            targetId: "course_" + mo.course_id,
        })
    })

    // mo links
    moLinks.forEach((mol) => {
        // reverse the direction of arrows, since we want
        // prereq_mo -> mo instead of the opposite
        const src = mol.dst;
        const dst = mol.src;

        relationships.push({
            type: "HAS_PREREQUISITE_OF",
            directionality: "DIRECTED",
            sourceId: "mo_" + src,
            targetId: "mo_" + dst,
        })
    })

    const xocesConfig: XocesConfig = {
        hierarchy: ["school", "pillar", "course", "mo"],
        data: {
            entities,
            relationships,
        },
        entityLabelKey: "name",
        relationship: {
            parentType: "HAS_PARENT_OF",
            sourceRef: "sourceId",
            targetRef: "targetId",
        },
        width: "100%",
        height: "32rem",
        colorScheme: "light",
    }

    useEffect(() => {
        console.log(xocesConfig);
        const w = xoces.widgets.XocesWidget.new(xocesConfig);
        w.render({ container: CONTAINER_ID + String(key) });
    }, []);

    return (
        <div id={CONTAINER_ID + String(key) }></div>
    )
}

export default XocesWidget;